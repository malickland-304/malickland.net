import type { ContactSubmission } from "./validation.ts";

// Durable backup for contact leads (lead-safety gate, LAUNCH_CHECKLIST.md §B:
// "No lead silently drops"). Email remains the primary delivery channel; this
// store captures every validated submission — including ones whose email send
// fails or is unconfigured — so a mail outage can never lose a lead.
//
// Implementation notes:
// - Supabase PostgREST over plain fetch: no new dependencies (AGENTS.md).
// - Activated only when both env vars are present; otherwise a no-op so the
//   form keeps working exactly as before.
// - Hard timeout so a slow store can never hang or block the form.
// - The key used is the Supabase *publishable* (anon) key — non-secret by
//   design; the table is insert-only under RLS (no read/update/delete).
//   See SECURITY.md and DECISIONS.md.

export type LeadStoreResult =
  | { attempted: false }
  | { attempted: true; stored: boolean; error?: string };

export type LeadDeliveryStatus = {
  emailDelivered: boolean;
  emailError?: string;
};

export type LeadStore = {
  persist(
    data: ContactSubmission,
    delivery: LeadDeliveryStatus
  ): Promise<LeadStoreResult>;
};

type LeadStoreConfig = {
  url: string;
  key: string;
  timeoutMs: number;
};

const DEFAULT_TIMEOUT_MS = 3000;

function getLeadStoreConfig(): LeadStoreConfig | null {
  const url = process.env.LEAD_BACKUP_SUPABASE_URL?.trim();
  const key = process.env.LEAD_BACKUP_SUPABASE_KEY?.trim();
  if (!url || !key) return null;

  const timeout = Number(process.env.LEAD_BACKUP_TIMEOUT_MS);
  const timeoutMs =
    Number.isFinite(timeout) && timeout > 0
      ? Math.floor(timeout)
      : DEFAULT_TIMEOUT_MS;

  return { url: url.replace(/\/$/, ""), key, timeoutMs };
}

function toLeadRow(data: ContactSubmission, delivery: LeadDeliveryStatus) {
  return {
    first_name: data.firstName,
    last_name: data.lastName ?? null,
    email: data.email,
    phone: data.phone ?? null,
    service_interest: data.serviceInterest ?? null,
    inquiry_type: data.inquiryType ?? null,
    property_type: data.propertyType ?? null,
    county: data.county ?? null,
    budget: data.budget ?? null,
    timeline: data.timeline ?? null,
    message: data.message,
    preferred_contact: data.preferredContact ?? null,
    attribution: data.attribution ?? null,
    email_delivered: delivery.emailDelivered,
    email_error: delivery.emailError ?? null,
  };
}

export function createLeadStore(): LeadStore {
  return {
    async persist(data, delivery) {
      const config = getLeadStoreConfig();
      if (!config) return { attempted: false };

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

      try {
        const response = await fetch(`${config.url}/rest/v1/contact_leads`, {
          method: "POST",
          headers: {
            apikey: config.key,
            Authorization: `Bearer ${config.key}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          signal: controller.signal,
          body: JSON.stringify(toLeadRow(data, delivery)),
        });

        // Consume the body even with Prefer: return=minimal — an unread body
        // keeps the undici socket out of the connection pool.
        await response.text().catch(() => {});

        if (!response.ok) {
          return {
            attempted: true,
            stored: false,
            error: `Lead backup insert failed with status ${response.status}.`,
          };
        }

        return { attempted: true, stored: true };
      } catch (err) {
        return {
          attempted: true,
          stored: false,
          error: err instanceof Error ? err.message : "Unknown error",
        };
      } finally {
        clearTimeout(timeout);
      }
    },
  };
}
