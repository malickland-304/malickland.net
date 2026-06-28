/**
 * MalickLand Listing Worker
 * Cloudflare Worker — Production Ready
 *
 * Routes:
 *   GET  /listing/:slug        → Render listing page
 *   GET  /listings             → Listing index page
 *   GET  /api/listings         → JSON API (for Next.js / external)
 *   GET  /api/listing/:slug    → JSON API for single listing
 *   POST /api/save             → Save/update a listing (Bearer auth)
 *   POST /api/lead             → Capture a lead (no auth)
 *   GET  /api/health           → Health check
 *   *                          → 404
 *
 * KV Namespace: LISTINGS
 *   key: listing:{slug}        → full listing JSON
 *   key: __index               → array of index objects [{slug,title,price,...}]
 *   key: leads:{timestamp}-{random} → lead JSON
 *
 * Environment Variables (set in Cloudflare dashboard or wrangler.toml):
 *   API_TOKEN   — secret token for /api/save
 *   LEADS_WEBHOOK — optional: URL to POST leads to (e.g., Google Apps Script)
 */

// ─── BRAND CONSTANTS ──────────────────────────────────────────────────────────
const BRAND = {
  name: 'MalickLand',
  tagline: 'WV Real Estate Agency',
  phone: '(540) 246-1421',
  email: 'phil@malickland.net',
  agent: 'Phil Malick',
  site: 'https://malickland.net',
  colors: { forest: '#1C3A1C', forestDark: '#142814', gold: '#C4A040', goldLight: '#D4B050' },
};

const ALLOWED_ORIGINS = ['https://malickland.net', 'https://www.malickland.net', 'http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'];
const DEFAULT_CORS_ORIGIN = 'https://malickland.net';
const SAVE_PAYLOAD_LIMIT_BYTES = 500_000;
const LEAD_PAYLOAD_LIMIT_BYTES = 10_000;

function getCorsHeaders(request) {
  const origin = request?.headers.get('Origin');
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : DEFAULT_CORS_ORIGIN;
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

// ─── MAIN HANDLER ─────────────────────────────────────────────────────────────
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    const corsHeaders = getCorsHeaders(request);

    // CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    try {
      // ── API Routes ──
      if (method === 'POST' && path === '/api/save') return handleSave(request, env);
      if (method === 'POST' && path === '/api/lead') return handleLead(request, env);
      if (method === 'GET' && path === '/api/listings') return handleApiListings(request, env);
      if (method === 'GET' && path === '/api/health') return json({ ok: true, ts: Date.now() }, 200, corsHeaders);

      const apiSlugMatch = path.match(/^\/api\/listing\/([a-z0-9-]+)$/);
      if (apiSlugMatch) return handleApiListing(request, apiSlugMatch[1], env);

      // ── Page Routes ──
      if (method === 'GET' && (path === '/listings' || path === '/listings/')) {
        return Response.redirect('https://malickland.net/listings', 301);
      }
      const slugMatch = path.match(/^\/listing\/([a-z0-9-]+)\/?$/);
      if (method === 'GET' && slugMatch) return renderListingPage(request, slugMatch[1], env);

    } catch (err) {
      console.error(err);
      return new Response(`Internal error: ${err.message}`, { status: 500, headers: corsHeaders });
    }

    return render404(request);
  }
};

