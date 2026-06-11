# Malickland 2.0 Tasks

Last updated: 2026-06-07

## Critical

- [x] Remove production dependency audit blockers - acceptance: `npm audit --omit=dev` reports 0 production vulnerabilities or remaining advisories are documented with mitigation - verification: `npm audit --omit=dev --json` reported 0 vulnerabilities after narrow package updates and a `postcss` override - date/agent: 2026-05-27/Codex.
- [x] Harden `/api/contact` input handling - acceptance: validates types, trims fields, enforces length limits, validates email shape, requires Gmail env vars before sending, avoids sensitive logs, and has targeted tests or documented manual verification - verification: `npm run test:contact`, scoped ESLint, `tsc --noEmit`, `npm audit --omit=dev`, and `npm run build` passed in `/tmp/malickland-contact-validate-20260602`; main checkout lint/type-check still hang and are not counted as passing - date/agent: 2026-06-02/Codex.
- [ ] Resolve listings route ownership - acceptance: `ARCHITECTURE.md` and `DECISIONS.md` state whether Next.js or Cloudflare Worker owns `/listings`, and deployment routes match the decision - dependencies: production routing evidence - status: open.

## High Priority

- [ ] Decide whether to track `listing-system/` - acceptance: decision records ownership, deployment path, security requirements, and files to include/exclude - dependencies: repository governance review - status: open.
- [x] Add environment documentation - acceptance: `.env.example` and README document `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `LISTINGS_API_URL`, and deployment secret handling without real secrets - verification: `.env.example` contains names/placeholders only and README documents contact/listings env usage - date/agent: 2026-06-02/Codex.
- [x] Publish revenue offer pages - acceptance: `/services`, `/services/deal-facilitation`, `/services/property-intelligence-report`, and `/services/seller-readiness-checkup` exist with direct CTAs into contact intake; MEDjAi offers include not-an-appraisal disclaimers - verification: local route files added and offer CTAs point to `/contact?service=...` - date/agent: 2026-06-07/Codex.
- [x] Add service-tagged lead intake - acceptance: contact form includes service interest and timeline fields, URL service params preselect the service, and `/api/contact` includes those fields in validated email output - verification: `npm run test:contact` passed 7/7 with the existing module-type warning - date/agent: 2026-06-07/Codex.
- [ ] Add durable contact abuse protection - acceptance: `/api/contact` has production-suitable rate limiting or equivalent abuse controls documented with deployment assumptions and failure behavior - dependencies: hosting/runtime decision - status: open.
- [ ] Add first automated tests - acceptance: contact route validation and listing fetch fallback have repeatable checks in package scripts - dependencies: listing test approach - status: partial; contact validation has `npm run test:contact`, listing fetch fallback still open.
- [ ] Worker security hardening - acceptance: origin/CORS policy, payload limits, field validation, image URL safety, lead abuse controls, and XSS-sensitive template contexts are reviewed and tested - dependencies: Worker deployment decision - status: open.

## Medium Priority

- [x] Establish reliable validation lane for build/lint/type-check - verification: detached `/tmp/malickland-dep-validate` worktree passed `npm audit --omit=dev`, production build, scoped lint, and `tsc --noEmit` after dependency, ESLint config, homepage JSX escape, and listings diffs were applied - date/agent: 2026-05-27/Codex.
- [x] Investigate main checkout build/dev command hangs - acceptance: main path build and dev commands complete or the path-specific tooling issue is documented with a durable workaround - verification: moved stale generated dependencies aside, excluded `*.codex-backup-*` from git and TypeScript source scanning, `CI=1 NEXT_TELEMETRY_DISABLED=1 npm run build` passed in the main checkout, and `npm run dev -- --port 3001` reached ready in 351ms - date/agent: 2026-06-07/Codex.
- [ ] Improve lint performance/scope - acceptance: `npm run lint` completes reliably and excludes generated or non-source artifacts as needed - dependencies: current lint investigation - status: open.
- [ ] Capture baseline performance - acceptance: production or local build metrics, page weight, and Lighthouse or equivalent results are recorded - dependencies: runnable local/prod target - status: open.
- [ ] Improve accessibility review - acceptance: keyboard navigation, labels, contrast, responsive layout, and form states are checked for public pages - dependencies: browser verification - status: open.

## Completed

- [x] Create autonomous repository coordination files - verification: files added in this session and content aligned with repository-governed authority rule - date/agent: 2026-05-27/Codex.
