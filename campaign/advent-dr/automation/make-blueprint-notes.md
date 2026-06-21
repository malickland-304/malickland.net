# Make.com alternative — notes & credit budget

Make is a viable alternative to n8n, but mind the cost model.

## Credit reality

- Free plan: **1,000 credits/month.**
- **Every action (module run) consumes credits.** A single listing pushed across
  multiple channels with image rendering, multiple posts, and logging can burn
  far more than one credit — budget per run, don't assume "one listing = cheap."
- Re-verify current pricing before committing; plans change.

## Equivalent scenario (build later, not Day 1)

Mirror the n8n scaffold's safety properties:

1. **Trigger:** Watch Google Sheet rows (verified listing facts).
2. **Filter:** Only `verified = Y` AND `status = Active` continue.
3. **Manual approval gate:** Route through a step that requires human sign-off
   before any publish module runs (e.g., an email/approval module). No unattended
   real estate publishing.
4. **Publish modules:** Facebook Pages + Instagram (Meta connection), then a
   Buffer/LinkedIn/X module. Each is a credit-consuming action.
5. **Logging module:** Append result to a `post_log` sheet.

## Decision guidance

- One-off / single listing → **don't build this**; post manually (see `02-...`).
- Recurring, multi-listing, stable copy + locked disclosure → automation may earn
  its keep. Self-hosted **n8n Community (free)** avoids per-action credit costs at
  the price of running/maintaining it yourself; **Make** is faster to stand up but
  meters every action.

All compliance rules in `03-syndication-compliance-checklist.md` still apply to
automated posts — automation does not relax Fair Housing, disclosure, or
verified-facts requirements.
