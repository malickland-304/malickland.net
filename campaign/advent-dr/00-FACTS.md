# 00 — Verified Facts Intake (fill in before anything publishes)

**Rule: only verified facts go in the copy.** Do not invent acreage, price,
utilities, financing, views, zoning, school quality, investment returns, or
urgency. If a field is unknown, leave the `[BRACKET]` in the copy and do not
publish that line. This file is the single source of truth the copy pulls from.

> Reminder: This is the **current** Advent Dr listing, **not** the closed
> `37 Advent Dr`. Verify you are using the correct address, parcel, photos,
> and status.

## Listing facts

| Field | Value | Verified? (Y/N + source) |
|-------|-------|--------------------------|
| Street address (number + "Advent Dr") | `[ADDRESS]` | |
| City / State / ZIP | Romney, WV `[ZIP]` | |
| County | `[COUNTY]` | |
| Parcel ID / tax map | `[PARCEL]` | |
| Property type (land / single-family / etc.) | `[PROPERTY_TYPE]` | |
| List price | `[PRICE]` | |
| Acreage / lot size | `[ACREAGE]` | |
| Beds / baths (if improved) | `[BEDS]` / `[BATHS]` | |
| Building sq ft (if improved) | `[SQFT]` | |
| Year built (if improved) | `[YEAR_BUILT]` | |
| Utilities (water/septic/electric/etc.) | `[UTILITIES — only if confirmed]` | |
| Zoning / permitted use | `[ZONING — only if confirmed]` | |
| MLS number | `[MLS_NUMBER]` | |
| Listing status (Active / Coming Soon / etc.) | `[STATUS]` | |
| Public listing URL / landing page | `[LISTING_URL]` | |
| Photos available? (count, who shot them) | `[PHOTOS]` | |
| Video / walkthrough available? | `[VIDEO]` | |

## Top factual features (max 3, verifiable only)

1. `[FEATURE_1]`
2. `[FEATURE_2]`
3. `[FEATURE_3]`

> Keep these factual and neutral (e.g., "X acres," "frontage on Advent Dr,"
> "[N] minutes to downtown Romney"). Avoid subjective/steering language.

## Contact & CTA

| Field | Value | Confirmed? |
|-------|-------|-----------|
| Showing / contact CTA method | `[CALL / TEXT / FORM]` | |
| Scheduling or contact URL | `https://malickland.net/contact` (confirm) | |
| Agent name | Phil Malick | Y |
| Agent phone | (540) 246-1421 | Y (compliance.ts) |
| Agent email | phil@malickland.net | Y (compliance.ts) |

## Brokerage / legal disclosure (REQUIRED on graphics + copy)

Source of truth: `src/lib/compliance.ts` (`LICENSED_OFFICE`), owner-confirmed
2026-06-20. Keep this section in sync with that file — do not diverge.

| Field | Value | Confirmed? |
|-------|-------|-----------|
| Licensed firm of record | MalickLand — WV Real Estate Agency | Y (compliance.ts, 2026-06-20) |
| Agent name | Phil Malick | Y |
| Agent title/byline | WV Licensed Real Estate Agent | Y |
| Office address | 501 East Main Street, Romney, WV 26757 | Y |
| Phone | (540) 246-1421 | Y |
| Email | phil@malickland.net | Y |
| REALTOR® mark | **Do NOT use** (no confirmed NAR membership) | Y (intentionally absent) |
| Brokerage/agent license # | `[LICENSE_NUMBER]` | N — owner/legal-confirmable |
| Exact § 174-1-17 statutory byline wording | working interpretation only | N — owner/legal-confirmable |
| "Equal Housing Opportunity" tag | recommended on housing ads | confirm with owner before adding |

**Disclosure line to place on every graphic and post** (the `[disclosure]`
token used throughout `01-copy.md` resolves to this):

> MalickLand — WV Real Estate Agency · 501 East Main Street, Romney, WV 26757 · (540) 246-1421

Once the license number is confirmed, append it. Add "Equal Housing Opportunity"
only after the owner confirms it for use. Never add the REALTOR® mark.

## Social handles (confirm before tagging/linking)

| Platform | Handle / URL | Confirmed? |
|----------|--------------|-----------|
| Facebook Page | `[@handle / URL]` | |
| Instagram | `[@handle]` | |
| LinkedIn | `[profile/company URL]` | |
| X (Twitter) | `[@handle]` | |
| Google Business Profile | `[profile URL]` | |
| Pinterest | `[@handle]` | |

## Publish gate (all must be checked)

- [ ] All copied facts above are marked Verified.
- [ ] Listing status confirms it is OK to market publicly (and not the closed `37 Advent Dr`).
- [ ] Brokerage/legal disclosure confirmed and present on graphics + copy.
- [ ] Social handle(s) confirmed.
- [ ] Scheduling/contact URL confirmed and live.
- [ ] If MLS-backed: portal syndication lane confirmed (see `03-...`).
