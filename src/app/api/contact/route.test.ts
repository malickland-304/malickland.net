import assert from "node:assert/strict";
import test from "node:test";
import { handleContactPost, type MailConfig } from "./handler.ts";
import type { ContactSubmission } from "./validation.ts";

const testMailConfig: MailConfig = {
  apiKey: "test-key",
  from: "MalickLand Contact Form <contact@malickland.net>",
  to: "leads@example.com",
  timeoutMs: 5000,
};

const validPayload = {
  firstName: "Phil",
  lastName: "Malick",
  email: "phil@example.com",
  message: "Looking for land near Romney.",
  serviceInterest: "Deal Facilitation",
};

function contactRequest(payload: unknown, headers: Record<string, string> = {}) {
  return new Request("https://malickland.net/api/contact", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": "203.0.113.10",
      ...headers,
    },
    body: JSON.stringify(payload),
  });
}

test("handleContactPost sends allowed valid submissions", async () => {
  const sent: ContactSubmission[] = [];

  const response = await handleContactPost(contactRequest(validPayload), {
    getMailConfig: () => testMailConfig,
    rateLimiter: {
      async check() {
        return { allowed: true, limit: 5, remaining: 4 };
      },
    },
    async sendMail(_config, data) {
      sent.push(data);
    },
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true });
  assert.equal(sent.length, 1);
  assert.equal(sent[0].email, "phil@example.com");
});

test("handleContactPost rate-limits before mail send", async () => {
  let sendCount = 0;

  const response = await handleContactPost(contactRequest(validPayload), {
    getMailConfig: () => testMailConfig,
    rateLimiter: {
      async check() {
        return {
          allowed: false,
          limit: 5,
          remaining: 0,
          retryAfterSeconds: 120,
        };
      },
    },
    async sendMail() {
      sendCount += 1;
    },
  });

  assert.equal(response.status, 429);
  assert.equal(response.headers.get("retry-after"), "120");
  assert.equal(response.headers.get("x-ratelimit-limit"), "5");
  assert.equal(response.headers.get("x-ratelimit-remaining"), "0");
  assert.deepEqual(await response.json(), {
    error: "Too many contact requests. Please wait before sending another message.",
  });
  assert.equal(sendCount, 0);
});

test("handleContactPost uses trusted proxy IP before spoofable forwarded-for", async () => {
  const previousLimit = process.env.CONTACT_RATE_LIMIT_MAX_REQUESTS;
  const previousWindow = process.env.CONTACT_RATE_LIMIT_WINDOW_SECONDS;
  const previousRedisUrl = process.env.CONTACT_RATE_LIMIT_REDIS_REST_URL;
  const previousRedisToken = process.env.CONTACT_RATE_LIMIT_REDIS_REST_TOKEN;
  const previousTrustProxy = process.env.CONTACT_RATE_LIMIT_TRUST_PROXY_HEADERS;
  const sent: ContactSubmission[] = [];
  const cfIp = `198.51.100.${Math.floor(Math.random() * 100) + 1}`;
  const deps = {
    getMailConfig: () => testMailConfig,
    async sendMail(_config: MailConfig, data: ContactSubmission) {
      sent.push(data);
    },
  };

  process.env.CONTACT_RATE_LIMIT_MAX_REQUESTS = "1";
  process.env.CONTACT_RATE_LIMIT_WINDOW_SECONDS = "60";
  process.env.CONTACT_RATE_LIMIT_TRUST_PROXY_HEADERS = "true";
  delete process.env.CONTACT_RATE_LIMIT_REDIS_REST_URL;
  delete process.env.CONTACT_RATE_LIMIT_REDIS_REST_TOKEN;

  try {
    const first = await handleContactPost(
      contactRequest(validPayload, {
        "cf-connecting-ip": cfIp,
        "x-forwarded-for": "203.0.113.20",
      }),
      deps
    );
    const second = await handleContactPost(
      contactRequest(validPayload, {
        "cf-connecting-ip": cfIp,
        "x-forwarded-for": "203.0.113.21",
      }),
      deps
    );

    assert.equal(first.status, 200);
    assert.equal(second.status, 429);
    assert.equal(sent.length, 1);
  } finally {
    if (previousLimit == null) {
      delete process.env.CONTACT_RATE_LIMIT_MAX_REQUESTS;
    } else {
      process.env.CONTACT_RATE_LIMIT_MAX_REQUESTS = previousLimit;
    }
    if (previousWindow == null) {
      delete process.env.CONTACT_RATE_LIMIT_WINDOW_SECONDS;
    } else {
      process.env.CONTACT_RATE_LIMIT_WINDOW_SECONDS = previousWindow;
    }
    if (previousRedisUrl == null) {
      delete process.env.CONTACT_RATE_LIMIT_REDIS_REST_URL;
    } else {
      process.env.CONTACT_RATE_LIMIT_REDIS_REST_URL = previousRedisUrl;
    }
    if (previousRedisToken == null) {
      delete process.env.CONTACT_RATE_LIMIT_REDIS_REST_TOKEN;
    } else {
      process.env.CONTACT_RATE_LIMIT_REDIS_REST_TOKEN = previousRedisToken;
    }
    if (previousTrustProxy == null) {
      delete process.env.CONTACT_RATE_LIMIT_TRUST_PROXY_HEADERS;
    } else {
      process.env.CONTACT_RATE_LIMIT_TRUST_PROXY_HEADERS = previousTrustProxy;
    }
  }
});

