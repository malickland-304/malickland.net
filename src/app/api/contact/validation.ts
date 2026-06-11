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
};

type ContactField = keyof ContactSubmission;

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

const REQUIRED_FIELDS: ContactField[] = ["firstName", "email", "message"];
const CONTACT_FIELDS = Object.keys(CONTACT_FIELD_LIMITS) as ContactField[];
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
    },
  };
}

function notSpecified(value: string | undefined) {
  return value || "Not specified";
}

export function formatContactEmail(data: ContactSubmission) {
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ");

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

============================================
Submitted via malickland.net contact form
  `.trim();
}

export function buildContactSubject(data: ContactSubmission) {
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ");
  return `New Inquiry from ${fullName} - ${
    data.serviceInterest || data.inquiryType || "General"
  }`;
}
