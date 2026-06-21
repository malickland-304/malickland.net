# Malickland 2.0 Decisions

## 2026-06-21 - Add Advent Dr Social Campaign Kit As Standalone Content (Not Production Website Work)

Problem: The owner requested a social media campaign for the current Advent Dr listing in Romney, WV, and authorized committing the kit to this `malickland.net` repo. Two governance tensions existed: (1) `.cursor/rules/not-wv-property-production.mdc` says to stop before committing if a request involves `/37-advent` or current production website work; (2) the original "zero-budget" brief overstated free tiers and assumed a free public-listing syndication lane.

Decision: Add a standalone, content-only campaign kit under `campaign/advent-dr/` (copy, posting schedule, syndication/compliance checklist, tooling/automation guide, reusable prompt, and a disabled build-later n8n/Make automation scaffold). Explicitly scope it to the **current** Advent Dr listing, which is **not** the closed `37 Advent Dr` production listing the cursor rule protects. Do not edit, deploy, or infer any website route (`/listings`, `/37-advent`, `/wv/*-county`), DNS, Cloudflare, Vercel, or production data. Pull the brokerage disclosure from the existing single source of truth `src/lib/compliance.ts` (owner-confirmed 2026-06-20) rather than re-stating it; keep verified-facts-only copy with bracketed fields for all unconfirmed facts.

Reasoning: Authority precedence rule #1 (explicit human owner instruction) authorizes committing the kit here. The cursor rule's intent — don't do production website work and don't infer production state from this prototype — is preserved because this change is marketing content only and touches no production surface. The closed `37 Advent Dr` listing is deliberately excluded. Compliance constraints (rule #2) are honored via Fair-Housing-safe language, required disclosure, no invented price/acreage/utilities/returns/urgency, and a manual-approval gate in the automation scaffold.

Alternatives considered: (1) commit to `openclaw-system` instead — rejected, owner chose `malickland.net`; (2) chat-only, no commit — rejected, owner wanted versioned artifacts; (3) treat as production listing work and stop — rejected, this is a different (current) listing and content-only, with explicit owner authorization.

Corrections applied to the original brief: free-tier limits stated accurately (Buffer 3 channels / 10 posts per channel; Later 14-day trial then paid; n8n Cloud paid vs self-hosted Community free; Make 1,000 credits/month consumed per action); removed the "free syndication to all portals" assumption (MLS feed drives major portals if MLS-backed, otherwise each portal is a separate manual compliance check); automation kept out of Day 1.

Security/performance impact: None to the running app — no code, route, dependency, deploy, or credential changes. The automation scaffold is `active: false` with a manual-approval gate and placeholder credentials only; no secrets committed.

Files affected: `campaign/advent-dr/**`, `DECISIONS.md`, `TASKS.md`, `PROJECT_STATE.md`, `WORK_LOG.md`.

Open owner confirmations (gate publishing): verified listing facts for the current Advent Dr property; brokerage/agent license number and exact WV § 174-1-17 byline wording; official social handle(s); scheduling/contact URL; whether to add "Equal Housing Opportunity" to housing ads. REALTOR® mark must not be used.

## 2026-06-19 - Re-target Compliance Roadmap Onto Existing Next.js Stack

Problem: The compliance implementation roadmap was drafted against a Squarespace build with a Resend email pipeline, Squarespace Saved Sections/Site Styles, and a forest-green palette. The shipped repository is a Next.js 16 / React 19 app with a Gmail/Nodemailer `/api/contact` pipeline, Tailwind v4, a forest green/gold palette, and a Cloudflare Worker listing subsystem. `AGENTS.md` and `ARCHITECTURE.md` forbid replacing this topology without documented failure evidence, migration impact, and rollback.

Decision: Re-target the roadmap onto the existing Next.js stack instead of switching platforms. The roadmap is captured in `COMPLIANCE_ROADMAP.md` as the canonical single source of truth with an explicit term-mapping table (Saved Sections → React components, Resend → `/api/contact`, hidden attribution fields → contact-form fields validated server-side, etc.). The shipped forest green/gold palette (`#1C3A1C` / `#C4A040`, hardcoded across components and pages) and Gmail pipeline remain authoritative. No Squarespace migration and no Resend adoption is performed as part of this roadmap. Note: `globals.css` and `README.md` still reference stale navy `--brand-*` tokens (`#1e3a5f` / `#c8961e`) that no longer match the implemented UI; reconciling them is a tracked cleanup, not a rebrand.

