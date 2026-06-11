# MalickLand Listing System — Setup Guide

Production-ready real estate listing system for malickland.net. Enter a listing once → it publishes to the website, saves to Google Sheets, and captures leads automatically.

---

## File Structure

```
listing-system/
├── frontend/
│   └── listing-manager.html      ← Open this in your browser to manage listings
├── workers/
│   ├── worker.js                 ← Cloudflare Worker (the website engine)
│   └── wrangler.toml             ← Cloudflare deployment config
├── backend/
│   └── google-apps-script.gs    ← Google Sheets + Drive integration
└── README.md                     ← This file
```

---

## How It Works

```
[listing-manager.html]
       ↓ POST /api/save (Bearer token)
[Cloudflare Worker] → stores in KV → serves malickland.net/listing/{slug}
       ↓ POST (parallel)
[Google Apps Script] → saves to Google Sheets + uploads images to Drive
                      → sends email notification for leads
```

---

## STEP 1 — Cloudflare Worker Setup

### 1a. Install Wrangler (Cloudflare CLI)
```bash
npm install -g wrangler
wrangler login
```

### 1b. Create KV Namespace
```bash
# Create the KV namespace
npx wrangler kv:namespace create "LISTINGS"

# Copy the returned id into wrangler.toml → [[kv_namespaces]] → id = "..."
```

### 1c. Update wrangler.toml
Edit `workers/wrangler.toml`:
- Replace `YOUR_CLOUDFLARE_ACCOUNT_ID` with your account ID (Cloudflare dashboard → right sidebar)
- Replace `YOUR_KV_NAMESPACE_ID` with the KV namespace ID from step 1b

### 1d. Set Your API Token (Secret)
This token protects your `/api/save` endpoint. Pick any strong random string.
```bash
npx wrangler secret put API_TOKEN
# Enter your chosen token when prompted (e.g.: ml-secret-abc123xyz)
```

### 1e. (Optional) Set Lead Webhook
If you want leads forwarded to Google Sheets automatically:
```bash
npx wrangler secret put LEADS_WEBHOOK
# Enter your Google Apps Script URL (set up in Step 2)
```

### 1f. Deploy the Worker
```bash
cd listing-system/workers
npx wrangler deploy
```

### 1g. Verify Routes in Cloudflare Dashboard
1. Go to Cloudflare Dashboard → Workers & Pages → malickland-listings
2. Under Settings → Triggers → Routes, verify these routes are active:
   - `malickland.net/listing/*`
   - `malickland.net/listings`
   - `malickland.net/api/*`

**Test it:**
- Visit `https://malickland.net/listings` → Should show a listings index page
- Visit `https://malickland.net/api/health` → Should return `{"ok":true}`

---

## STEP 2 — Google Apps Script Setup