// ─── SAVE LISTING ─────────────────────────────────────────────────────────────
async function handleSave(request, env) {
  // Auth check
  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.replace('Bearer ', '').trim();
  const corsHeaders = getCorsHeaders(request);
  if (!token || token !== env.API_TOKEN) {
    return json({ success: false, error: 'Unauthorized' }, 401, corsHeaders);
  }

  let listing;
  try {
    const text = await request.text();
    if (text.length > SAVE_PAYLOAD_LIMIT_BYTES) return json({ success: false, error: 'Payload too large' }, 413, corsHeaders);
    listing = JSON.parse(text);
  }
  catch (e) { return json({ success: false, error: 'Invalid JSON' }, 400, corsHeaders); }

  // Validate required fields
  if (!listing.slug || !listing.title || !listing.price) {
    return json({ success: false, error: 'Missing required fields: slug, title, price' }, 400, corsHeaders);
  }

  // Sanitize slug
  listing.slug = listing.slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 64);

  listing.updatedAt = new Date().toISOString();
  listing.createdAt = listing.createdAt || listing.updatedAt;
  listing.id = listing.id || generateId();
  listing.url = `${BRAND.site}/listing/${listing.slug}`;

  // Store listing
  await env.LISTINGS.put(`listing:${listing.slug}`, JSON.stringify(listing), {
    metadata: { title: listing.title, price: listing.price, status: listing.status, updatedAt: listing.updatedAt }
  });

  // Update index
  await updateIndex(env, listing);

  return json({
    success: true,
    slug: listing.slug,
    url: listing.url,
    id: listing.id,
  }, 200, corsHeaders);
}

