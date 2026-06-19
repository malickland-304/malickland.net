export type ContactAttribution = {
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

export type ContactSubmission = {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  serviceInterest?: string;
  inquiryType?: string;
  propertyType?: string;
  county?: string;
  budget?: string;
  timeline?: string;
  message: string;
  preferredContact?: string;
  attribution?: ContactAttribution;
};

type ContactField = Exclude<keyof ContactSubmission, "attribution">;
type AttributionField = keyof ContactAttribution;

export type ContactValidationError = {
  field: ContactField | "body";
  message: string;
};

export type ContactValidationResult =
  | { ok: true; data: ContactSubmission }
  | { ok: false; errors: ContactValidationError[] };

export const CONTACT_FIELD_LIMITS: Record<ContactField, number> = {
  firstName: 80,
  lastName: 80,
  email: 254,
  phone: 40,
  serviceInterest: 120,
  inquiryType: 80,
  propertyType: 80,
  county: 80,
  budget: 80,
  timeline: 80,
  message: 4000,
  preferredContact: 40,
};

// Attribution is captured for lead-source analytics, not user-entered. It is
// sanitized leniently and NEVER blocks a submission: a malformed or oversized
// attribution value is truncated or dropped so a real lead can never be lost
// to a tracking-field problem (lead-safety gate, COMPLIANCE_ROADMAP.md §1).
export const ATTRIBUTION_FIELD_LIMITS: Record<AttributionField, number> = {
  sourcePath: 512,
  serviceTag: 120,
  utmSource: 200,
  utmMedium: 200,
  utmCampaign: 200,
  utmTerm: 200,
  utmContent: 200,
  referrer: 1024,
  submittedAt: 40,
};

const REQUIRED_FIELDS: ContactField[] = ["firstName", "email", "message"];
const CONTACT_FIELDS = Object.keys(CONTACT_FIELD_LIMITS) as ContactField[];
const ATTRIBUTION_FIELDS = Object.keys(
  ATTRIBUTION_FIELD_LIMITS
) as AttributionField[];
const EMAIL_PATTERN = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/;
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/g;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeSingleLine(value: string) {
  return value.replace(CONTROL_CHARS, " ").trim().replace(/\s+/g, " ");
}

function normalizeMessage(value: string) {
  return value
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .trim();
}

function normalizeField(field: ContactField, value: string) {
  if (field === "message") return normalizeMessage(value);
  if (field === "email") return normalizeSingleLine(value).toLowerCase();
  return normalizeSingleLine(value);
}

function sanitizeAttribution(input: unknown): ContactAttribution | undefined {
  if (!isRecord(input)) return undefined;

  const attribution: ContactAttribution = {};

  for (const field of ATTRIBUTION_FIELDS) {
    const rawValue = input[field];
    if (typeof rawValue !== "string") continue;

    let value = normalizeSingleLine(rawValue);
    if (!value) continue;

    // submittedAt must be a parseable instant; drop it if it is not rather
    // than rejecting the lead.
    if (field === "submittedAt" && Number.isNaN(Date.parse(value))) continue;

    const limit = ATTRIBUTION_FIELD_LIMITS[field];
    if (value.length > limit) value = value.slice(0, limit);

    attribution[field] = value;
  }

  return Object.keys(attribution).length > 0 ? attribution : undefined;
}

export function validateContactPayload(input: unknown): ContactValidationResult {
  if (!isRecord(input)) {
    return {
      ok: false,
      errors: [{ field: "body", message: "Request body must be a JSON object." }],
    };
  }

  const errors: ContactValidationError[] = [];
  const data: Partial<ContactSubmission> = {};

  for (const field of CONTACT_FIELDS) {
    const rawValue = input[field];
    const isRequired = REQUIRED_FIELDS.includes(field);

    if (rawValue == null || rawValue === "") {
      if (isRequired) {
        errors.push({ field, message: "This field is required." });
      }
      continue;
    }

    if (typeof rawValue !== "string") {
      errors.push({ field, message: "This field must be text." });
      continue;
    }

    const value = normalizeField(field, rawValue);
    if (!value) {
      if (isRequired) {
        errors.push({ field, message: "This field is required." });
      }
      continue;
    }

    if (value.length > CONTACT_FIELD_LIMITS[field]) {
      errors.push({
        field,
        message: `This field must be ${CONTACT_FIELD_LIMITS[field]} characters or fewer.`,
      });
      continue;
    }

    data[field] = value;
  }

  if (data.email && !EMAIL_PATTERN.test(data.email)) {
    errors.push({ field: "email", message: "Enter a valid email address." });
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const attribution = sanitizeAttribution(input.attribution);

  return {
    ok: true,
    data: {
      firstName: data.firstName!,
      lastName: data.lastName,
      email: data.email!,
      phone: data.phone,
      serviceInterest: data.serviceInterest,
      inquiryType: data.inquiryType,
      propertyType: data.propertyType,
      county: data.county,
      budget: data.budget,
      timeline: data.timeline,
      message: data.message!,
      preferredContact: data.preferredContact,
      ...(attribution ? { attribution } : {}),
    },
  };
}

function notSpecified(value: string | undefined) {
  return value || "Not specified";
}

function formatAttribution(attribution: ContactAttribution | undefined) {
  const a = attribution ?? {};
  return `
Lead Source (attribution)
-----------------------------------------
Source Page:       ${notSpecified(a.sourcePath)}
Service Tag:       ${notSpecified(a.serviceTag)}
UTM Source:        ${notSpecified(a.utmSource)}
UTM Medium:        ${notSpecified(a.utmMedium)}
UTM Campaign:      ${notSpecified(a.utmCampaign)}
UTM Term:          ${notSpecified(a.utmTerm)}
UTM Content:       ${notSpecified(a.utmContent)}
Referrer:          ${notSpecified(a.referrer)}
Submitted At:      ${notSpecified(a.submittedAt)}`.trimEnd();
}

export function formatContactEmail(data: ContactSubmission, receivedAt?: string) {
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ");
  const receivedLine = receivedAt ? `\nReceived At:       ${receivedAt}` : "";

  return `
New Contact Form Submission - MalickLand.net
============================================

Name:              ${fullName}
Email:             ${data.email}
Phone:             ${data.phone || "Not provided"}
Preferred Contact: ${notSpecified(data.preferredContact)}

Service Interest:   ${notSpecified(data.serviceInterest)}
Inquiry Type:      ${notSpecified(data.inquiryType)}
Property Type:     ${notSpecified(data.propertyType)}
County:            ${notSpecified(data.county)}
Budget:            ${notSpecified(data.budget)}
Timeline:          ${notSpecified(data.timeline)}

Message:
${data.message}

${formatAttribution(data.attribution)}

============================================
Submitted via malickland.net contact form${receivedLine}
  `.trim();
}

export function buildContactSubject(data: ContactSubmission) {
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ");
  return `New Inquiry from ${fullName} - ${
    data.serviceInterest || data.inquiryType || "General"
  }`;
}
