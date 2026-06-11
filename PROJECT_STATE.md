# Malickland 2.0 Project State

Last updated: 2026-06-07

## Implemented

- Public Next.js marketing website with homepage, listings, about, contact, shared navigation, and footer.
- Contact form UI posts to `/api/contact`.
- `/api/contact` validates JSON payloads, trims and length-limits fields, validates email shape, preserves service-interest and timeline fields, checks Gmail env configuration, and sends email through Gmail via Nodemailer environment variables.
- Public service-offer pages exist at `/services`, `/services/deal-facilitation`, `/services/property-intelligence-report`, and `/services/seller-readiness-checkup`; offer CTAs route to `/contact?service=...` for service-tagged lead intake.
- Listings page fetches listing JSON from `LISTINGS_API_URL` or `https://malickland.net/api/listings` and falls back to sample listings.
- Listing subsystem exists locally under `listing-system/` with Cloudflare Worker, browser listing manager, and Google Apps Script backend.
- `.gitignore` excludes local env files including `.env`, `.env*.local`, and generated Next.js output.

## Incomplete Or Unverified

- `AGENTS.md`, `ARCHITECTURE.md`, `PROJECT_STATE.md`, `TASKS.md`, `DECISIONS.md`, `SECURITY.md`, `QA_CHECKLIST.md`, and `WORK_LOG.md` were missing before this session.
- Contact validation tests exist at `src/app/api/contact/validation.test.ts` and run through `npm run test:contact`.
- `.env.example` now documents `GMAIL_USER`, `GMAIL_APP_PASSWORD`, and `LISTINGS_API_URL` with names/placeholders only.
- `listing-system/` is untracked, so its ownership and intended commit scope need confirmation through repository governance.
- Production deployment path, Cloudflare routes, Vercel settings, KV namespace, Gmail app password, and Apps Script deployment are not verified.
- README now documents contact and listings environment variables.

## Broken Or Risky

- `npm audit --omit=dev` on 2026-05-27 initially found production advisories in `next@16.1.6`, transitive `postcss`, and `nodemailer@8.0.3`.
- Dependency manifests now target `next@^16.2.6`, `eslint-config-next@^16.2.6`, `nodemailer@^8.0.9`, and override `postcss@^8.5.10`; `npm audit --omit=dev --json` reported 0 vulnerabilities after the change.
- The main mirrored checkout build/dev hang was resolved on 2026-06-07. Cause: backup dependency trees named like `node_modules.codex-backup-*` were inside the repo and were scanned by Tailwind/PostCSS and TypeScript. `.gitignore` and `tsconfig.json` now exclude `*.codex-backup-*`, and the real checkout passes production build and starts `next dev`.
- Scoped lint now passes in the main checkout with `npm run lint -- --no-warn-ignored --no-error-on-unmatched-pattern src next.config.ts eslint.config.mjs`.
- Bare `npm run lint` still did not complete within about 30 seconds on 2026-06-07 and was stopped; lint configuration or scan scope still needs tightening before using bare `eslint` as a gate.
- `/api/contact` still lacks durable production abuse/rate-limit controls.
- Service pages and tagged intake are implemented locally, but production deployment path and analytics/lead tracking are not verified.
- The Worker has permissive CORS (`Access-Control-Allow-Origin: *`) for API routes.
- Worker-generated HTML escapes many text fields but still embeds image URLs and some values in HTML/script contexts that need a focused XSS review.
- Listing manager stores the Worker API token in browser `localStorage`; this is acceptable only for trusted local/admin use and should not be served as a public admin tool.
- Worker route config includes `malickland.net/listings`, which may conflict with the Next.js `/listings` route.

## Performance Concerns

- Next.js `/listings` performs server-side fetch with 60-second revalidation. This is reasonable, but no production latency or cache evidence has been captured.
- Worker listing index uses a single KV `__index` document. This is simple and fast for small inventory, but it can become a scaling bottleneck if listings grow substantially.
- Listing manager compresses images client-side, but accepted image count/size and Worker/KV payload limits need documented enforcement.
- No bundle, Lighthouse, or runtime performance measurements have been captured.

## Recommended Next Work

1. Review and separate the governance, dependency, and listings implementation scopes before commit/PR planning.
2. Add durable abuse/rate-limit protection for `/api/contact`.
3. Resolve whether `listing-system/` should be tracked and whether Worker `/listings` or Next.js `/listings` owns the public listings route.
4. Add deployment-specific secret handling notes once the hosting target is confirmed.
5. Add lightweight tests for contact validation and listing fetch fallback behavior.
6. Add Worker input validation, origin policy, and XSS hardening tests before deployment.