// ─── LEAD CAPTURE ─────────────────────────────────────────────────────────────
async function handleLead(request, env) {
  const corsHeaders = getCorsHeaders(request);
  let lead;
  try {
    const text = await request.text();
    if (text.length > LEAD_PAYLOAD_LIMIT_BYTES) return json({ success: false, error: 'Payload too large' }, 413, corsHeaders);
    lead = JSON.parse(text);
  }
  catch (e) { return json({ success: false, error: 'Invalid JSON' }, 400, corsHeaders); }

  if (!lead.name || !lead.phone && !lead.email) {
    return json({ success: false, error: 'Name and phone or email required' }, 400, corsHeaders);
  }

  // Basic spam protection: check CF-IPCountry
  const country = request.headers.get('CF-IPCountry') || 'US';

  const leadRecord = {
    id: generateId(),
    name: String(lead.name).slice(0, 100),
    phone: String(lead.phone || '').slice(0, 20),
    email: String(lead.email || '').slice(0, 200),
    message: String(lead.message || '').slice(0, 1000),
    listingSlug: String(lead.listingSlug || '').slice(0, 64),
    listingTitle: String(lead.listingTitle || '').slice(0, 200),
    listingPrice: lead.listingPrice || null,
    country,
    ip: request.headers.get('CF-Connecting-IP') || 'unknown',
    createdAt: new Date().toISOString(),
    source: 'listing-page',
  };

  // Store in KV
  const key = `lead:${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  await env.LISTINGS.put(key, JSON.stringify(leadRecord), {
    expirationTtl: 60 * 60 * 24 * 365, // 1 year
  });

  // Forward to Google Sheets / webhook if configured
  if (env.LEADS_WEBHOOK) {
    try {
      await fetch(env.LEADS_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'lead', ...leadRecord }),
      });
    } catch(e) { console.error('Lead webhook failed:', e); }
  }

  return json({ success: true, id: leadRecord.id }, 200, corsHeaders);
}

// ─── API: ALL LISTINGS (JSON) ──────────────────────────────────────────────────
async function handleApiListings(request, env) {
  const corsHeaders = getCorsHeaders(request);
  const url = new URL(request.url);
  const status = url.searchParams.get('status');
  const type = url.searchParams.get('type');
  const county = url.searchParams.get('county');

  const index = await getIndex(env);
  let listings = index;

  if (status) listings = listings.filter(l => l.status?.toLowerCase() === status.toLowerCase());
  if (type) listings = listings.filter(l => l.type?.toLowerCase() === type.toLowerCase());
  if (county) listings = listings.filter(l => l.county?.toLowerCase().includes(county.toLowerCase()));

  return json({ listings, count: listings.length }, 200, corsHeaders);
}

// ─── API: SINGLE LISTING (JSON) ───────────────────────────────────────────────
async function handleApiListing(request, slug, env) {
  const corsHeaders = getCorsHeaders(request);
  const raw = await env.LISTINGS.get(`listing:${slug}`);
  if (!raw) return json({ error: 'Listing not found' }, 404, corsHeaders);
  return json(JSON.parse(raw), 200, corsHeaders);
}

// ─── INDEX MANAGEMENT ─────────────────────────────────────────────────────────
async function getIndex(env) {
  const raw = await env.LISTINGS.get('__index');
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

async function updateIndex(env, listing) {
  let index = await getIndex(env);
  // Remove existing entry for this slug
  index = index.filter(i => i.slug !== listing.slug);
  // Add updated entry (lightweight — no images)
  index.unshift({
    slug: listing.slug,
    title: listing.title,
    price: listing.price,
    city: listing.city,
    county: listing.county,
    type: listing.type,
    status: listing.status,
    beds: listing.beds,
    baths: listing.baths,
    sqft: listing.sqft,
    acres: listing.acres,
    cover: listing.images?.[0] || null,
    createdAt: listing.createdAt,
    updatedAt: listing.updatedAt,
    url: listing.url,
  });
  await env.LISTINGS.put('__index', JSON.stringify(index));
}

// ─── RENDER LISTING PAGE ──────────────────────────────────────────────────────
async function renderListingPage(request, slug, env) {
  const raw = await env.LISTINGS.get(`listing:${slug}`);
  if (!raw) return render404(request);
  const L = JSON.parse(raw);
  return new Response(buildListingPageHTML(L), {
    headers: { 'Content-Type': 'text/html;charset=UTF-8', ...getCorsHeaders(request) },
  });
}

function buildListingPageHTML(L) {
  const price = L.price ? '$' + Number(L.price).toLocaleString() : 'Price TBD';
  const location = [L.city, L.county, 'West Virginia'].filter(Boolean).join(', ');
  const statsArr = [
    L.beds != null ? `${L.beds} Bed${L.beds !== 1 ? 's' : ''}` : null,
    L.baths != null ? `${L.baths} Bath${L.baths !== 1 ? 's' : ''}` : null,
    L.sqft ? `${Number(L.sqft).toLocaleString()} Sq Ft` : null,
    L.acres ? `${L.acres} Acres` : null,
    L.yearBuilt ? `Built ${L.yearBuilt}` : null,
  ].filter(Boolean);

  const images = (L.images || []).slice(0, 8);
  const hasImages = images.length > 0;
  const statusColor = L.status === 'Active' ? '#16a34a' : L.status === 'Pending' ? '#d97706' : '#6b7280';

  // Schema.org structured data
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: L.title,
    description: L.description || '',
    url: L.url,
    price: L.price,
    priceCurrency: 'USD',
    address: {
      '@type': 'PostalAddress',
      streetAddress: L.address,
      addressLocality: L.city,
      addressRegion: 'WV',
      postalCode: L.zip || '',
      addressCountry: 'US',
    },
    image: images[0] ? [images[0]] : [],
    offerCount: 1,
    availability: L.status === 'Active' ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escH(L.title)} — ${price} | MalickLand WV Real Estate</title>
  <meta name="description" content="${escH((L.description || '').slice(0, 155) || `${price} · ${L.type} in ${location}`)}"/>
  <meta name="keywords" content="West Virginia real estate, ${escH(L.city || '')} WV, ${escH(L.county || '')}, ${escH(L.type || '')} for sale, MalickLand"/>
  <meta property="og:title" content="${escH(L.title)} — ${price}"/>
  <meta property="og:description" content="${escH((L.description || '').slice(0, 200))}"/>
  <meta property="og:type" content="website"/>
  <meta property="og:url" content="${escH(L.url || '')}"/>
  ${hasImages ? `<meta property="og:image" content="${escH(images[0].slice(0, 200))}"/>` : ''}
  <meta name="twitter:card" content="summary_large_image"/>
  <link rel="canonical" href="${escH(L.url || '')}"/>
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --forest: #1C3A1C; --forest-dark: #142814; --forest-light: #254E25;
      --gold: #C4A040; --gold-light: #D4B050;
      --text: #1a1a1a; --muted: #6b7280; --border: #e5e7eb; --bg: #f9fafb;
    }
    html { scroll-behavior: smooth; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: var(--bg); color: var(--text); }

    /* NAV */
    .nav { background: var(--forest); color: white; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 12px rgba(0,0,0,.3); }
    .nav-inner { max-width: 1100px; margin: 0 auto; padding: 0 20px; height: 58px; display: flex; align-items: center; justify-content: space-between; }
    .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; color: white; }
    .nav-logo-text { font-weight: 800; font-size: 17px; letter-spacing: .3px; }
    .nav-logo-sub { font-size: 9px; color: #86efac; letter-spacing: 3px; text-transform: uppercase; line-height: 1; }
    .nav-cta { display: flex; gap: 10px; align-items: center; }
    .btn-call { background: var(--gold); color: white; text-decoration: none; padding: 8px 18px; border-radius: 6px; font-weight: 700; font-size: 13px; white-space: nowrap; transition: background .15s; }
    .btn-call:hover { background: var(--gold-light); }
    .btn-outline { border: 1.5px solid rgba(255,255,255,.4); color: white; text-decoration: none; padding: 7px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; transition: border-color .15s; }
    .btn-outline:hover { border-color: white; }

    /* HERO / GALLERY */
    .gallery { background: #111; position: relative; max-height: 520px; overflow: hidden; }
    .gallery-main { width: 100%; height: 420px; object-fit: cover; display: block; }
    .gallery-main-placeholder { width: 100%; height: 420px; background: linear-gradient(135deg, var(--forest), #254E25); display: flex; align-items: center; justify-content: center; }
    .gallery-strip { display: flex; gap: 4px; background: #000; padding: 4px; overflow-x: auto; scrollbar-width: none; }
    .gallery-strip::-webkit-scrollbar { display: none; }
    .gallery-thumb { width: 80px; height: 60px; object-fit: cover; cursor: pointer; opacity: .65; border: 2px solid transparent; border-radius: 3px; flex-shrink: 0; transition: all .15s; }
    .gallery-thumb.active, .gallery-thumb:hover { opacity: 1; border-color: var(--gold); }
    .gallery-count { position: absolute; bottom: ${hasImages && images.length > 1 ? '72px' : '12px'}; right: 16px; background: rgba(0,0,0,.65); color: white; font-size: 12px; padding: 4px 10px; border-radius: 4px; }
    .status-badge { position: absolute; top: 16px; left: 16px; padding: 4px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; color: white; background: ${statusColor}; }

    /* CONTENT */
    .content { max-width: 1100px; margin: 0 auto; padding: 28px 20px; display: grid; grid-template-columns: 1fr 340px; gap: 28px; }
    @media (max-width: 768px) { .content { grid-template-columns: 1fr; } }

    /* MAIN */
    .main .price { font-size: 32px; font-weight: 900; color: var(--forest); margin-bottom: 4px; }
    .main .address { font-size: 18px; font-weight: 700; color: var(--text); margin-bottom: 6px; }
    .main .location { color: var(--muted); font-size: 14px; display: flex; align-items: center; gap: 6px; margin-bottom: 20px; }
    .type-badge { background: var(--forest); color: white; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; margin-left: 8px; }

    .stats-row { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 24px; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 16px 0; }
    .stat { text-align: center; padding: 8px 16px; background: white; border: 1px solid var(--border); border-radius: 8px; min-width: 80px; }
    .stat-val { font-size: 20px; font-weight: 800; color: var(--forest); }
    .stat-lbl { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); margin-top: 2px; }

    .section-title { font-size: 14px; font-weight: 700; color: var(--forest); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
    .description { font-size: 15px; line-height: 1.7; color: #374151; margin-bottom: 28px; white-space: pre-line; }

    .features-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px; }
    .feat { background: #f0fdf4; border: 1px solid #86efac; color: #166534; border-radius: 20px; padding: 4px 14px; font-size: 13px; display: flex; align-items: center; gap: 4px; }
    .feat::before { content: '✓'; font-weight: 700; }

    .details-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px; margin-bottom: 28px; }
    .detail-item { background: white; border: 1px solid var(--border); border-radius: 8px; padding: 12px; }
    .detail-lbl { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); margin-bottom: 4px; }
    .detail-val { font-size: 14px; font-weight: 700; color: var(--text); }

    /* SIDEBAR */
    .sidebar { }
    .sidebar-card { background: white; border: 1px solid var(--border); border-radius: 12px; overflow: hidden; position: sticky; top: 72px; }
    .sidebar-header { background: var(--forest); padding: 20px; color: white; text-align: center; }
    .sidebar-price { font-size: 26px; font-weight: 900; color: var(--gold); }
    .sidebar-address { font-size: 13px; color: rgba(255,255,255,.8); margin-top: 4px; }
    .sidebar-body { padding: 20px; }
    .sidebar-agent { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid var(--border); }
    .agent-avatar { width: 48px; height: 48px; border-radius: 50%; background: var(--forest); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 18px; flex-shrink: 0; }
    .agent-name { font-weight: 700; font-size: 14px; }
    .agent-title { font-size: 11px; color: var(--muted); }

    /* LEAD FORM */
    .lead-form { display: flex; flex-direction: column; gap: 10px; }
    .form-title { font-weight: 700; color: var(--forest); font-size: 14px; margin-bottom: 4px; }
    .inp { width: 100%; border: 1px solid #d1d5db; border-radius: 6px; padding: 9px 12px; font-size: 13px; outline: none; transition: border-color .15s; font-family: inherit; }
    .inp:focus { border-color: var(--forest); box-shadow: 0 0 0 2px rgba(28,58,28,.1); }
    .inp-ta { resize: vertical; min-height: 80px; }
    .submit-btn { background: var(--forest); color: white; border: none; border-radius: 8px; padding: 12px; font-size: 14px; font-weight: 700; cursor: pointer; width: 100%; transition: background .15s; display: flex; align-items: center; justify-content: center; gap: 6px; }
    .submit-btn:hover { background: var(--forest-dark); }
    .submit-btn:disabled { background: #9ca3af; cursor: not-allowed; }
    .cta-row { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
    .cta-phone { background: var(--gold); color: white; text-decoration: none; padding: 12px; border-radius: 8px; font-weight: 700; font-size: 14px; text-align: center; display: block; transition: background .15s; }
    .cta-phone:hover { background: var(--gold-light); }
    .cta-sms { border: 1.5px solid var(--forest); color: var(--forest); text-decoration: none; padding: 10px; border-radius: 8px; font-weight: 700; font-size: 13px; text-align: center; display: block; transition: all .15s; }
    .cta-sms:hover { background: var(--forest); color: white; }

    /* FOOTER */
    .footer { background: var(--forest-dark); color: #9ca3af; text-align: center; padding: 28px 20px; margin-top: 48px; font-size: 12px; }
    .footer a { color: var(--gold); text-decoration: none; }
    .footer-logo { color: white; font-weight: 800; font-size: 16px; margin-bottom: 4px; }

    /* Success state */
    .form-success { display: none; text-align: center; padding: 20px; }
    .form-success.show { display: block; }
    .lead-form.hidden { display: none; }

    /* Responsive */
    @media (max-width: 640px) {
      .gallery-main { height: 260px; }
      .main .price { font-size: 24px; }
      .main .address { font-size: 15px; }
      .stats-row { gap: 8px; }
      .stat { padding: 8px 10px; }
    }
  </style>
</head>
<body>

<!-- NAV -->
<nav class="nav">
  <div class="nav-inner">
    <a href="${BRAND.site}" class="nav-logo">
      <svg viewBox="0 0 100 100" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
        <path d="M50,16 L50,4 C28,4 2,20 2,50 C2,80 28,96 50,96 L50,84 C32,80 14,67 14,50 C14,33 32,20 50,16 Z" fill="#142814"/>
        <path d="M50,16 L50,4 C72,4 98,20 98,50 C98,80 72,96 50,96 L50,84 C68,80 86,67 86,50 C86,33 68,20 50,16 Z" fill="#142814"/>
        <circle cx="50" cy="50" r="34" fill="#C4A040"/>
        <path d="M17,68 L28,32 L36,46 L43,24 L50,14 L57,24 L64,46 L72,32 L83,68 Z" fill="#1C3A1C"/>
        <path d="M44,26 L47,34 L50,28 L53,34 L56,26 L52,32 L50,18 L48,32 Z" fill="white"/>
        <path d="M38,68 C32,72 31,80 36,85 C40,89 60,89 64,85 C69,80 68,72 62,68 C57,64 43,64 38,68 Z" fill="#1C3A1C"/>
      </svg>
      <div>
        <div class="nav-logo-text">MalickLand</div>
        <div class="nav-logo-sub">WV Real Estate Agency</div>
      </div>
    </a>
    <div class="nav-cta">
      <a href="${BRAND.site}/listings" class="btn-outline">All Listings</a>
      <a href="tel:${BRAND.phone.replace(/\D/g,'')}" class="btn-call">📞 ${BRAND.phone}</a>
    </div>
  </div>
</nav>

<!-- GALLERY -->
<div class="gallery">
  ${hasImages
    ? `<img id="gallery-main" class="gallery-main" src="${escH(images[0])}" alt="${escH(L.title)}" />`
    : `<div class="gallery-main-placeholder"><svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg></div>`
  }
  <div class="status-badge">${escH(L.status || 'Active')}</div>
  ${hasImages ? `<div class="gallery-count">📷 ${images.length} photo${images.length !== 1 ? 's' : ''}</div>` : ''}
  ${hasImages && images.length > 1
    ? `<div class="gallery-strip">${images.map((src, i) =>
        `<img class="gallery-thumb${i===0?' active':''}" src="${escH(src)}" alt="Photo ${i+1}" onclick="showPhoto(${i}, this)" />`
      ).join('')}</div>`
    : ''
  }
</div>

<!-- CONTENT -->
<div class="content">

  <!-- MAIN COLUMN -->
  <div class="main">
    <div class="price">${price}</div>
    <div class="address">${escH(L.title)}
      <span class="type-badge">${escH(L.type || 'Residential')}</span>
    </div>
    <div class="location">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
      ${escH(location)}
    </div>

    ${statsArr.length ? `
    <div class="stats-row">
      ${statsArr.map(s => `<div class="stat"><div class="stat-val">${s.split(' ')[0]}</div><div class="stat-lbl">${s.split(' ').slice(1).join(' ')}</div></div>`).join('')}
    </div>` : ''}

    ${L.description ? `
    <div class="section-title">About This Property</div>
    <div class="description">${escH(L.description)}</div>` : ''}

    ${(L.features || []).length ? `
    <div class="section-title">Features &amp; Highlights</div>
    <div class="features-grid">
      ${L.features.map(f => `<span class="feat">${escH(f)}</span>`).join('')}
    </div>` : ''}

    <!-- Property Details Grid -->
    ${buildDetailsGrid(L)}

    <!-- Map placeholder / directions note -->
    <div style="background:white;border:1px solid var(--border);border-radius:10px;padding:20px;margin-bottom:28px;">
      <div class="section-title" style="margin-bottom:8px;">Location</div>
      <p style="color:var(--muted);font-size:14px;line-height:1.6;">${escH(L.title)}, ${escH(location)}</p>
      <a href="https://maps.google.com/?q=${encodeURIComponent(L.address + ' ' + (L.city||'') + ' WV ' + (L.zip||''))}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:4px;color:var(--forest);font-size:13px;font-weight:600;text-decoration:none;margin-top:10px;border:1.5px solid var(--forest);padding:7px 14px;border-radius:6px;transition:all .15s;" onmouseover="this.style.background='#1C3A1C';this.style.color='white';" onmouseout="this.style.background='';this.style.color='var(--forest)';">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
        Get Directions
      </a>
    </div>

  </div><!-- /main -->

  <!-- SIDEBAR -->
  <div class="sidebar">
    <div class="sidebar-card">
      <div class="sidebar-header">
        <div class="sidebar-price">${price}</div>
        <div class="sidebar-address">${escH(L.title)}</div>
        <div style="color:rgba(255,255,255,.6);font-size:11px;margin-top:2px;">${escH(location)}</div>
      </div>
      <div class="sidebar-body">

        <!-- Agent info -->
        <div class="sidebar-agent">
          <div class="agent-avatar">P</div>
          <div>
            <div class="agent-name">${escH(L.agentName || BRAND.agent)}</div>
            <div class="agent-title">WV Licensed Real Estate Agent</div>
          </div>
        </div>

        <!-- CTA buttons -->
        <div class="cta-row">
          <a href="tel:${(L.agentPhone||BRAND.phone).replace(/\D/g,'')}" class="cta-phone">📞 Call ${escH(L.agentPhone || BRAND.phone)}</a>
          <a href="sms:${(L.agentPhone||BRAND.phone).replace(/\D/g,'')}&body=Hi, I'm interested in ${encodeURIComponent(L.title || 'this property')}" class="cta-sms">💬 Send a Text</a>
        </div>

        <!-- Lead form -->
        <div class="form-title">Request More Info</div>
        <div id="lead-form" class="lead-form">
          <input class="inp" type="text" id="lead-name" placeholder="Your Name *" required />
          <input class="inp" type="tel" id="lead-phone" placeholder="Phone Number *" />
          <input class="inp" type="email" id="lead-email" placeholder="Email Address" />
          <textarea class="inp inp-ta" id="lead-message" placeholder="Message (optional) — questions, preferred tour time, etc."></textarea>
          <button class="submit-btn" onclick="submitLead(event)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/></svg>
            Request Information
          </button>
        </div>
        <div class="form-success" id="form-success">
          <div style="font-size:32px;margin-bottom:8px;">✅</div>
          <div style="font-weight:700;color:var(--forest);font-size:15px;">Request Sent!</div>
          <p style="color:var(--muted);font-size:13px;margin-top:4px;">Phil will contact you soon about <strong>${escH(L.title)}</strong>.</p>
        </div>

      </div>
    </div>
  </div><!-- /sidebar -->

</div><!-- /content -->

<!-- FOOTER -->
<footer class="footer">
  <div class="footer-logo">MalickLand</div>
  <p style="margin-bottom:6px;">WV Real Estate Agency · Phil Malick, WV Licensed Real Estate Agent</p>
  <p><a href="tel:${BRAND.phone.replace(/\D/g,'')}">${BRAND.phone}</a> · <a href="mailto:${BRAND.email}">${BRAND.email}</a></p>
  <p style="margin-top:12px;font-size:11px;color:#4b5563;">
    <a href="${BRAND.site}">Home</a> · <a href="${BRAND.site}/listings">All Listings</a> · <a href="${BRAND.site}/contact">Contact</a>
  </p>
  <p style="margin-top:12px;font-size:10px;color:#374151;">Information deemed reliable but not guaranteed. Equal Housing Opportunity.</p>
</footer>

<script>
// Gallery
function showPhoto(i, thumb) {
  const img = document.getElementById('gallery-main');
  if (img) {
    const thumbs = document.querySelectorAll('.gallery-thumb');
    thumbs.forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
    img.src = thumb.src;
  }
}

// Lead form submission
async function submitLead(e) {
  e.preventDefault();
  const btn = e.currentTarget;
  const name = document.getElementById('lead-name').value.trim();
  const phone = document.getElementById('lead-phone').value.trim();
  const email = document.getElementById('lead-email').value.trim();
  const message = document.getElementById('lead-message').value.trim();

  if (!name) { alert('Please enter your name.'); return; }
  if (!phone && !email) { alert('Please enter a phone number or email.'); return; }

  btn.disabled = true;
  btn.textContent = 'Sending…';

  try {
    const res = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name, phone, email, message,
        listingSlug: '${escH(L.slug || '')}',
        listingTitle: '${escH(L.title || '')}',
        listingPrice: ${L.price || 'null'},
      }),
    });
    const data = await res.json();
    if (data.success) {
      document.getElementById('lead-form').classList.add('hidden');
      document.getElementById('form-success').classList.add('show');
    } else {
      alert('Something went wrong. Please call us at ${escH(L.agentPhone || BRAND.phone)}.');
      btn.disabled = false;
      btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/></svg> Request Information';
    }
  } catch(err) {
    alert('Unable to submit. Please call ${escH(L.agentPhone || BRAND.phone)} directly.');
    btn.disabled = false;
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/></svg> Request Information';
  }
}
</script>
</body>
</html>`;
}

