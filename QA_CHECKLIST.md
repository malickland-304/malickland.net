# Malickland 2.0 QA Checklist

Last updated: 2026-06-28

## Required Before A Task Is Complete

- [ ] Acceptance criteria are stated and met.
- [ ] Relevant files are inspected before editing.
- [ ] Existing uncommitted work is preserved.
- [ ] Functional behavior is verified.
- [ ] Failure paths and invalid inputs are checked.
- [ ] Security review is performed for touched surfaces.
- [ ] Performance impact is considered and measured when material.
- [ ] Documentation is updated when behavior, risks, setup, or decisions change.
- [ ] `WORK_LOG.md` is updated with objective, changes, verification, risks, and next task.

## Available Checks

- [ ] `npm audit --omit=dev`
- [ ] `npm audit`
- [ ] `npm run lint`
- [ ] `npm run test:contact`
- [ ] `npm run build`

## Missing Checks To Add

- [x] Unit tests for `/api/contact` validation helper: `npm run test:contact` passed on 2026-06-02 in the main checkout and `/tmp/malickland-contact-validate-20260602`.
- [x] Main checkout build/dev recovery check: `CI=1 NEXT_TELEMETRY_DISABLED=1 npm run build` passed on 2026-06-07 after excluding `*.codex-backup-*` from git and TypeScript source scanning; `npm run dev -- --port 3001` reached ready in 351ms.
- [x] Main checkout scoped lint/type-check: scoped ESLint and `./node_modules/.bin/tsc --noEmit --pretty false` passed on 2026-06-07.
- [x] Default lint script scope: `npm run lint` now runs `eslint src next.config.ts eslint.config.mjs` and passed on 2026-06-19.
- [x] Dependency/analytics validation: `npm ci --ignore-scripts`, `npm audit --omit=dev`, full `npm audit`, `npm run test:contact`, and `npm run build` passed on 2026-06-19.
- [ ] Route-handler mail-send tests for `/api/contact`.
- [ ] Worker validation and XSS-focused tests.
- [ ] Accessibility/browser smoke checks for public pages.
- [ ] Performance baseline for homepage, listings, and contact form.

## Verification Truthfulness

Only mark a check complete when it was actually run successfully. Failed, skipped, interrupted, inferred, or simulated checks must be labeled with their real status.

- 2026-06-19: `npm run lint` is no longer bare; it is scoped to `src next.config.ts eslint.config.mjs` and completed successfully in the main checkout.
