# Malickland 2.0 Decisions

## 2026-06-22 - Defer Public Listings Feed For Launch

Problem: `/listings` fetched `LISTINGS_API_URL` or `https://malickland.net/api/listings`, but the cutover target does not currently own a verified production listings API. The page also had hardcoded fallback properties, which could expose sample inventory as if it were active real estate listings.

Decision: Defer the public listings feed for launch. Keep `/listings` as an honest property-search request page, remove it from the primary nav, homepage hero CTA, and footer quick links, and do not render fallback/sample properties. The Cloudflare Worker/listing-management subsystem remains future work and must not be routed in front of production until account, KV, data ownership, security, and review steps are verified.

Reasoning: A clean launch with no fabricated inventory is safer than adding a second production data system under time pressure. Buyers and sellers still have a lead path through `/contact?service=Listings%20%2F%20Showings`.

Alternatives considered: (1) ship sample fallback listings — rejected as a compliance/data-integrity risk; (2) deploy the existing Cloudflare Worker now — rejected for launch because it adds Cloudflare account/KV/routing/data-review work; (3) build a Next.js listings API before launch — deferred until the public site is live.

Security/performance impact: Removes an unauthenticated external fetch from the launch path and avoids publishing unverified property data. No production secrets, DNS, or Vercel settings are changed.

Files affected: `src/app/listings/page.tsx`, `src/components/nav.tsx`, `src/components/footer.tsx`, `src/app/page.tsx`, `ARCHITECTURE.md`, `TASKS.md`, `LAUNCH_CHECKLIST.md`, `WORK_LOG.md`.

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

Problem: The repo contains a Next.js marketing app and a Cloudflare Worker listing subsystem, while prior Malickland work also involved a separate `wv-property-intelligence` Express/SQLite app.

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