function buildDetailsGrid(L) {
  const items = [
    L.garage && { lbl: 'Garage', val: L.garage },
    L.water && { lbl: 'Water', val: L.water },
    L.sewer && { lbl: 'Sewer', val: L.sewer },
    L.yearBuilt && { lbl: 'Year Built', val: L.yearBuilt },
    L.county && { lbl: 'County', val: L.county },
    L.zip && { lbl: 'ZIP Code', val: L.zip },
    L.type && { lbl: 'Property Type', val: L.type },
    { lbl: 'State', val: 'West Virginia' },
  ].filter(Boolean);

  if (!items.length) return '';
  return `
    <div class="section-title">Property Details</div>
    <div class="details-grid">
      ${items.map(i => `<div class="detail-item"><div class="detail-lbl">${escH(i.lbl)}</div><div class="detail-val">${escH(String(i.val))}</div></div>`).join('')}
    </div>`;
}



function buildListingCard(l) {
  const price = l.price ? '$' + Number(l.price).toLocaleString() : 'TBD';
  const statusColor = l.status === 'Active' ? '#16a34a' : l.status === 'Pending' ? '#d97706' : '#6b7280';
  const stats = [
    l.beds != null ? `${l.beds} BD` : null,
    l.baths != null ? `${l.baths} BA` : null,
    l.sqft ? `${Number(l.sqft).toLocaleString()} SF` : null,
    l.acres ? `${l.acres} AC` : null,
  ].filter(Boolean).join(' · ');

  return `
    <a href="/listing/${escH(l.slug)}" class="card">
      <div class="card-img">
        ${l.cover ? `<img src="${escH(l.cover)}" alt="${escH(l.title)}" loading="lazy" />` : ''}
        <span class="status-pill" style="background:${statusColor}">${escH(l.status||'Active')}</span>
        <span class="type-pill">${escH(l.type||'Property')}</span>
      </div>
      <div class="card-body">
        <div class="card-price">${price}</div>
        <div class="card-title">${escH(l.title)}</div>
        <div class="card-loc">📍 ${escH([l.city, l.county].filter(Boolean).join(' · '))} WV</div>
        ${stats ? `<div class="card-stats">${stats}</div>` : ''}
      </div>
    </a>`;
}

// ─── 404 ─────────────────────────────────────────────────────────────────────
function render404(request) {
  return new Response(`<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>404 — MalickLand</title>
<style>body{font-family:system-ui,sans-serif;background:#f9fafb;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center;} .box{max-width:400px;} h1{font-size:64px;font-weight:900;color:#1C3A1C;} p{color:#6b7280;margin:8px 0 20px;} a{background:#C4A040;color:white;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:700;}</style>
</head><body><div class="box"><h1>404</h1><p>This page doesn't exist.</p><a href="${BRAND.site}">Back to MalickLand</a></div></body></html>`,
  { status: 404, headers: { 'Content-Type': 'text/html;charset=UTF-8', ...getCorsHeaders(request) } });
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function json(data, status = 200, corsHeaders = getCorsHeaders()) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

function escH(str) {
  if (typeof str !== 'string') str = String(str || '');
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
