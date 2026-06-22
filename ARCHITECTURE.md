# Malickland 2.0 Architecture

Last updated: 2026-06-22

## Current System

Malickland 2.0 is currently a public real-estate marketing website plus a tracked but deferred listing-management subsystem.

## Primary App

- Framework: Next.js 16 App Router.
- UI: React 19, TypeScript, Tailwind CSS v4, lucide-react icons.
- Analytics: Vercel Analytics is globally wired in the App Router root layout through `@vercel/analytics/next`.
- Routes:
  - `/`: public homepage.
  - `/services`: public service-offer index.
  - `/services/[slug]`: public service-offer detail pages for deal facilitation and MEDjAi report/checkup offers.
  - `/listings`: launch-safe property-search request page. It does not fetch or render listing inventory until a production listings data source is verified.
  - `/about`: public bio and service-area page.
  - `/contact`: client contact form.
  - `/api/contact`: Next.js route handler that sends contact inquiries through Gmail via Nodemailer.
- Hosting: README says Squarespace DNS to Cloudflare to Vercel or custom host. Current production topology must be verified before deployment changes.
- Package manager: npm with `package-lock.json` as the lockfile of record.

## Listing System Subsystem

The `listing-system/` directory is tracked for future work but deferred for launch. It contains:

- `listing-system/workers/worker.js`: Cloudflare Worker for listing pages, listing JSON APIs, listing save endpoint, and lead capture.
- `listing-system/workers/wrangler.toml`: Cloudflare Worker config with placeholder account and KV IDs.
- `listing-system/frontend/listing-manager.html`: browser-based listing manager that stores config locally and posts to the Worker.
- `listing-system/backend/google-apps-script.gs`: Google Apps Script for Google Sheets and Drive integration.

## Data Flow

1. Launch path: `/listings` routes visitors to a property-search request flow and `/contact?service=Listings%20%2F%20Showings`.
2. Future listing-system path, not launch-active: listing manager submits listing data and images to `POST /api/save` with Bearer token auth.
3. Future listing-system path, not launch-active: Cloudflare Worker stores listing records in KV and updates the `__index` key.
4. Future listing-system path, not launch-active: Worker optionally forwards lead data to a Google Apps Script webhook.
5. Vercel Analytics collects page analytics from the global App Router layout when the app is deployed on a supported Vercel runtime. GA4 is not currently installed and remains a separate future decision.

## Architectural Stability

- Do not merge `wv-property-intelligence` assumptions into this repo without fresh evidence. This repo is `malickland.net`, not the older Express/SQLite app.
- Do not replace the current Next.js + Worker + Apps Script topology without documenting failure evidence, migration impact, rollback plan, and affected files in `DECISIONS.md`.
- Do not deploy Worker route changes or re-enable a public listings feed until the production listings data source, account/KV ownership, review process, and route ownership are explicitly verified and recorded in `DECISIONS.md`.