test("handleContactPost fails closed when rate-limit checks fail", async () => {
  let sendCount = 0;
  const originalConsoleError = console.error;
  console.error = () => {};

  try {
    const response = await handleContactPost(contactRequest(validPayload), {
      getMailConfig: () => testMailConfig,
      rateLimiter: {
        async check() {
          throw new Error("rate-limit backend unavailable");
        },
      },
      async sendMail() {
        sendCount += 1;
      },
    });

    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), {
      error:
        "The contact form is temporarily unavailable. Please call Phil directly.",
    });
    assert.equal(sendCount, 0);
  } finally {
    console.error = originalConsoleError;
  }
});

test("handleContactPost fails closed when Redis rate-limit request times out", async () => {
  const previousRedisUrl = process.env.CONTACT_RATE_LIMIT_REDIS_REST_URL;
  const previousRedisToken = process.env.CONTACT_RATE_LIMIT_REDIS_REST_TOKEN;
  const previousRedisTimeout = process.env.CONTACT_RATE_LIMIT_REDIS_TIMEOUT_MS;
  const originalFetch = globalThis.fetch;
  const originalConsoleError = console.error;
  let sendCount = 0;

  process.env.CONTACT_RATE_LIMIT_REDIS_REST_URL = "https://redis.example.test";
  process.env.CONTACT_RATE_LIMIT_REDIS_REST_TOKEN = "secret-token";
  process.env.CONTACT_RATE_LIMIT_REDIS_TIMEOUT_MS = "1";
  console.error = () => {};
  globalThis.fetch = ((_input: RequestInfo | URL, init?: RequestInit) =>
    new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => {
        reject(new DOMException("Aborted", "AbortError"));
      });
    })) as typeof fetch;

  try {
    const response = await handleContactPost(contactRequest(validPayload), {
      getMailConfig: () => testMailConfig,
      async sendMail() {
        sendCount += 1;
      },
    });

    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), {
      error:
        "The contact form is temporarily unavailable. Please call Phil directly.",
    });
    assert.equal(sendCount, 0);
  } finally {
    globalThis.fetch = originalFetch;
    console.error = originalConsoleError;
    if (previousRedisUrl == null) {
      delete process.env.CONTACT_RATE_LIMIT_REDIS_REST_URL;
    } else {
      process.env.CONTACT_RATE_LIMIT_REDIS_REST_URL = previousRedisUrl;
    }
    if (previousRedisToken == null) {
      delete process.env.CONTACT_RATE_LIMIT_REDIS_REST_TOKEN;
    } else {
      process.env.CONTACT_RATE_LIMIT_REDIS_REST_TOKEN = previousRedisToken;
    }
    if (previousRedisTimeout == null) {
      delete process.env.CONTACT_RATE_LIMIT_REDIS_TIMEOUT_MS;
    } else {
      process.env.CONTACT_RATE_LIMIT_REDIS_TIMEOUT_MS = previousRedisTimeout;
    }
  }
});

// ── Lead backup store (lead-safety gate: no lead silently drops) ──────────────

function stubLeadStore() {
  const calls: Array<{
    data: ContactSubmission;
    delivery: { emailDelivered: boolean; emailError?: string };
  }> = [];
  return {
    calls,
    store: {
      async persist(
        data: ContactSubmission,
        delivery: { emailDelivered: boolean; emailError?: string }
      ) {
        calls.push({ data, delivery });
        return { attempted: true as const, stored: true };
      },
    },
  };
}

const allowAllRateLimiter = {
  async check() {
    return { allowed: true, limit: 5, remaining: 4 };
  },
};

test("lead backup records delivered leads without changing the success response", async () => {
  const backup = stubLeadStore();

  const response = await handleContactPost(contactRequest(validPayload), {
    getMailConfig: () => testMailConfig,
    rateLimiter: allowAllRateLimiter,
    async sendMail() {},
    leadStore: backup.store,
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true });
  assert.equal(backup.calls.length, 1);
  assert.equal(backup.calls[0].delivery.emailDelivered, true);
  assert.equal(backup.calls[0].data.email, "phil@example.com");
});

test("lead backup captures the lead when mail send fails; error response unchanged", async () => {
  const backup = stubLeadStore();
  const originalConsoleError = console.error;
  console.error = () => {};

  try {
    const response = await handleContactPost(contactRequest(validPayload), {
      getMailConfig: () => testMailConfig,
      rateLimiter: allowAllRateLimiter,
      async sendMail() {
        throw new Error("SMTP unavailable");
      },
      leadStore: backup.store,
    });

    assert.equal(response.status, 500);
    assert.deepEqual(await response.json(), {
      error: "Failed to send message. Please try calling or emailing directly.",
    });
    assert.equal(backup.calls.length, 1);
    assert.equal(backup.calls[0].delivery.emailDelivered, false);
    assert.equal(backup.calls[0].delivery.emailError, "SMTP unavailable");
  } finally {
    console.error = originalConsoleError;
  }
});

