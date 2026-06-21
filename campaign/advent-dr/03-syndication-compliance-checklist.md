# 03 — Syndication & Compliance Checklist

This corrects the original draft's "list on every free syndication site"
assumption. **Do not assume Zillow / Realtor.com / Homes.com can all be manually
posted for free without confirming the actual listing lane.**

## Syndication reality check (decide the lane first)

1. **Is this listing MLS-backed?**
   - **Yes →** The MLS feed should drive the major portals
     (Zillow / Realtor.com / Homes.com / Trulia, etc.) automatically. Do **not**
     hand-post to those portals on top of the feed — it can create duplicates or
     violate MLS/portal rules. Your social campaign (FB/IG/LinkedIn/etc.) is the
     additive layer.
   - **No (FSBO-style / pocket / coming-soon) →** Each portal is a **separate
     manual compliance check**, not a guaranteed free lane. Confirm each
     portal's eligibility, terms, and required disclosures individually before
     posting.
2. **Confirm what's allowed by brokerage policy** (advertising rules, who may
   publish, required disclosure placement).
3. **Confirm listing status** is appropriate for public marketing.

## Compliance gate (must pass before any public post)

- [ ] **Fair Housing:** no language or audience targeting referencing protected
      classes (race, color, religion, sex, familial status, national origin,
      disability) or steering ("safe," "family neighborhood," "good schools,"
      "exclusive," etc.). Consider adding **Equal Housing Opportunity** to housing
      ads — confirm with the owner first (not currently in the repo's confirmed
      disclosure in `src/lib/compliance.ts`; the REALTOR® mark must not be used).
- [ ] **Brokerage disclosure** present on every graphic and post (legal entity,
      office, license info) per `00-FACTS.md`.
- [ ] **Truth-in-advertising:** every stated fact (price, acreage, utilities,
      zoning, status) is verified. No invented numbers, returns, or urgency.
- [ ] **Photos/video** are of the correct, current Advent Dr property and you
      have rights to use them. Not reused from the closed `37 Advent Dr`.
- [ ] **CTA links** resolve to a live, correct page (`[LISTING_URL]` / contact).
- [ ] **Platform targeting settings:** for any paid boost/ad on Meta, use the
      Special Ad Category = Housing (removes age/gender/ZIP targeting) to stay
      Fair-Housing compliant. (Applies only if you ever boost — organic Day 1
      does not.)
- [ ] **MLS/portal lane** decided above and not violated.

## Channels worth using (after the gate passes)

- Facebook Page + Instagram (Meta Business Suite) — primary, free.
- Google Business Profile — local visibility, free; post the listing update.
- LinkedIn — the investor-facing post.
- X — optional.
- Pinterest — optional, evergreen.
- Facebook Marketplace — **only** if brokerage/listing policy permits and
  disclosure fits; not guaranteed.

> When in doubt about a portal or a claim, leave it out until confirmed. A
> missing post is recoverable; a non-compliant published one is not.
