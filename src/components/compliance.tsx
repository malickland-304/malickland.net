import { LICENSED_OFFICE } from "@/lib/compliance";

/**
 * WV § 174-1-17 firm/broker lockup + agent byline.
 *
 * The firm name is rendered at least half the size of the featured agent name
 * ("half-size" rule, project interpretation). Use this wherever the agent is
 * featured prominently so the brokerage of record travels with the name.
 */
export function FirmBrokerLockup({ className = "" }: { className?: string }) {
  const o = LICENSED_OFFICE;
  return (
    <div className={className}>
      <p className="font-semibold leading-tight">
        {o.agentName}
        <span className="font-normal">, {o.agentTitle}</span>
      </p>
      {/* Firm name >= half the agent name size satisfies the half-size rule. */}
      <p className="text-[0.95em] font-semibold leading-tight">
        {o.firmName} <span className="font-normal">— {o.firmTagline}</span>
      </p>
      <p className="text-[0.85em] opacity-80 leading-snug">
        {o.addressLine}, {o.cityStateZip} · {o.phoneDisplay}
      </p>
    </div>
  );
}

/**
 * Site-wide licensed-office disclosure for the global footer. Renders on every
 * page (via the layout), which also keeps the disclosure within two clicks of
 * any social entry point that lives in the footer.
 */
export function LicensedOfficeDisclosure() {
  const o = LICENSED_OFFICE;
  const year = new Date().getFullYear();
  return (
    <div className="space-y-1">
      <p>
        <span className="font-semibold text-slate-300">{o.firmName}</span>
        {" — "}
        {o.firmTagline}. {o.agentName}, {o.agentTitle}.
      </p>
      <p>
        Licensed office: {o.addressLine}, {o.cityStateZip} · {o.phoneDisplay}
      </p>
      <p>
        &copy; {year} {o.firmName}. All rights reserved. Equal Housing
        Opportunity. Information deemed reliable but not guaranteed.
      </p>
    </div>
  );
}
