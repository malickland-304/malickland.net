# Malickland 2.0 Project State

Last updated: 2026-06-28

## Implemented

- Durable lead backup (2026-06-28): `/api/contact` persists every validated submission to Supabase
  `contact_leads` with delivery status when `LEAD_BACKUP_*` env vars are set (insert-only RLS,
  publishable key, no new dependencies). No-op when unset. `GO_LIVE_RUNBOOK.md` sequences the
  remaining owner-only launch steps. Live-database migration apply is pending owner action.

- Public Next.js marketing website with homepage, listings, about, contact, shared navigation, and footer.
- Contact form UI posts to `/api/contact`.
- `/api/contact` rate-limits requests before parsing/sending mail, validates JSON payloads, trims and length-limits fields, validates email shape, preserves service-interest and timeline fields, checks Gmail env configuration, and sends email through Gmail via Nodemailer environment variables.
- Public service-offer pages exist at `/services`, `/services/deal-facilitation`, `/services/property-intelligence-report`, and `/services/seller-readiness-checkup`; offer CTAs route to `/contact?service=...` for service-tagged lead intake.
- Vercel Analytics is installed globally through the App Router root layout.
- Listings page is a launch-safe property-search request page; it does not fetch or render listing inventory until a production listings data source is verified.
- Listing subsystem is tracked under `listing-system/` with Cloudflare Worker, browser listing manager, and Google Apps Script backend, but it is deferred for launch.
- Root `AttributionTracker` persists first landing attribution in `sessionStorage` when available, and the contact form reads that stored attribution so UTMs/referrer survive internal navigation to `/contact`.
- `.gitignore` excludes local env files including `.env`, `.env*.local`, and generated Next.js output.
- npm is the declared package manager; `package-lock.json` is the lockfile of record.

## Incomplete Or Unverified

- `AGENTS.md`, `ARCHITECTURE.md`, `PROJECT_STATE.md`, `TASKS.md`, `DECISIONS.md`, `SECURITY.md`, `QA_CHECKLIST.md`, and `WORK_LOG.md` were missing before this session.
- Contact validation and route-level abuse tests exist at `src/app/api/contact/validation.test.ts` and `src/app/api/contact/route.test.ts`; both run through `npm run test:contact`.
- `.env.example` now documents `GMAIL_USER`, `GMAIL_APP_PASSWORD`, contact rate-limit settings, Redis REST limiter settings, and `LISTINGS_API_URL` with names/placeholders only.
- Production deployment path, Cloudflare routes, Vercel settings, KV namespace, Gmail app password, and Apps Script deployment are not verified.
- README now documents contact and listings environment variables.

## Broken Or Risky

- `npm audit --omit=dev` on 2026-05-27 initially found production advisories in `next@16.1.6`, transitive `postcss`, and `nodemailer@8.0.3`.
- Dependency manifests now target `next@^16.2.6`, `eslint-config-next@^16.2.6`, `nodemailer@^9.0.1`, `@types/nodemailer@^8.0.1`, and override `postcss@^8.5.10`; `npm audit --omit=dev --json` and full `npm audit --json` reported 0 vulnerabilities on 2026-06-19.
- The main mirrored checkout build/dev hang was resolved on 2026-06-07. Cause: backup dependency trees named like `node_modules.codex-backup-*` were inside the repo and were scanned by Tailwind/PostCSS and TypeScript. `.gitignore` and `tsconfig.json` now exclude `*.codex-backup-*`, and the real checkout passes production build and starts `next dev`.
- The default `npm run lint` script is scoped to `src next.config.ts eslint.config.mjs` and passes in the main checkout.
- `/api/contact` has a Redis REST rate-limit implementation for durable production use and an in-memory fallback for local/single-process development. Production still needs the Redis REST env values configured before deployment.
- Service pages and tagged intake are implemented locally, but production deployment path and analytics/lead tracking are not verified.
- The deferred Worker API now uses an origin allowlist for CORS on touched JSON routes plus named payload size limits for listing saves and listing leads. Worker-specific regression tests are still missing.
- Worker-generated HTML escapes many text fields and image URL attribute contexts touched in this pass, but some values in HTML/script contexts still need a focused XSS review.
- Listing manager stores the Worker API token in browser `localStorage`; this is acceptable only for trusted local/admin use and should not be served as a public admin tool.
- Worker route config may still include `malickland.net/listings`; production Worker routing remains deferred until the listings data source, account/KV ownership, security, and review process are verified.

## Performance Concerns

- Next.js `/listings` performs server-side fetch with 60-second revalidation. This is reasonable, but no production latency or cache evidence has been captured.
- Worker listing index uses a single KV `__index` document. This is simple and fast for small inventory, but it can become a scaling bottleneck if listings grow substantially.
- Listing manager compresses images client-side, but accepted image count/size and Worker/KV payload limits need documented enforcement.
- No bundle, Lighthouse, or runtime performance measurements have been captured.

## Recommended Next Work

1. Configure Redis REST rate-limit env values before relying on cross-instance `/api/contact` abuse protection in production.
2. Add deployment-specific secret handling notes once the hosting target is confirmed.
3. Add Worker input validation, lead abuse, and XSS hardening tests before enabling the listing subsystem.
4. Capture browser/accessibility/performance baselines for the homepage, listings, and contact form.
