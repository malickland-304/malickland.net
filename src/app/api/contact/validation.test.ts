import assert from "node:assert/strict";
import test from "node:test";
import {
  buildContactSubject,
  CONTACT_FIELD_LIMITS,
  formatContactEmail,
  validateContactPayload,
} from "./validation.ts";

const validPayload = {
  firstName: " Phil ",
  lastName: " Malick ",
  email: " PHIL@EXAMPLE.COM ",
  phone: " (540) 246-1421 ",
  serviceInterest: " Deal Facilitation ",
  inquiryType: " Buying a Property ",
  propertyType: " Land / Acreage ",
  county: " Hampshire County ",
  budget: " $200,000 - $350,000 ",
  timeline: " 30-60 days ",
  message: " Looking for land near Romney. ",
  preferredContact: "email",
};

test("validateContactPayload trims valid submissions", () => {
  const result = validateContactPayload(validPayload);

  assert.equal(result.ok, true);
  if (!result.ok) return;

  assert.equal(result.data.firstName, "Phil");
  assert.equal(result.data.lastName, "Malick");
  assert.equal(result.data.email, "phil@example.com");
  assert.equal(result.data.serviceInterest, "Deal Facilitation");
  assert.equal(result.data.timeline, "30-60 days");
  assert.equal(result.data.message, "Looking for land near Romney.");
});

test("validateContactPayload rejects non-object bodies", () => {
  const result = validateContactPayload(null);

  assert.equal(result.ok, false);
  if (result.ok) return;

  assert.deepEqual(result.errors, [
    { field: "body", message: "Request body must be a JSON object." },
  ]);
});

test("validateContactPayload requires first name, email, and message", () => {
  const result = validateContactPayload({});

  assert.equal(result.ok, false);
  if (result.ok) return;

  assert.deepEqual(
    result.errors.map((error) => error.field),
    ["firstName", "email", "message"]
  );
});

test("validateContactPayload rejects invalid field types", () => {
  const result = validateContactPayload({
    ...validPayload,
    phone: ["not", "text"],
  });

  assert.equal(result.ok, false);
  if (result.ok) return;

  assert.deepEqual(result.errors, [
    { field: "phone", message: "This field must be text." },
  ]);
});

test("validateContactPayload validates email shape", () => {
  const result = validateContactPayload({
    ...validPayload,
    email: "not-an-email",
  });

  assert.equal(result.ok, false);
  if (result.ok) return;

  assert.deepEqual(result.errors, [
    { field: "email", message: "Enter a valid email address." },
  ]);
});

test("validateContactPayload enforces field length limits", () => {
  const result = validateContactPayload({
    ...validPayload,
    message: "x".repeat(CONTACT_FIELD_LIMITS.message + 1),
  });

  assert.equal(result.ok, false);
  if (result.ok) return;

  assert.deepEqual(result.errors, [
    {
      field: "message",
      message: `This field must be ${CONTACT_FIELD_LIMITS.message} characters or fewer.`,
    },
  ]);
});

test("format helpers use sanitized submission data", () => {
  const result = validateContactPayload(validPayload);

  assert.equal(result.ok, true);
  if (!result.ok) return;

  assert.equal(
    buildContactSubject(result.data),
    "New Inquiry from Phil Malick - Deal Facilitation"
  );
  assert.match(formatContactEmail(result.data), /Email:\s+phil@example\.com/);
  assert.match(formatContactEmail(result.data), /Service Interest:\s+Deal Facilitation/);
  assert.match(formatContactEmail(result.data), /Timeline:\s+30-60 days/);
});