### 2a. Create a Google Sheet
1. Go to [sheets.google.com](https://sheets.google.com) → New spreadsheet
2. Name it: `MalickLand Listings`
3. Copy the Sheet ID from the URL: `docs.google.com/spreadsheets/d/{THIS_IS_THE_ID}/edit`

### 2b. Create a Google Drive Folder
1. Go to [drive.google.com](https://drive.google.com) → New → Folder
2. Name it: `MalickLand Listing Photos`
3. Open the folder → copy the Folder ID from the URL: `drive.google.com/drive/folders/{THIS_IS_THE_ID}`

### 2c. Create the Apps Script
1. Go to [script.google.com](https://script.google.com) → New Project
2. Name it: `MalickLand Listing Backend`
3. Delete the default `function myFunction()` code
4. Copy/paste the entire contents of `backend/google-apps-script.gs`
5. Update the CONFIG at the top:
   ```javascript
   const CONFIG = {
     SHEET_ID:        'your-sheet-id-here',
     DRIVE_FOLDER_ID: 'your-folder-id-here',
     NOTIFY_EMAIL:    'phil@malickland.net',
     SITE_URL:        'https://malickland.net',
   };
   ```
6. Click **Save** (disk icon)

### 2d. Deploy as Web App
1. Click **Deploy** → **New deployment**
2. Click the gear icon next to "Select type" → choose **Web app**
3. Settings:
   - Description: `MalickLand Listing API v1`
   - Execute as: **Me** (your Google account)
   - Who has access: **Anyone**
4. Click **Deploy**
5. **Copy the Web App URL** — you'll need this in Step 3

### 2e. Test It
In Apps Script, run `testSaveListing()` — check the Google Sheet for a test row and Drive for a `listing-test-123-main-street` folder.

---

## STEP 3 — Configure the Listing Manager

1. Open `frontend/listing-manager.html` in your browser (double-click the file)
2. Click the **⚙ Config** button in the header
3. Fill in:
   - **Cloudflare Worker URL**: `https://malickland.net`
   - **Worker API Token**: the token you set in Step 1d
   - **Google Apps Script URL**: the URL from Step 2d
   - **Agent Phone**: `(540) 246-1421` (already pre-filled)
4. The config saves automatically in your browser

---

## STEP 4 — Publish Your First Listing

1. Open `frontend/listing-manager.html`
2. Fill in all listing details (required: Title, Price)
3. Upload photos (drag & drop — they're auto-compressed)
4. Click preset feature tags or type custom ones
5. Check the **live preview** tabs (Card / Yard Sign / Flyer / Social)
6. Click **Save & Publish**
7. Watch the Activity Log — should see:
   ```
   ✓ Published: https://malickland.net/listing/your-slug-here
   ✓ Saved to Google Sheets
   ✓ QR code generated
   ```
8. Visit the URL to confirm the listing is live

---

## STEP 5 — Connect Next.js Site (optional but recommended)

The Next.js listings page at `/listings` already fetches from the Cloudflare API automatically. To configure the API URL:

### Add Environment Variable
Create or edit `/malickland.net/.env.local`:
```
LISTINGS_API_URL=https://malickland.net/api/listings
```

Or in Vercel/deployment settings, add:
- Variable: `LISTINGS_API_URL`
- Value: `https://malickland.net/api/listings`

The page uses ISR with a 60-second revalidation, so new listings appear on the site within ~1 minute of publishing.

---

## API Reference

### POST `/api/save` — Save a Listing
Requires `Authorization: Bearer YOUR_TOKEN` header.
```json
{
  "slug": "123-main-street-romney",
  "title": "123 Main Street",
  "price": 185000,
  "type": "Residential",
  "status": "Active",
  "city": "Romney",
  "county": "Hampshire County",
  "beds": 3, "baths": 2, "sqft": 1800, "acres": null,
  "description": "...",
  "features": ["Hardwood Floors", "Mountain Views"],
  "images": ["data:image/jpeg;base64,..."]
}
```
Response: `{ "success": true, "slug": "...", "url": "https://..." }`

### POST `/api/lead` — Submit a Lead
No auth required.
```json
{
  "name": "John Smith",
  "phone": "(304) 555-1234",
  "email": "john@example.com",
  "message": "Interested in this property",
  "listingSlug": "123-main-street-romney",
  "listingTitle": "123 Main Street",
  "listingPrice": 185000
}
```
Response: `{ "success": true, "id": "..." }`

### GET `/api/listings` — List All Listings (JSON)
Optional query params: `?status=Active`, `?type=Land`, `?county=Hampshire`

### GET `/api/listing/:slug` — Single Listing (JSON)

### GET `/listing/:slug` — Listing Page (HTML)

### GET `/listings` — Listings Index (HTML)

---

## Security Notes

- The API token is stored as a Cloudflare Worker secret (never in code or wrangler.toml)
- The listing manager stores config in `localStorage` (your browser only)
- The `/api/save` endpoint rejects any request without a valid Bearer token
- Leads are rate-limited by Cloudflare's built-in DDoS protection
- Images are compressed client-side before transmission (~100KB each)

---

## Updating a Listing

Simply open the listing manager, fill in the same slug (or re-enter the data), and click Save & Publish again. The worker updates the KV entry and the index in place.

---

## Viewing Leads

All leads are stored in two places:
1. **Cloudflare KV** — under keys like `lead:1234567890-abc`
2. **Google Sheets** — in the "Leads" tab (auto-created)
3. **Email** — instant notification to phil@malickland.net

---

## Troubleshooting

**"Unauthorized" on save:**
Check that the API Token in Config matches the `wrangler secret put API_TOKEN` value exactly.

**Google Sheets not updating:**
Make sure the Apps Script is deployed as "Anyone" can access. Re-deploy if needed.

**Images not showing:**
Images are stored as base64 in Cloudflare KV. If they're large, try re-compressing (use quality slider in photo upload). Max recommended: 1200px wide, ~80KB per image.

**Listings not showing on malickland.net/listings:**
Check the route config in wrangler.toml. Verify the KV namespace binding name is `LISTINGS`.

**Worker 404 errors:**
Re-deploy with `npx wrangler deploy`. Check Cloudflare dashboard that routes are applied.
