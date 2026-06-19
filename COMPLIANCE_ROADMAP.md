# MalickLand Compliance Implementation Roadmap

Last updated: 2026-06-19

**Status: Canonical single source of truth.** Strategy → Method → Implementation for the
compliant, lead-capturing build of `malickland.net`. All agents (Codex, Gemini, Claude Code)
read from this file. Conversational notes do not override it (see `AGENTS.md` precedence).

## Platform decision (read first)

This roadmap was originally drafted against a **Squarespace + Resend** build. It has been
**re-targeted onto the existing Next.js 16 + Gmail/Nodemailer stack** that this repository
actually ships. See `DECISIONS.md` → "2026-06-19 — Re-target compliance roadmap onto existing
Next.js stack". Terminology mapping used throughout this document:

| Roadmap term (original)        | This repo (re-targeted)                                             |
|--------------------------------|---------------------------------------------------------------------|
| Squarespace Site Styles        | Tailwind CSS v4 design tokens + shared layout components            |
| Squarespace Saved Sections     | Reusable React components under `src/`                              |
| Resend pipeline                | `/api/contact` Gmail/Nodemailer route handler                       |
| Hidden attribution fields      | Hidden form fields in the contact form + validated in `/api/contact`|
| Browse Properties / hub embed  | Existing `/listings` route + Cloudflare Worker listing subsystem    |
| Buyer's Guide PDF lead magnet  | Static asset served from `public/` + gated CTA                      |

Brand note: the shipped app already uses a **forest green `#1C3A1C`** (darker `#0F2A0F`/`#142814`,
border `#254E25`) / **gold `#C4A040`** (light `#D4B050`) palette, hardcoded across the pages and
components (`src/components/footer.tsx`, `src/components/nav.tsx`, `src/app/**/page.tsx`,
`src/app/contact/ContactForm.tsx`). This palette is authoritative. Note: `src/app/globals.css` and
`README.md` still define/list stale navy `--brand-*` tokens (`#1e3a5f` / `#c8961e`) that no longer
match the implemented UI — reconciling or removing them is a cleanup item, not a rebrand. (The
roadmap's earlier `#1E3A1E`/`#C4A84F` values were approximations of the real tokens above.)

## Standing gates (apply to every step)

- **Lead-safety gate:** no form goes live until a test submission lands in the pipeline via
  `/api/contact` with all attribution fields populated. No lead may silently drop — failure paths
  must surface an error to the user and must not return a false success.
- **Compliance gate:** the global footer disclosure is present on every page, and the WV
  § 174-1-17 half-size, two-click, and byline rules are satisfied on any page that names Phil.

## Publish blockers (owner confirmations — gate go-live of any Phil-named page)

These three are unresolved. The build proceeds, but **no page that names Phil goes live** until
all three are confirmed by the human owner. Legal/regulatory wording must be owner-confirmed; the
descriptions below are the project's working interpretation, not legal advice.

1. **Title** — Phil's exact licensed title/designation for the byline (e.g., salesperson,
   associate broker, broker). Drives the byline text required by § 174-1-17.
2. **NAR status** — whether Phil is a REALTOR® (NAR member). Determines whether the REALTOR®
   mark may be used anywhere on the site.
3. **Licensed office** — the licensed brokerage name + office address that must appear in the
   firm/broker lockup and footer. Repo footer currently shows `MalickLand` and `501 East Main
   Street, Romney, WV 26757` — confirm the licensed office of record (full legal/brokerage name +
   address) and identify the responsible broker.

---

## Strategy

> Reconstructed from `README.md`, `PROJECT_STATE.md`, `DECISIONS.md`, and `src/app/services/offers.ts`.
> Items not yet evidenced in the repo are marked *(unverified)* rather than asserted.

- **Goal:** a complete, compliant, revenue-capturing public marketing site for MalickLand Real
  Estate, serving the Eastern Panhandle of West Virginia and the Potomac Highlands.
- **Revenue surfaces:** service offers (`/services/deal-facilitation`,
  `/services/property-intelligence-report`, `/services/seller-readiness-checkup`) feeding tagged
  lead intake at `/contact?service=...`, plus property `/listings`.
- **Positioning:** keep brokerage representation cleanly separate from MEDjAi informational
  research output (offers already carry not-an-appraisal disclaimers in `offers.ts`).
- **Constraints:** WV real-estate advertising compliance (§ 174-1-17) and lead-capture integrity
  are first-class requirements, not afterthoughts.