Reasoning: No failure evidence justifies replacing a working, audited Next.js deployment. Re-targeting preserves all compliance and lead-safety intent (footer disclosure on every page, § 174-1-17 half-size/two-click/byline on Phil-named pages, attribution fields, lead-safety gate) while honoring the governance stability rules.

Alternatives considered: (1) Squarespace replaces Next.js — rejected, no failure evidence, large rollback risk; (2) Squarespace as a parallel track — rejected for now, duplicates surfaces and lead pipelines; (3) planning-doc-only with no platform commitment — unnecessary since the safer path (keep Next.js) is clear. The owner selected re-target.

Security/performance impact: Avoids an unaudited platform/email migration and keeps the existing hardened `/api/contact` validation and dependency posture. Adds compliance disclosure and lead-attribution requirements as tracked work, not as live changes.

Files affected: `COMPLIANCE_ROADMAP.md`, `LAUNCH_CHECKLIST.md`, `TASKS.md`, `WORK_LOG.md`, `DECISIONS.md`.

Open owner confirmations (gate go-live of any Phil-named page): (1) Phil's licensed title/byline; (2) NAR/REALTOR® status; (3) licensed office of record + responsible broker.

## 2026-05-27 - Human Owner And Repository-Governed Multi-Agent Authority

Problem: Multiple agents need deterministic coordination without relying on conversational memory, while unresolved project authority conflicts still need a non-AI final escalation path.

Decision: Use this precedence order: explicit human project-owner instruction for the current task; security, privacy, legal, and production-safety constraints; `AGENTS.md`; `ARCHITECTURE.md`; `SECURITY.md`; `DECISIONS.md`; `TASKS.md`; `PROJECT_STATE.md`; `QA_CHECKLIST.md`; `WORK_LOG.md`; temporary handoff documents and conversational notes.

Reasoning: Persistent repo governance reduces prompt drift and makes coordination reproducible. Human owner instruction remains the final escalation path for unresolved authority conflicts, while AI agents are prohibited from appointing themselves as final arbiters.

Alternatives considered: conversation-only coordination, repository-only authority with no human escalation path, and tool-specific instructions. Each is weaker for multi-agent continuity or unresolved project governance conflicts.

Security/performance impact: Safer conflict handling and clearer stop conditions reduce accidental insecure changes and architecture churn.

Files affected: `AGENTS.md`, `ARCHITECTURE.md`, `PROJECT_STATE.md`, `TASKS.md`, `DECISIONS.md`, `SECURITY.md`, `QA_CHECKLIST.md`, `WORK_LOG.md`.

## 2026-05-27 - Preserve Current Next.js Plus Listing Worker Architecture Pending Evidence

Problem: The repo contains a Next.js marketing app and an untracked Cloudflare Worker listing subsystem, while prior Malickland work also involved a separate `wv-property-intelligence` Express/SQLite app.

Decision: Treat this checkout as the `malickland.net` Next.js 16/React 19 app with a candidate Worker/Apps Script listing subsystem. Do not import assumptions from `wv-property-intelligence` without fresh evidence.

Reasoning: Current repo evidence shows `package.json`, App Router files under `src/app`, and `listing-system/` with Worker/KV/Apps Script docs. Mixing architectures would increase risk.

Alternatives considered: treating `wv-property-intelligence` as the active app or redesigning around a new database-backed architecture. Both are rejected until repo governance documents justify that change.

Security/performance impact: Reduces accidental deployment, data, and routing mistakes while the listing system is still unverified.

Files affected: `ARCHITECTURE.md`, `PROJECT_STATE.md`, `TASKS.md`.

## 2026-06-19 - Use Vercel Analytics As Current Implemented Analytics

Problem: The site needed analytics instrumentation, while roadmap discussions also referenced GA4. The repo did not have a documented current analytics implementation.

Decision: Install `@vercel/analytics` and wire `<Analytics />` globally in `src/app/layout.tsx`. Treat Vercel Analytics as the current implemented analytics path. GA4 remains a separate future decision and is not installed by this change.

Reasoning: The app already targets a Vercel-compatible Next.js deployment path, and global App Router instrumentation gives page analytics without changing the contact flow, listing subsystem, or hosting topology.

Alternatives considered: adding GA4 immediately, deferring analytics entirely, or moving to a Squarespace/Resend topology. GA4 is deferred until there is an explicit tracking requirement and property configuration; the topology swap is rejected by current architecture governance.

Security/performance impact: Adds Vercel's client analytics script globally. No secrets or user-submitted contact data are added to committed files.

Files affected: `package.json`, `package-lock.json`, `src/app/layout.tsx`, `ARCHITECTURE.md`, `PROJECT_STATE.md`, `README.md`, `WORK_LOG.md`.
