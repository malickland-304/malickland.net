# Go-Live Runbook — malickland.net

Last updated: 2026-06-28

**Who runs this:** the project owner (Phil / malickland-304). Every step here is
owner-only by governance (`AGENTS.md`): DNS, Cloudflare, Vercel settings, and
production secrets. Agents prepared this document and the repo-side code, but
must not perform these steps.

**Goal:** the public domain serves the new site and every contact-form lead
reliably reaches Phil. That is the revenue gate — nothing else on the roadmap
matters until this passes.

This runbook sequences `LAUNCH_CHECKLIST.md` §B (lead safety) and §F (cutover).
Mark checklist boxes there as you verify; this file is the "in what order" view.

---

## Step 1 — Verify the Vercel deployment serves (5 min)

The project previously reported `framework: null` and served 404s. It is now
pinned via `vercel.json` (`"framework": "nextjs"`), but verify before touching
DNS:

1. Open `https://malickland-net.vercel.app/` and check these all render
   (no Vercel 404 page):
   - `/`
   - `/contact`
   - `/services`
   - `/services/property-intelligence-report`
2. If anything 404s, **stop** — fix the Vercel project (Settings → Build &
   Development: Framework Preset must be Next.js) and redeploy before Step 3.

## Step 2 — Verify lead email end to end (10 min)

1. In Vercel → Project → Settings → Environment Variables (Production),
   confirm:
   - `GMAIL_USER` = the inbox that should receive leads
   - `GMAIL_APP_PASSWORD` = a valid Gmail **app password** for that account
     (16 chars; whitespace is stripped by the app, but paste it clean)
2. Redeploy production after any env change (env vars are baked at deploy).
3. Submit a real test lead through `/contact` **on the Vercel URL** and confirm
   it arrives in the inbox with the attribution block populated (source path,
   service tag, UTM fields, timestamp).
4. Failure-path check: the form must show an error (never a false success)
   if mail is broken. This is already covered by tests, but one manual look at
   a live submit's response is cheap confidence.

## Step 3 — Activate the lead backup store (10 min, once)

Insurance so a Gmail outage can never lose a lead. Optional but strongly
recommended **before** cutover.

1. Apply `supabase/migrations/0001_contact_leads_backup.sql` in the Supabase
   SQL editor (project `malickland-304's Project`, ref
   `kwhffzvoflplumrarcbh` — the project must be un-paused; free-tier projects
   auto-pause after ~1 week idle, so check its status).
2. In Vercel → Environment Variables (Production), add:
   - `LEAD_BACKUP_SUPABASE_URL` = `https://kwhffzvoflplumrarcbh.supabase.co`
   - `LEAD_BACKUP_SUPABASE_KEY` = the project's **publishable/anon** key
     (Supabase dashboard → Settings → API keys). This key is non-secret by
     design; the table is insert-only under RLS.
3. Redeploy, submit another test lead, and confirm a row appears in
   Supabase → Table Editor → `contact_leads` with `email_delivered = true`.

After this, every lead is written to the table with its delivery status —
including leads whose email send fails. If Gmail ever breaks, recover leads
from this table (`email_delivered = false`).

## Step 4 — Cut the domain over (15 min + DNS propagation)

`malickland.net` currently resolves through Cloudflare to the old VPS app
(`31.97.58.203`). The new site is not public until this flips.

1. Confirm Steps 1–2 passed on the Vercel URL first.
2. In Cloudflare DNS for `malickland.net`, point the apex and `www` at Vercel
   per Vercel's domain instructions (the domains are already attached to the
   Vercel project, so Vercel shows the exact records it expects).
3. Wait for propagation, then verify `https://malickland.net/` serves the new
   site (check the same four routes as Step 1).
4. Submit one final test lead on the real domain and confirm inbox +
   (if Step 3 done) `contact_leads` row.

## Step 5 — Declare launch

- Tick the remaining §B and §F boxes in `LAUNCH_CHECKLIST.md` (only for checks
  actually run).
- Note the cutover date in `WORK_LOG.md`.
- Decommission or firewall the old VPS app so stale content can't shadow the
  live site.

---

## Ongoing (weekly, 2 min)

- Glance at Supabase `contact_leads` for rows with `email_delivered = false` —
  each one is a lead that would have been lost pre-backup. If any appear,
  fix Gmail creds and contact those leads.
- Free-tier Supabase pauses after ~1 week without traffic; form submissions
  count as activity, but if traffic is very low, un-pause it during the weekly
  glance.
