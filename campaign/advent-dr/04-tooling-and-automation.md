# 04 — Tooling & Automation (honest costs, build automation later)

## Free-tier reality (verify before relying — pricing changes)

| Tool | What's actually free | Watch out for |
|------|----------------------|---------------|
| **ChatGPT / Claude** | Copy generation (you already pay). | Re-verify every fact it writes; it will happily invent acreage/price. |
| **Canva (free)** | Templates + listing graphic sizes. | Some assets/elements are Pro-only; keep brand colors + disclosure on free templates. |
| **Meta Business Suite** | Scheduling FB Page + Instagram posts/Reels/Stories, basic analytics. | None major for one listing. This is your primary free scheduler. |
| **Buffer (free)** | Queue posts. | **3 channels** and **10 scheduled posts per channel** on the free plan. Fine for one listing, not a pipeline. |
| **Later** | Visual planner. | **14-day free trial**, then paid (Starter). Not permanently free. |
| **Google Business Profile** | Posting listing updates locally. | None major. |
| **n8n** | **Self-hosted Community Edition is free.** | **n8n Cloud is paid.** Self-host means you run/maintain it. |
| **Make.com (free)** | **1,000 credits/month.** | **Each automation action burns credits** — one listing's multi-step, multi-channel run can consume more than expected. Budget per run. |

Sources to re-check periodically: Buffer pricing, Later pricing, n8n pricing +
the multi-platform template (workflow 3066), Make pricing.

## Recommended execution path

1. **Manual first.** ChatGPT/Claude copy → Canva graphics → Meta Business Suite
   for FB/IG. Use Buffer (free) only for LinkedIn / X / Google Business Profile
   if those are connected and within the 3-channel / 10-post cap.
2. **Verified facts only** (`00-FACTS.md`): exact price, acreage, parcel,
   property type, photos, landing URL, MLS/status, showing/contact method.
3. **Disclosure on graphics + copy** before publishing.
4. **Keep automation out of Day 1.** Meta Graph/API posting adds credential,
   app-review, access-token, and failure-state complexity. Don't take that on
   while the campaign language is still moving.
5. **Don't over-promise portal syndication.** See `03-...`: MLS feed drives major
   portals if MLS-backed; otherwise each portal is a separate manual check.

## When (and only when) to automate

Automate **after** the campaign language and compliance are stable and you have a
*repeatable* listing process worth the setup cost. Good signals: you're doing
this for multiple listings, the disclosure/format is locked, and you've felt the
manual toil.

Then build it as a **listing pipeline**, not a one-off:

- **Trigger:** new/updated row in a Google Sheet (your verified listing facts).
- **Guardrail:** a manual approval step before anything posts (no fully
  unattended publishing of real estate copy).
- **Actions:** render graphic (or pull a Canva export) → post to FB/IG via Meta
  Graph API → queue LinkedIn/X via Buffer.
- **Failure states:** handle token expiry, rate limits, partial-post failures,
  and log every attempt.

See `automation/n8n-listing-social.workflow.json` (a disabled scaffold with a
manual-approval gate — **not** a Day-1 import) and
`automation/make-blueprint-notes.md` for the Make alternative and its credit
budget.

## Reusable prompt

Use `05-prompt.md` to regenerate copy for this or any future listing. It scopes
the model to verified facts only, bans invented claims, blocks fair-housing-
sensitive targeting, and requires disclosure.
