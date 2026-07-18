# Malickland 2.0 — Pre-Publication Security Audit (Phase 0)

Date: 2026-07-18
Auditor: Claude (read-only credential + publication-readiness pass)
Branch: `claude/medjai-security-publication-w4vbou`
Scope: this repository, with a cross-repo secret sweep of `openclaw-system` and `openclaw`.

This is a **read-only** audit. No application behavior, dependencies, or security
documents were changed by this pass. Findings below are recommendations for the
owner and for later remediation phases. Per `AGENTS.md`, verified checks and
unverified/assumed items are labelled separately.

---

## Gate status

**Phase 0 is NOT cleared by this audit.** The repository secret scan is clean, but
the plan's hard gate — revoking the leaked Hostinger token and scrubbing it from
shell history — happens **outside git**, on the owner's machine and in the
Hostinger hPanel. This audit can only certify that the token (and any other live
secret) **is not present in these repositories**. Clearing the gate still requires
the manual owner action described under "Outstanding manual gate."

---

## 1. Credential scan — VERIFIED CLEAN

Method (all run against tracked content, not the working tree only):

- Enumerated tracked files for `.env`/secret/key/cert names across all three repos.
- Searched full git history (`--all`, `--diff-filter=A`) for any non-example `.env`
  ever added and later removed.
- Content scan for high-signal secret value patterns: `re_…` (Resend), `sk-…` /
  `sk_live_` / `pk_live_`, AWS `AKIA…`/`ASIA…`, `ghp_`/`gho_`/`glpat-`, Slack
  `xox[baprs]-`, Google `AIza…`, JWT `eyJ….eyJ…`, PEM `PRIVATE KEY` blocks, and
  DB URIs carrying inline credentials (`postgres://user:pass@`, `mysql://…`,
  `mongodb+srv://…`), plus `service_role` JWTs.

Confirmed for `malickland.net`:

- No committed `.env` — only `.env.example` (names/placeholders only).
- No `.env` (non-example) ever appears in git history (34 commits, full clone, not shallow).
- No `.pem`/`.key`/`.p12`/`.pfx`/keystore/cert files tracked.
- No secret-value pattern matches in `src/`, `listing-system/`, `supabase/`, config, or `public/`.
- `push-to-github.sh` contains **no** hardcoded token (plain `git push origin main`).
- `.gitignore` ignores `.env`, `.env*.local`, and (per `SECURITY.md`) `.vercel`/`*.pem`.
- All secrets are read server-side via `process.env.*` inside `/api/contact`
  (`src/app/api/contact/handler.ts`, `leadStore.ts`) — no secret reaches client bundles.
- The committed Supabase key is the **publishable/anon** key by design
  (`.env.example`, `SECURITY.md` §"Lead Backup Store"), INSERT-only via RLS — not the service key.

Cross-repo sweep:

- `openclaw-system`: no secret-value matches; only `.env.example` templates tracked.
- `openclaw`: the only matches are **test fixtures** with obviously fake tokens
  (`xoxb-test-token`, `sk-ant-oat01-test-token`, `ghp_abcdef…` marked
  `pragma: allowlist secret`, `-----BEGIN RSA PRIVATE KEY-----\nfake-key`). These
  are the upstream OSS project's own tests, not live credentials.

---

## 2. Outstanding manual gate — UNVERIFIED (owner action required)

The leaked **Hostinger token** is not in git, so this audit cannot see it, revoke
it, or confirm its state. The following must be done by the owner and cannot be
performed from this environment:

1. Revoke the token in Hostinger hPanel (API / access token settings).
2. Scrub it from local shell history (`~/.bash_history` / `~/.zsh_history`).
3. Issue a replacement only if still needed, stored outside any repo.

Until (1) is done, Phase 0 remains open regardless of the clean repo scan above.

---

## 3. Verified findings — publication readiness

### F1 — Go-live docs still describe the removed Gmail/SMTP path (HIGH)