test("lead backup captures the lead when mail is not configured; 503 unchanged", async () => {
  const backup = stubLeadStore();
  const originalConsoleError = console.error;
  console.error = () => {};

  try {
    const response = await handleContactPost(contactRequest(validPayload), {
      getMailConfig: () => null,
      rateLimiter: allowAllRateLimiter,
      leadStore: backup.store,
    });

    assert.equal(response.status, 503);
    assert.equal(backup.calls.length, 1);
    assert.equal(backup.calls[0].delivery.emailDelivered, false);
    assert.equal(backup.calls[0].delivery.emailError, "mail_not_configured");
  } finally {
    console.error = originalConsoleError;
  }
});

test("a throwing lead store never breaks the user response", async () => {
  const originalConsoleError = console.error;
  console.error = () => {};

  try {
    const response = await handleContactPost(contactRequest(validPayload), {
      getMailConfig: () => testMailConfig,
      rateLimiter: allowAllRateLimiter,
      async sendMail() {},
      leadStore: {
        async persist() {
          throw new Error("store exploded");
        },
      },
    });

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { success: true });
  } finally {
    console.error = originalConsoleError;
  }
});

// ── Resend transport (real getMailConfig + sendContactEmail over fetch) ───────

function withResendEnv(apiKey: string | null) {
  const previous = {
    key: process.env.RESEND_API_KEY,
    from: process.env.CONTACT_EMAIL_FROM,
    to: process.env.CONTACT_EMAIL_TO,
  };
  delete process.env.CONTACT_EMAIL_FROM;
  delete process.env.CONTACT_EMAIL_TO;
  if (apiKey == null) delete process.env.RESEND_API_KEY;
  else process.env.RESEND_API_KEY = apiKey;

  return function restore() {
    for (const [name, value] of [
      ["RESEND_API_KEY", previous.key],
      ["CONTACT_EMAIL_FROM", previous.from],
      ["CONTACT_EMAIL_TO", previous.to],
    ] as const) {
      if (value == null) delete process.env[name];
      else process.env[name] = value;
    }
  };
}

test("delivers via Resend when RESEND_API_KEY is configured", async () => {
  const restoreEnv = withResendEnv("re_test_key");
  const originalFetch = globalThis.fetch;
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: String(input), init });
    return new Response(JSON.stringify({ id: "email_123" }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;

  const backup = stubLeadStore();
  try {
    const response = await handleContactPost(contactRequest(validPayload), {
      rateLimiter: allowAllRateLimiter,
      leadStore: backup.store,
    });

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { success: true });
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, "https://api.resend.com/emails");
    const headers = calls[0].init?.headers as Record<string, string>;
    assert.equal(headers.Authorization, "Bearer re_test_key");
    const payload = JSON.parse(String(calls[0].init?.body));
    assert.equal(payload.reply_to, "phil@example.com");
    assert.deepEqual(payload.to, ["phil@malickland.net"]);
    assert.equal(backup.calls[0].delivery.emailDelivered, true);
  } finally {
    globalThis.fetch = originalFetch;
    restoreEnv();
  }
});

test("Resend failure yields 500 and preserves the lead in backup", async () => {
  const restoreEnv = withResendEnv("re_test_key");
  const originalFetch = globalThis.fetch;
  const originalConsoleError = console.error;
  console.error = () => {};
  globalThis.fetch = (async () =>
    new Response(JSON.stringify({ message: "domain not verified" }), {
      status: 403,
      headers: { "content-type": "application/json" },
    })) as typeof fetch;

  const backup = stubLeadStore();
  try {
    const response = await handleContactPost(contactRequest(validPayload), {
      rateLimiter: allowAllRateLimiter,
      leadStore: backup.store,
    });

    assert.equal(response.status, 500);
    assert.deepEqual(await response.json(), {
      error: "Failed to send message. Please try calling or emailing directly.",
    });
    assert.equal(backup.calls.length, 1);
    assert.equal(backup.calls[0].delivery.emailDelivered, false);
    assert.match(
      String(backup.calls[0].delivery.emailError),
      /Resend send failed with status 403/
    );
  } finally {
    globalThis.fetch = originalFetch;
    console.error = originalConsoleError;
    restoreEnv();
  }
});

test("missing RESEND_API_KEY is treated as mail-not-configured (503)", async () => {
  const restoreEnv = withResendEnv(null);
  const originalConsoleError = console.error;
  console.error = () => {};

  const backup = stubLeadStore();
  try {
    const response = await handleContactPost(contactRequest(validPayload), {
      rateLimiter: allowAllRateLimiter,
      leadStore: backup.store,
    });

    assert.equal(response.status, 503);
    assert.equal(backup.calls.length, 1);
    assert.equal(backup.calls[0].delivery.emailDelivered, false);
    assert.equal(backup.calls[0].delivery.emailError, "mail_not_configured");
  } finally {
    console.error = originalConsoleError;
    restoreEnv();
  }
});
