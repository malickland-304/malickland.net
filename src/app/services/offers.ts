export type ServiceOffer = {
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
  audience: string;
  outcome: string;
  primaryCta: string;
  deliverables: string[];
  process: string[];
  proofPoints: string[];
  disclaimer?: string;
};

export const serviceOffers: ServiceOffer[] = [
  {
    slug: "deal-facilitation",
    title: "WV Deal Facilitation",
    shortTitle: "Deal Facilitation",
    summary:
      "A direct path for buyers, sellers, and property owners who need a real person to move a West Virginia property conversation toward a clean next step.",
    audience:
      "Best for buyers, sellers, investors, and off-market owners who already have a property, lead, or deal conversation in motion.",
    outcome:
      "You leave with the right next move: property details organized, buyer/seller intent clarified, and a practical plan for showing, pricing, offer, or representation.",
    primaryCta: "Start a Deal Conversation",
    deliverables: [
      "Buyer and seller needs intake",
      "Property facts and ownership-context review",
      "Showing, listing, or offer-path recommendation",
      "Plain-English next-step summary",
    ],
    process: [
      "Send the property, parties involved, and what you want to happen.",
      "Phil reviews the situation and identifies the cleanest path forward.",
      "You get a direct call or email with next steps and representation options.",
    ],
    proofPoints: [
      "Built for Eastern Panhandle and Potomac Highlands property conversations",
      "Works before a full listing or buyer search is ready",
      "Keeps brokerage representation separate from informational research work",
    ],
  },
  {
    slug: "property-intelligence-report",
    title: "MEDjAi Property Intelligence Report",
    shortTitle: "Property Intelligence Report",
    summary:
      "A concise research packet for a specific property, county, or investment target before you spend serious time, money, or negotiation energy.",
    audience:
      "Best for buyers, investors, heirs, and owners who want a grounded read on a property before making a decision.",
    outcome:
      "You get a practical report with local context, comparable signals, visible risks, and the questions to answer before moving forward.",
    primaryCta: "Request a Property Report",
    deliverables: [
      "Property and county context summary",
      "Comparable market signals where available",
      "Visible risk and due-diligence question list",
      "Buyer, seller, or investor next-step recommendations",
    ],
    process: [
      "Send the address, parcel, listing link, or county target.",
      "MEDjAi prepares a focused informational report for review.",
      "Phil can separately discuss brokerage representation if needed.",
    ],
    proofPoints: [
      "Useful before showings, offers, listing prep, or investor screening",
      "Designed for rural WV realities like access, acreage, utilities, and county context",
      "Keeps research output simple enough to act on",
    ],
    disclaimer:
      "MEDjAi reports are informational market research only. They are not appraisals, broker price opinions, legal advice, tax advice, lending decisions, or a substitute for licensed professional review.",
  },
  {
    slug: "seller-readiness-checkup",
    title: "MEDjAi Seller Readiness Checkup",
    shortTitle: "Seller Readiness Checkup",
    summary:
      "A fast pre-listing check for owners who want to understand what to fix, gather, photograph, and clarify before taking a WV property to market.",
    audience:
      "Best for homeowners, landowners, heirs, and investors considering a sale in the next few weeks or months.",
    outcome:
      "You get a punch list for better listing readiness: property facts, document gaps, likely buyer questions, and listing-prep priorities.",
    primaryCta: "Request a Seller Checkup",
    deliverables: [
      "Pre-listing readiness checklist",
      "Likely buyer-question and document-gap review",
      "Photo, access, utility, and disclosure prep notes",
      "Recommended next steps before listing or outreach",
    ],
    process: [
      "Send property basics, photos if available, and your ideal timeline.",
      "MEDjAi reviews the readiness factors and organizes the open questions.",
      "If you are ready to sell, Phil can separately discuss listing representation.",
    ],
    proofPoints: [
      "Turns a vague selling idea into a concrete prep list",
      "Helps avoid avoidable delays before buyer conversations",
      "Especially useful for land, rural homes, inherited property, and mixed-use assets",
    ],
    disclaimer:
      "MEDjAi checkups are informational market research only. They are not appraisals, broker price opinions, legal advice, tax advice, lending decisions, or a substitute for licensed professional review.",
  },
];

export function getServiceOffer(slug: string) {
  return serviceOffers.find((offer) => offer.slug === slug);
}