Commit `ef920d4` ("feat(contact): send lead email via Resend instead of Gmail
SMTP", PR #24) migrated the contact form to Resend in code, but the go-live
documentation was not updated. The app now reads `RESEND_API_KEY` and posts to
`https://api.resend.com/emails` (`src/app/api/contact/handler.ts:77,289`); the only
remaining Gmail reference in code is a comment noting the replacement
(`handler.ts:69`). The docs, however, still instruct provisioning Gmail secrets:

- `GO_LIVE_RUNBOOK.md:38-39` — tells the launcher to set `GMAIL_USER` / `GMAIL_APP_PASSWORD`.
- `LAUNCH_CHECKLIST.md:29` — a checked `[x]` box asserting Gmail env vars are present.
- `LAUNCH_CHECKLIST.md:90,93` — Gmail provisioning steps.
- `README.md:75-76` — env table documents `GMAIL_USER`/`GMAIL_APP_PASSWORD`; omits `RESEND_API_KEY`.
- `ARCHITECTURE.md:21` — describes `/api/contact` as "through Gmail via Nodemailer".
- `SECURITY.md` §"Secrets And Configuration"/§"Current Immediate Risks" — lists Gmail
  secrets and nodemailer advisories.

Impact: anyone following the runbook at launch would configure a secret the app
ignores and would **never be told to set `RESEND_API_KEY`** — so the contact form
(the site's primary lead-capture function) would silently fail to send. This is the
highest-priority defect for go-live.

Recommendation (later phase): update the six documents above to the Resend model,
including the `RESEND_API_KEY`, `CONTACT_EMAIL_FROM/TO`, and optional
`CONTACT_RATE_LIMIT_*` and `LEAD_BACKUP_SUPABASE_*` variables already in `.env.example`.

### F2 — No HTTP security response headers (MEDIUM)

`next.config.ts` defines no `headers()` and `vercel.json` is bare, so the site ships
without `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options`,
`X-Content-Type-Options`, `Referrer-Policy`, or `Permissions-Policy`.

Recommendation (later phase): add a headers policy (Next.js `headers()` or
`vercel.json` `headers`). CSP needs testing against the maps/image embeds before
enforcing, so treat as its own change with verification, not a Phase 0 quick fix.

### F3 — `images.remotePatterns` allows any HTTPS host (LOW)

`next.config.ts` sets `remotePatterns` to `hostname: "**"`, permitting the Next.js
image optimizer to proxy images from any HTTPS origin. Recommendation: restrict to
the specific hosts actually used (own domain, listings API/CDN).

### F4 — Local absolute path committed in a doc (LOW / hygiene)

`LAUNCH_CHECKLIST.md:93` contains `/Users/yhyh7/malickland.net`, a personal local
path in a published doc. Recommendation: replace with a repo-relative or generic
reference during the F1 doc cleanup.

---

## 4. Self-reported items NOT re-verified in this pass — UNVERIFIED

`SECURITY.md` §"Current Immediate Risks" lists items that this read-only pass did
**not** independently re-audit (they touch `listing-system/`, the Cloudflare Worker,
and Apps Script, which were out of scope here). Flagged so they are not assumed
resolved:

- Cloudflare Worker CORS reported as `*` (too permissive for write-adjacent APIs).
- Listing manager stores the Worker API token in `localStorage` (must stay admin-only).
- Apps Script deployment guidance uses "Anyone" access.
- Lead-capture IP retention in KV — retention/necessity/privacy-notice review.
- Dependency advisory status: `SECURITY.md` reported 0 vulns on 2026-06-19; **not
  re-run today.** Recommend `npm audit --omit=dev` again before launch.

These should be verified in the phase that touches `listing-system/`.

---

## 5. Recommended next actions

1. Owner: complete the Hostinger token revocation + shell-history scrub (§2) — this is the gate.
2. Remediate F1 (Gmail→Resend doc drift) before any go-live rehearsal.
3. Schedule F2/F3 as a headers-hardening change with its own verification.
4. Re-verify the §4 self-reported items when `listing-system/` work is next opened.

Nothing in this repository blocks publication on credential grounds; the remaining
blockers are the manual Hostinger gate (§2) and the documentation defect F1.
