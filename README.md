# MalickLand Real Estate — Public Marketing Website

**malickland.net** — The public-facing marketing website for MalickLand Real Estate Agency, serving the Eastern Panhandle of West Virginia.

## Stack

- **Next.js 16** (App Router)
- **React 19** + **TypeScript 5**
- **Tailwind CSS v4** (CSS-first config, no `tailwind.config.js`)
- Hosted via Squarespace DNS → Cloudflare → Vercel (or custom host)

## Brand Colors

| Name | Hex |
|------|-----|
| Navy | `#1e3a5f` |
| Dark Navy | `#152d4a` |
| Darkest Navy | `#0f2137` |
| Gold | `#c8961e` |
| Light Gold | `#f0b429` |

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage — Hero, Services, About snippet, Testimonials |
| `/services` | Service offers — Deal Facilitation plus MEDjAi report/checkup offers |
| `/services/deal-facilitation` | MalickLand deal facilitation offer |
| `/services/property-intelligence-report` | MEDjAi property intelligence report offer |
| `/services/seller-readiness-checkup` | MEDjAi seller readiness checkup offer |
| `/listings` | Property listings with search/filter |
| `/about` | Phil Malick bio, expertise, WV counties served |
| `/contact` | Contact form, office hours, areas served |

## Getting Started

```bash
npm install
npm run dev
```

App runs at `http://localhost:3000`

## Environment Variables

Copy `.env.example` to `.env.local` for local development and fill in only the values needed for the feature you are testing.

| Variable | Required | Purpose |
|----------|----------|---------|
| `GMAIL_USER` | Contact form | Gmail account used by `/api/contact` as the sender and recipient. |
| `GMAIL_APP_PASSWORD` | Contact form | Gmail app password used by Nodemailer. Do not use or commit the normal account password. |
| `LISTINGS_API_URL` | Optional | Overrides the default listings API URL used by `/listings`. |

Never commit real secrets or production credentials.

## Related Repo

- **wv-realestate** — Internal CRM & property management app (port 3001)

## Agency Info

- **Agent**: Phil Malick
- **Agency**: MalickLand Real Estate
- **Phone**: (540) 246-1421
- **Email**: phil@malickland.net
- **Address**: 501 E Main St, Romney, WV 26757
- **License**: WV Licensed Real Estate Agent
