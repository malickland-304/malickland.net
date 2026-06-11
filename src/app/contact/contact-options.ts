export const serviceInterests = [
  "Deal Facilitation",
  "Buyer / Seller Representation",
  "Property Intelligence Report",
  "Seller Readiness Checkup",
  "Listings / Showings",
  "General Consultation",
];

const serviceParamLabels: Record<string, string> = {
  "deal-facilitation": "Deal Facilitation",
  "property-intelligence-report": "Property Intelligence Report",
  "seller-readiness-checkup": "Seller Readiness Checkup",
};

export function serviceInterestFromParam(value: string | undefined) {
  if (!value) return "";
  const label = serviceParamLabels[value] || value;
  return serviceInterests.includes(label) ? label : "";
}
