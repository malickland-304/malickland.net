# Advent Dr — Social Media Campaign Kit

A zero-/low-budget, compliance-first social campaign for the **current Advent Dr
listing in Romney, WV** (MalickLand — WV Real Estate Agency; see
`src/lib/compliance.ts` for the confirmed licensed-office disclosure).

> **This is NOT the closed `37 Advent Dr` property.** That listing closed. This
> kit is for the *current* Advent Dr listing only. Do not reuse `37 Advent Dr`
> facts, photos, price, or the `/37-advent` production page. This kit also does
> **not** touch any website route, deployment, DNS, or production listing data —
> it is standalone marketing content (copy, schedule, checklists, an automation
> scaffold) you deploy by hand through your own social accounts.

## Why this exists / what changed from the original draft

The original "zero-budget" plan was a good *core* (generate copy once → make
Canva assets → schedule FB/IG manually → automate only after language and
compliance are stable) but it overstated "free" and assumed a public-listing
syndication lane that may not apply. This kit keeps the good core and corrects:

- **Free tiers are limited, not unlimited.** See `04-tooling-and-automation.md`
  for current caps (Buffer 3 channels / 10 scheduled posts per channel; Later is
  a 14-day trial then paid; n8n Cloud is paid while self-hosted Community is
  free; Make's free plan is 1,000 credits/month and each action burns credits).
- **No invented facts.** No price, acreage, utilities, financing, views, zoning,
  school quality, investment returns, or urgency claims unless you confirm them
  in `00-FACTS.md`. Every copy block uses bracketed `[FIELDS]` until then.
- **Fair-housing safe.** No audience targeting or language tied to protected
  classes (race, color, religion, sex, familial status, national origin,
  disability). No "perfect for families," "safe neighborhood," etc.
- **Brokerage disclosure required** on graphics and copy before anything posts.
- **No "free syndication" promise.** If this listing is MLS-backed, the MLS feed
  should drive the major portals (Zillow/Realtor.com/Homes.com). If it is not,
  treat each portal as a separate manual compliance check, not a free auto-post.
- **Manual first, automation later.** Day 1 is human-posted. Build the
  n8n/Make pipeline only after the language and compliance are locked.

## Files

| File | Purpose |
|------|---------|
| `00-FACTS.md` | **Start here.** Verified-facts intake sheet. Nothing is "final" until this is filled in and disclosure/handle/contact URL are confirmed. |
| `01-copy.md` | All ready-to-adapt copy: MLS-safe description, IG/FB/LinkedIn/short-form/Pinterest, and Canva text overlays. |
| `02-posting-schedule.md` | Manual-first posting sequence and a repeatable weekly rhythm. |
| `03-syndication-compliance-checklist.md` | Portal/syndication reality check + the compliance gate that must pass before publishing. |
| `04-tooling-and-automation.md` | Honest free-tier breakdown, manual workflow, and the build-later automation plan. |
| `05-prompt.md` | The reusable, compliance-scoped copywriting prompt (works for any future listing). |
| `automation/n8n-listing-social.workflow.json` | A **build-later** n8n workflow scaffold (disabled/manual approval), not a Day-1 step. |
| `automation/make-blueprint-notes.md` | Make.com alternative notes + credit-budget warning. |

## Status: DRAFT — not publish-ready

Per prior MalickLand copy guidance, public-facing material is **not final**
until these are confirmed:

1. Brokerage / legal disclosure — firm/office/agent **confirmed** via
   `src/lib/compliance.ts` (2026-06-20). Still open: license number and the
   exact WV § 174-1-17 statutory byline wording. REALTOR® mark must **not** be
   used.
2. Official social handle(s) — open.
3. Scheduling / contact URL used in the CTA — confirm (`/contact` exists).
4. Verified listing facts for the **current** Advent Dr property — open.

Track all of these in `00-FACTS.md`.
