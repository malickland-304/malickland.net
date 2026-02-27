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

No env vars required for this static marketing site. Future API integrations (MLS, form submission) will use `.env.local`.

## Related Repo

- **wv-realestate** — Internal CRM & property management app (port 3001)

## Agency Info

- **Agent**: Phil Malick
- **Agency**: MalickLand Real Estate
- **Phone**: (540) 246-1421
- **Email**: phil@malickland.net
- **Address**: 501 E Main St, Romney, WV 26757
- **License**: WV Licensed Real Estate Agent
