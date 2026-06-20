# MalickLand Launch Checklist

Last updated: 2026-06-19

**Purpose:** the single pre-go-live gate. This ties the **lead-safety gate** and the
**compliance gate** from `COMPLIANCE_ROADMAP.md` into one pass/fail list. A page or the site does
not go live until every applicable item here is checked and verified (per `QA_CHECKLIST.md` →
"Verification Truthfulness": mark a box only when the check was actually run).

This is distinct from `QA_CHECKLIST.md` (per-task QA). This file is the **release** gate.

## A. Publish blockers (must be RESOLVED before any Phil-named page goes live)

- [x] **Title confirmed** — "WV Licensed Real Estate Agent" (owner-confirmed 2026-06-20).
- [x] **NAR status confirmed** — REALTOR® mark not used; no NAR/REALTOR® claim made (owner-confirmed 2026-06-20).
- [x] **Licensed office confirmed** — MalickLand — WV Real Estate Agency, 501 East Main Street, Romney, WV 26757, (540) 246-1421 (owner-confirmed 2026-06-20). Recorded in `src/lib/compliance.ts`. Exact statutory byline/broker-of-record wording remains owner/legal-confirmable.

> Until all three are checked, pages that name Phil stay unpublished. Non-Phil pages may ship if
> they pass sections B–E.

## B. Lead-safety gate (per form, before that form goes live)

- [ ] Test submission sent through `/api/contact` and **received** at the destination inbox.
- [ ] All **attribution hidden fields** present and populated in the received lead (e.g. source
      page/path, service tag, UTM/referrer, timestamp).
- [ ] Service-interest + timeline fields preserved end-to-end (already covered by `npm run test:contact`).
- [ ] **Failure path verified:** with mail misconfigured/unreachable, the user sees an error and the
      form does **not** report false success. No lead silently drops.
- [ ] Required Gmail env vars (`GMAIL_USER`, `GMAIL_APP_PASSWORD`) present in the deploy environment
      (names only — never commit secrets).
- [ ] Consent line present on the form.
- [ ] (Recommended) Basic abuse/rate-limit control in place or the gap explicitly accepted for launch
      (see `TASKS.md` "Add durable contact abuse protection").

## C. Compliance gate (every page)

- [x] Global **footer disclosure** present: licensed-office identification + office address
      (`501 East Main Street, Romney, WV 26757`) + phone (`(540) 246-1421`). Implemented in `src/components/footer.tsx` via `LicensedOfficeDisclosure`, sourced from `src/lib/compliance.ts`; renders on every page through the layout.
- [x] On **any page that names Phil**, § 174-1-17 satisfied (project interpretation — owner/legal to confirm wording):
  - [x] Firm/broker lockup present and **half-size** compliant (`FirmBrokerLockup` + footer disclosure; firm name rendered at ≥ half the agent-name size).
  - [x] **Byline** rule met — "WV Licensed Real Estate Agent" from blocker A.
  - [x] Disclosure reachable in **≤ 2 clicks** from any social entry point — footer social icons sit directly beside the global disclosure (0 clicks). *Live re-verify once deployed.*
- [ ] MEDjAi offer pages carry the not-an-appraisal / informational-only disclaimer (already in `offers.ts`).

## D. Per-page Definition of Done (each public page)

- [ ] Renders correctly desktop + mobile.
- [ ] Meta title + description set.
- [ ] JSON-LD added where applicable (`RealEstateListing` / `LocalBusiness`).
- [ ] No broken internal links; nav + footer consistent.

## E. Build / deploy verification (run before promoting)

- [ ] `npm audit --omit=dev` → 0 production vulnerabilities (or documented mitigation).
- [ ] `CI=1 NEXT_TELEMETRY_DISABLED=1 npm run build` passes.
- [ ] Scoped lint passes: `npm run lint -- --no-warn-ignored --no-error-on-unmatched-pattern src next.config.ts eslint.config.mjs`.
- [ ] `./node_modules/.bin/tsc --noEmit` passes.
- [ ] `npm run test:contact` passes.
- [ ] DNS/SSL topology verified (Squarespace DNS → Cloudflare → host); no deploy/DNS/Cloudflare
      change made without explicit owner sign-off (`AGENTS.md`).

## Sign-off

- [ ] Sections B–E pass for all shipping pages.
- [ ] Section A resolved for any Phil-named page being published.
- [ ] Result recorded in `WORK_LOG.md` with the actual commands/checks run.

> No item may be marked complete on inference. Failed, skipped, or simulated checks are recorded
> with their real status.
