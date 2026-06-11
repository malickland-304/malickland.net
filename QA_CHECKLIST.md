# Malickland 2.0 QA Checklist

Last updated: 2026-06-02

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
- [ ] `npm run lint`
- [ ] `npm run build`

## Missing Checks To Add

- [x] Unit tests for `/api/contact` validation helper: `npm run test:contact` passed on 2026-06-02 in the main checkout and `/tmp/malickland-contact-validate-20260602`.
- [x] Main checkout build/dev recovery check: `CI=1 NEXT_TELEMETRY_DISABLED=1 npm run build` passed on 2026-06-07 after excluding `*.codex-backup-*` from git and TypeScript source scanning; `npm run dev -- --port 3001` reached ready in 351ms.
- [x] Main checkout scoped lint/type-check: scoped ESLint and `./node_modules/.bin/tsc --noEmit --pretty false` passed on 2026-06-07.
- [ ] Route-handler mail-send tests for `/api/contact`.
- [ ] Listing fetch fallback tests for `/listings`.
- [ ] Worker validation and XSS-focused tests.
- [ ] Accessibility/browser smoke checks for public pages.
- [ ] Performance baseline for homepage, listings, and contact form.

## Verification Truthfulness

Only mark a check complete when it was actually run successfully. Failed, skipped, interrupted, inferred, or simulated checks must be labeled with their real status.

- 2026-06-07: Bare `npm run lint` still did not complete within about 30 seconds and was stopped. Use the scoped lint command until ESLint scan scope is tightened.
