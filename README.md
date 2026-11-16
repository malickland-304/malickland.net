# MalickLand Real Estate — Public Marketing Website

**malickland.net** — The public-facing marketing website for MalickLand Real Estate Agency, serving the Eastern Panhandle of West Virginia.

## Business Outcome

This platform serves as the central hub for:
- Generating and capturing client leads (buyers and sellers).
- Showcasing active property listings.
- Improving local SEO and market positioning in West Virginia.
- Offering specialized real estate tech services like MEDjAi property intelligence reports.

## Stack

- **Next.js 16** (App Router)
- **React 19** + **TypeScript 5**
- **Tailwind CSS v4** (CSS-first config, no `tailwind.config.js`)
- **Vercel Analytics** via `@vercel/analytics`
- Hosted via Squarespace DNS → Cloudflare → Vercel (or custom host)
- Package manager: npm. Use `package-lock.json`; do not add pnpm/yarn lockfiles unless a documented package-manager decision changes this.

## Brand Colors

| Name | Hex |
|------|-----|
| Forest Green | `#1C3A1C` |
| Forest Dark | `#142814` |
| Forest Darkest | `#0F2A0F` |
| Forest Border | `#254E25` |
| Gold | `#C4A040` |
| Light Gold | `#D4B050` |

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage — Hero, Services, About snippet, Testimonials |
| `/services` | Service offers — Deal Facilitation plus MEDjAi report/checkup offers |
| `/services/deal-facilitation` | MalickLand deal facilitation offer |
| `/services/property-intelligence-report` | MEDjAi property intelligence report offer |
| `/services/seller-readiness-checkup` | MEDjAi seller readiness checkup offer |
| `/listings` | Property listings with search/filter |
| `/about` | Phil Malick bio, expertise, WV counties served |
| `/contact` | Contact form, office hours, areas served |

## Getting Started

```bash
npm ci
npm run dev
```

App runs at `http://localhost:3000`

Useful checks:

```bash
npm run lint
npm run test:contact
npm run test:worker
npm run build
npm run test:public-pages
npm audit
```

`npm run test:public-pages` expects a completed production build. Run it after
`npm run build`; it starts `next start` on a temporary localhost port and checks
the launch-critical public routes plus `/api/contact` GET method handling.

## Environment Variables

Copy `.env.example` to `.env.local` for local development and fill in only the values needed for the feature you are testing.

| Variable | Required | Purpose |
|----------|----------|---------|
| `RESEND_API_KEY` | Contact form | Resend API key used by `/api/contact` to send lead notification emails. |
| `CONTACT_EMAIL_FROM` | Optional | Sender address on a Resend-verified domain (defaults to `MalickLand Contact Form <contact@malickland.net>`). |
| `CONTACT_EMAIL_TO` | Optional | Recipient inbox for contact inquiries (defaults to `phil@malickland.net`). |
| `CONTACT_EMAIL_TIMEOUT_MS` | Optional | Email send timeout in milliseconds (defaults to `5000`). |
| `LEAD_BACKUP_SUPABASE_URL` | Optional | Supabase project URL for durable backup lead storage. |
| `LEAD_BACKUP_SUPABASE_KEY` | Optional | Supabase publishable/anon key for insert-only backup storage under RLS. |
| `LEAD_BACKUP_TIMEOUT_MS` | Optional | Lead backup insert timeout in milliseconds (defaults to `3000`). |
| `CONTACT_RATE_LIMIT_MAX_REQUESTS` | Optional | Maximum `/api/contact` requests allowed per client window. Defaults to `5`. |
| `CONTACT_RATE_LIMIT_WINDOW_SECONDS` | Optional | `/api/contact` rate-limit window in seconds. Defaults to `600`. |
| `CONTACT_RATE_LIMIT_TRUST_PROXY_HEADERS` | Production contact form | Set to `true` only when the hosting/proxy layer strips or overwrites inbound IP headers. When unset, requests share an anonymous limiter key instead of trusting client-supplied headers. |
| `CONTACT_RATE_LIMIT_REDIS_REST_URL` | Production contact form | Redis REST endpoint for durable cross-instance `/api/contact` rate limiting. |
| `CONTACT_RATE_LIMIT_REDIS_REST_TOKEN` | Production contact form | Bearer token for the Redis REST endpoint. Keep secret. |
| `CONTACT_RATE_LIMIT_REDIS_TIMEOUT_MS` | Optional | Redis REST limiter timeout in milliseconds. Defaults to `1500`. |

Never commit real secrets or production credentials.

`/api/contact` uses an in-memory rate limiter when Redis REST configuration is
absent. That fallback is useful for local development or a single long-running
Node process, but production deployments should configure the Redis REST values
so limits are shared across serverless instances and restarts. If only one Redis
REST value is configured, or if Redis does not answer before the configured
timeout, the contact route fails closed with a temporary unavailable response
instead of silently running without the durable limiter.

The launch `/listings` page is a property-search request page and does not
consume a listings API. Public listing inventory is deferred until the production
data source, route ownership, and review process are verified.

## Related Repo

- **wv-realestate** — Internal CRM & property management app (port 3001)

## Agency Info

- **Agent**: Phil Malick
- **Agency**: MalickLand Real Estate
- **Phone**: (540) 246-1421
- **Email**: phil@malickland.net
- **Address**: 501 E Main St, Romney, WV 26757
- **License**: WV Licensed Real Estate Agent
