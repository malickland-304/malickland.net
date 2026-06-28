export type LeadAttribution = {
  sourcePath?: string;
  serviceTag?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  referrer?: string;
  submittedAt?: string;
};

const ATTRIBUTION_STORAGE_KEY = "malickland_attribution";

function cleanAttribution(attribution: LeadAttribution): LeadAttribution {
  return Object.fromEntries(
    Object.entries(attribution).filter((entry) => entry[1] !== undefined)
  ) as LeadAttribution;
}

export function getCurrentAttribution(): LeadAttribution {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const pick = (key: string) => params.get(key)?.trim() || undefined;

  return cleanAttribution({
    sourcePath: `${window.location.pathname}${window.location.search}`,
    serviceTag: pick("service") || pick("offer"),
    utmSource: pick("utm_source"),
    utmMedium: pick("utm_medium"),
    utmCampaign: pick("utm_campaign"),
    utmTerm: pick("utm_term"),
    utmContent: pick("utm_content"),
    referrer: document.referrer || undefined,
  });
}

export function readStoredAttribution(): LeadAttribution | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as LeadAttribution;
  } catch (error) {
    console.warn("Unable to read stored attribution", error);
    return null;
  }
}

export function captureLandingAttribution(): LeadAttribution {
  return readStoredAttribution() ?? getCurrentAttribution();
}

export function storeInitialAttribution() {
  if (typeof window === "undefined") return;

  try {
    if (sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY)) return;

    const attribution = getCurrentAttribution();
    if (Object.keys(attribution).length === 0) return;

    sessionStorage.setItem(
      ATTRIBUTION_STORAGE_KEY,
      JSON.stringify(attribution)
    );
  } catch (error) {
    console.warn("Unable to store landing attribution", error);
  }
}
