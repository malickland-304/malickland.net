import assert from "node:assert/strict";
import test from "node:test";
import { createLeadStore } from "./leadStore.ts";
import type { ContactSubmission } from "./validation.ts";

const lead: ContactSubmission = {
  firstName: "Phil",
  lastName: "Malick",
  email: "phil@example.com",
  phone: "555-0100",
  serviceInterest: "Deal Facilitation",
  message: "Looking for land near Romney.",
  attribution: { sourcePath: "/services", utmSource: "facebook" },
};

function withEnv(
  vars: Record<string, string | undefined>,
  fn: () => Promise<void>
) {
  const previous = new Map<string, string | undefined>();
  for (const [key, value] of Object.entries(vars)) {
    previous.set(key, process.env[key]);
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
  return fn().finally(() => {
    for (const [key, value] of previous) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  });
}

test("lead store is a no-op when env vars are absent", async () => {
  await withEnv(
    { LEAD_BACKUP_SUPABASE_URL: undefined, LEAD_BACKUP_SUPABASE_KEY: undefined },
    async () => {
      const result = await createLeadStore().persist(lead, {
        emailDelivered: true,
      });
      assert.deepEqual(result, { attempted: false });
    }
  );
});

test("lead store posts a normalized row with delivery status", async () => {
  const originalFetch = globalThis.fetch;
  const requests: Array<{ url: string; init: RequestInit }> = [];
  globalThis.fetch = (async (url: RequestInfo | URL, init?: RequestInit) => {
    requests.push({ url: String(url), init: init ?? {} });
    return new Response(null, { status: 201 });
  }) as typeof fetch;

  try {
    await withEnv(
      {
        LEAD_BACKUP_SUPABASE_URL: "https://example.supabase.co/",
        LEAD_BACKUP_SUPABASE_KEY: "publishable-key",
      },
      async () => {
        const result = await createLeadStore().persist(lead, {
          emailDelivered: false,
          emailError: "SMTP unavailable",
        });

        assert.deepEqual(result, { attempted: true, stored: true });
        assert.equal(requests.length, 1);
        assert.equal(
          requests[0].url,
          "https://example.supabase.co/rest/v1/contact_leads"
        );

        const headers = requests[0].init.headers as Record<string, string>;
        assert.equal(headers.apikey, "publishable-key");
        assert.equal(headers.Prefer, "return=minimal");

        const row = JSON.parse(String(requests[0].init.body));
        assert.equal(row.first_name, "Phil");
        assert.equal(row.email, "phil@example.com");
        assert.equal(row.email_delivered, false);
        assert.equal(row.email_error, "SMTP unavailable");
        assert.deepEqual(row.attribution, {
          sourcePath: "/services",
          utmSource: "facebook",
        });
      }
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("lead store reports failure on non-2xx without throwing", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () =>
    new Response("nope", { status: 401 })) as typeof fetch;

  try {
    await withEnv(
      {
        LEAD_BACKUP_SUPABASE_URL: "https://example.supabase.co",
        LEAD_BACKUP_SUPABASE_KEY: "publishable-key",
      },
      async () => {
        const result = await createLeadStore().persist(lead, {
          emailDelivered: true,
        });
        assert.equal(result.attempted, true);
        assert.equal(result.attempted && result.stored, false);
      }
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("lead store times out instead of hanging the form", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = ((_url: RequestInfo | URL, init?: RequestInit) =>
    new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => {
        reject(new DOMException("Aborted", "AbortError"));
      });
    })) as typeof fetch;

  try {
    await withEnv(
      {
        LEAD_BACKUP_SUPABASE_URL: "https://example.supabase.co",
        LEAD_BACKUP_SUPABASE_KEY: "publishable-key",
        LEAD_BACKUP_TIMEOUT_MS: "50",
      },
      async () => {
        const started = Date.now();
        const result = await createLeadStore().persist(lead, {
          emailDelivered: true,
        });
        assert.equal(result.attempted, true);
        assert.equal(result.attempted && result.stored, false);
        assert.ok(Date.now() - started < 2000, "timed out promptly");
      }
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});
