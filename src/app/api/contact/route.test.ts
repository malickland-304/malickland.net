import assert from "node:assert/strict";
import test from "node:test";
import { handleContactPost } from "./handler.ts";
import type { ContactSubmission } from "./validation.ts";

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
    getGmailConfig: () => ({ user: "leads@example.com", pass: "app-password" }),
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
    getGmailConfig: () => ({ user: "leads@example.com", pass: "app-password" }),
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
    getGmailConfig: () => ({ user: "leads@example.com", pass: "app-password" }),
    async sendMail(_config: { user: string; pass: string }, data: ContactSubmission) {
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
      getGmailConfig: () => ({ user: "leads@example.com", pass: "app-password" }),
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
      getGmailConfig: () => ({ user: "leads@example.com", pass: "app-password" }),
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
