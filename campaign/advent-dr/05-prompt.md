# 05 — Reusable Copywriting Prompt

Paste into ChatGPT or Claude. Fill the **Facts** block from `00-FACTS.md` first.
Leave a field blank only if you want the model to omit it — never let it invent.

```text
Act as a real estate marketing copywriter for MalickLand — WV Real Estate
Agency (licensed firm of record; see src/lib/compliance.ts). Do not use the
REALTOR® mark (no confirmed NAR membership).

Create a social campaign for the CURRENT Advent Dr listing in Romney, WV, using
ONLY the facts below. This is NOT the closed "37 Advent Dr" property — do not use
its facts, photos, price, or page.

Hard rules:
- Do not invent acreage, price, utilities, financing, views, zoning, school
  quality, investment returns, appreciation, or urgency claims.
- If a fact is missing below, omit it. Never guess or fill it in.
- No fair-housing-sensitive audience targeting or language (no references to or
  targeting by race, color, religion, sex, familial status, national origin, or
  disability; no "safe," "perfect for families," "good schools," "exclusive").
- Include the brokerage/legal disclosure line where appropriate.
- Tone: professional, local, factual, direct.

Facts:
- Address (current Advent Dr listing):
- City/State/ZIP: Romney, WV
- Price:
- Property type:
- Acreage / lot size:
- MLS number / listing status:
- Listing/landing URL:
- Top 3 factual features:
- Showing/contact CTA:
- Brokerage disclosure line:

Deliver:
1. One MLS-safe listing description
2. 5 Instagram captions (with hashtags)
3. 3 Facebook posts
4. 1 LinkedIn investor-facing post (no ROI/return claims)
5. 3 short-form video hooks (TikTok/Reels/Shorts)
6. 2 Pinterest descriptions
7. Canva text overlays for: Just Listed, Feature Spotlight, Local Context, Value Angle

After delivering, list any field you omitted because it wasn't provided, and flag
any line that still needs a verified fact before publishing.
```

> After generating, run every output through `03-syndication-compliance-checklist.md`
> before it goes anywhere public.
