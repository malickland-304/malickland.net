// Single source of truth for the licensed-office identification used in the
// site-wide compliance disclosure and the WV § 174-1-17 firm/broker lockup.
//
// Values are the established MalickLand information, owner-confirmed 2026-06-20.
// The REALTOR® mark is intentionally absent: it is not used anywhere on the
// site and must not be added without a confirmed NAR membership.
//
// Note: the exact statutory byline/broker-of-record phrasing required by WV
// § 174-1-17 remains owner/legal-confirmable (see LAUNCH_CHECKLIST.md §C). This
// module encodes the project's working interpretation, not legal advice.

export const LICENSED_OFFICE = {
  /** Licensed firm / brokerage of record. */
  firmName: "MalickLand",
  firmTagline: "WV Real Estate Agency",
  /** Agent featured in advertising + their licensed designation (byline). */
  agentName: "Phil Malick",
  agentTitle: "WV Licensed Real Estate Agent",
  /** Office of record. */
  addressLine: "501 East Main Street",
  cityStateZip: "Romney, WV 26757",
  phoneDisplay: "(540) 246-1421",
  phoneHref: "tel:15402461421",
  email: "phil@malickland.net",
} as const;

/** One-line licensed-office identification for compact disclosure contexts. */
export function licensedOfficeLine() {
  const o = LICENSED_OFFICE;
  return `${o.firmName} — ${o.firmTagline} · ${o.addressLine}, ${o.cityStateZip} · ${o.phoneDisplay}`;
}