- **Success:** every public page renders correctly on desktop + mobile, every form delivers a
  traceable lead, and every Phil-named page meets the disclosure/byline rules.

## Method

> Reconstructed working method; aligns with `AGENTS.md` governance.

- Build foundations and a reusable component set once, then assemble pages from them.
- Ship the revenue cluster first; defer depth/marketing pages until the revenue path is live and tested.
- Gate every page behind the two standing gates and the per-page Definition of Done.
- Coordinate cross-agent work through dependencies recorded in this file and `TASKS.md`.
- Verify before claiming done: report only checks actually run (per `AGENTS.md`, `QA_CHECKLIST.md`).

---

## Implementation

### 1. Build order (sequenced, gated)

**Step 0 — Foundations** (no public pages yet)
- Design tokens: forest green `#1C3A1C` (dark `#0F2A0F`, border `#254E25`), gold `#C4A040`
  (light `#D4B050`), body text dark; typography + button styles via Tailwind v4. These are
  currently hardcoded across pages/components; reconcile the stale navy `--brand-*` tokens in
  `globals.css` (cleanup, not a rebrand).
- DNS/SSL sanity: Squarespace DNS → Cloudflare → Vercel/host topology verified before any deploy change.
- Global header (nav) + global footer with the **locked disclosure** (office address + phone +
  licensed-office identification).

**Step 1 — Component library** — build once, then reuse (sequence in §2).

**Step 2 — Revenue cluster (ships first):** Home, Services & Pricing, List Your Property, Contact —
assembled from shared components, forms wired to the live `/api/contact` pipeline.
> Dependency: the **attribution-fields** work (hidden fields in the contact form + `/api/contact`
> validation/echo) must land and pass review before these forms go live.

**Step 3 — Marketplace core:** `/listings` — curated cards live day one; Worker/hub embed follows.
Listing detail stays in the listing subsystem.

**Step 4 — Depth & trust:** How It Works, About, county landing pages (research content),
lead-magnet page (Buyer's Guide PDF from `public/`).

**Step 5 — SEO/analytics:** Vercel Analytics is now globally wired (handled in the separate
dependency lane, not this docs PR); GA4 remains a separate future decision unless explicitly added.
`RealEstateListing` / `LocalBusiness` JSON-LD; sitemap; Search Console; verify the social ≤2-click
disclosure path.

### 2. Component build sequence

Build in this order (earlier items gate later pages):

1. Lead-capture block — 5 fields, intent dropdown, consent line, **hidden attribution fields** (gates Step 2)
2. Trust strip — service area + firm/broker lockup (half-size compliant) + response promise
3. Intent router — 4 cards
4. Tier/pricing card — one design ×4
5. Featured-listings block + curated card fallback
6. Social strip + final CTA — with ≤2-click disclosure path
7. Snippet library — JSON-LD schema, consent line, attribution hidden fields (paste-in)

### 3. What ships first (MVP)

Foundations + component library + the revenue cluster (Home, Services & Pricing, List Your
Property, Contact) with live, tested lead forms. `/listings` launches with curated cards; the
Worker embed and depth pages follow. Result: a complete, compliant, revenue-capturing site without
waiting on the full listing embed.

### 4. Definition of done (per page)

- Renders correctly desktop + mobile (mobile rules satisfied).
- Any form posts to `/api/contact`; test lead received with attribution fields populated; failure
  path surfaces an error and does not report false success.
- Footer disclosure present; if the page names Phil → § 174-1-17 half-size + byline rules met and
  title confirmed.
- Meta title + description set; JSON-LD added where applicable.

### 5. Coordination (dependencies only)

- **Attribution-fields work:** extends the contact form + `/api/contact`; gates Step 2 forms.
- **County content:** gates Step 4 depth pages.
- **Owner (human):** content + approvals; the 3 confirms gate go-live of any Phil-named page;
  DNS/Cloudflare/Vercel/credential changes require explicit owner sign-off per `AGENTS.md`.
- **Assembling agent:** holds this canonical doc; assembles + QA.

---

## Cross-references

- Pre-go-live gate: `LAUNCH_CHECKLIST.md`
- Per-task QA: `QA_CHECKLIST.md`
- Open work + blockers: `TASKS.md`
- Architecture: `ARCHITECTURE.md`
- Decision record: `DECISIONS.md`
