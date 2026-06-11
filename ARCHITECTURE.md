# Malickland 2.0 Architecture

Last updated: 2026-06-07

## Current System

Malickland 2.0 is currently a public real-estate marketing website plus an untracked listing-management subsystem.

## Primary App

- Framework: Next.js 16 App Router.
- UI: React 19, TypeScript, Tailwind CSS v4, lucide-react icons.
- Routes:
  - `/`: public homepage.
  - `/services`: public service-offer index.
  - `/services/[slug]`: public service-offer detail pages for deal facilitation and MEDjAi report/checkup offers.
  - `/listings`: server-rendered listings page that fetches listing data.
  - `/about`: public bio and service-area page.
  - `/contact`: client contact form.
  - `/api/contact`: Next.js route handler that sends contact inquiries through Gmail via Nodemailer.
- Hosting: README says Squarespace DNS to Cloudflare to Vercel or custom host. Current production topology must be verified before deployment changes.

## Listing System Subsystem

The `listing-system/` directory is currently untracked by git as of this audit. It contains:

- `listing-system/workers/worker.js`: Cloudflare Worker for listing pages, listing JSON APIs, listing save endpoint, and lead capture.
- `listing-system/workers/wrangler.toml`: Cloudflare Worker config with placeholder account and KV IDs.
- `listing-system/frontend/listing-manager.html`: browser-based listing manager that stores config locally and posts to the Worker.
- `listing-system/backend/google-apps-script.gs`: Google Apps Script for Google Sheets and Drive integration.

## Data Flow

1. Listing manager submits listing data and images to `POST /api/save` with Bearer token auth.
2. Cloudflare Worker stores listing records in KV and updates the `__index` key.
3. Worker optionally forwards lead data to a Google Apps Script webhook.
4. Next.js `/listings` fetches JSON from `LISTINGS_API_URL` or `https://malickland.net/api/listings` with 60-second revalidation.

## Architectural Stability

- Do not merge `wv-property-intelligence` assumptions into this repo without fresh evidence. This repo is `malickland.net`, not the older Express/SQLite app.
- Do not replace the current Next.js + Worker + Apps Script topology without documenting failure evidence, migration impact, rollback plan, and affected files in `DECISIONS.md`.
- Do not deploy Worker route changes until routing ownership between Next.js `/listings` and Worker `/listings` is explicitly resolved.
