# Malickland 2.0 Security

Last updated: 2026-06-19

## Security Principles

- Security and privacy are release blockers.
- Validate all untrusted input at API, Worker, webhook, and form boundaries.
- Enforce authorization server-side.
- Never commit secrets, tokens, app passwords, private keys, production IDs, or real customer data.
- Do not expose internal errors to users.
- Report only verified security checks.

## Secrets And Configuration

- `.env`, `.env*.local`, `.vercel`, and `*.pem` are ignored.
- Required runtime secrets/config currently identified:
  - `GMAIL_USER`
  - `GMAIL_APP_PASSWORD`
  - `LISTINGS_API_URL` where deployed listings API differs from `https://malickland.net/api/listings`
  - Cloudflare Worker secret `API_TOKEN`
  - Optional Cloudflare Worker secret `LEADS_WEBHOOK`
  - Cloudflare account ID and KV namespace IDs in deployment config
  - Google Apps Script Sheet and Drive folder IDs
- `.env.example` exists with names/placeholders only; never replace placeholders with real values in committed files.

## Current Immediate Risks

- Production dependency advisories were found on 2026-05-27 in `next@16.1.6`, transitive `postcss`, and `nodemailer@8.0.3`; a new `nodemailer <=9.0.0` advisory was found on 2026-06-19. Manifests now target `next@^16.2.6`, `nodemailer@^9.0.1`, `@types/nodemailer@^8.0.1`, `eslint-config-next@^16.2.6`, plus a `postcss@^8.5.10` override, and both `npm audit --omit=dev --json` and full `npm audit --json` reported 0 vulnerabilities on 2026-06-19.
- `/api/contact` now validates JSON shape, text types, required fields, field lengths, email shape, trims/sanitizes input, checks Gmail configuration before sending, avoids logging submitted form data, enforces request rate limits before mail send, and has repeatable validation plus route-level abuse tests.
- `/api/contact` production abuse protection depends on `CONTACT_RATE_LIMIT_REDIS_REST_URL` and `CONTACT_RATE_LIMIT_REDIS_REST_TOKEN` for durable cross-instance limits. Without those values, the route falls back to an in-memory limiter that is suitable only for local development or a single long-running Node process. Partial Redis configuration and Redis timeouts fail closed. `CONTACT_RATE_LIMIT_TRUST_PROXY_HEADERS=true` should only be set when the hosting/proxy layer strips or overwrites inbound IP headers.
- Cloudflare Worker CORS is currently `*`; this may be too permissive for write-adjacent APIs.
- Worker listing HTML needs focused review for image URL and script-context injection safety.
- Listing manager stores the Worker API token in `localStorage`; this must remain a trusted local/admin-only tool, not a public admin surface.
- Apps Script deployment guidance uses "Anyone" access and needs compensating validation/authentication when exposed to the internet.
- Lead capture stores IP address in KV; retention, necessity, and privacy notice should be reviewed.

## Required Security Checks Before Production Readiness

- `npm audit --omit=dev`
- `npm audit`
- Contact API validation and failure-path tests.
- Contact API production abuse protection, including Redis REST limiter configuration before production deployment.
- Worker payload size, field validation, CORS/origin, and XSS tests.
- Secret scan before commit/deploy.
- Verify deployment route ownership and avoid accidental public admin/tool exposure.
- Verify no real credentials appear in docs, screenshots, logs, or committed files.

## Safety Stop Conditions

Agents must stop and document blockers in `WORK_LOG.md` and `TASKS.md` when security implications are unclear, credentials are missing, production data could be affected, destructive changes are required, or infrastructure changes cannot be verified safely.

## Lead Backup Store (Supabase) — 2026-06-28

- Every validated contact submission may be persisted to Supabase table `contact_leads`
  (PII: name, email, phone, message, attribution) when `LEAD_BACKUP_SUPABASE_URL` +
  `LEAD_BACKUP_SUPABASE_KEY` are configured. Purpose: lead-safety gate ("no lead silently drops").
- The shipped key is the Supabase **publishable/anon** key (non-secret by design). RLS grants
  INSERT only; no select/update/delete policies exist, so that key cannot read or tamper with
  stored leads. Reading requires the Supabase dashboard/service role.
- Known bounded risk: anyone with the publishable key can insert rows directly (spam), but cannot
  read PII. Rows are size-capped via CHECK constraints. If table spam appears, rotate the
  publishable key or switch to a service-role-only insert path (documented in DECISIONS.md).
- Double-failure path (mail failed AND backup unavailable): the sanitized lead is written to
  server logs (Vercel) as last-resort recovery. This intentionally places PII in logs only when
  the alternative is silent loss; log access is limited to the Vercel team.
- Never commit any Supabase key; env names are documented in `.env.example`.
