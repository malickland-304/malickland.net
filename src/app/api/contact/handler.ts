import {
  createLeadStore,
  type LeadDeliveryStatus,
  type LeadStore,
  type LeadStoreResult,
} from "./leadStore.ts";
import {
  buildContactSubject,
  type ContactSubmission,
  formatContactEmail,
  validateContactPayload,
} from "./validation.ts";

export type MailConfig = {
  apiKey: string;
  from: string;
  to: string;
  timeoutMs: number;
};

type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds?: number;
};

type RateLimiter = {
  check(req: Request): Promise<RateLimitResult>;
};

type ContactPostDeps = {
  getMailConfig?: () => MailConfig | null;
  rateLimiter?: RateLimiter;
  sendMail?: (config: MailConfig, data: ContactSubmission) => Promise<void>;
  leadStore?: LeadStore;
};

const DEFAULT_RATE_LIMIT_MAX_REQUESTS = 5;
const DEFAULT_RATE_LIMIT_WINDOW_SECONDS = 10 * 60;
const DEFAULT_RATE_LIMIT_REDIS_TIMEOUT_MS = 1500;
const MEMORY_RATE_LIMIT_SWEEP_INTERVAL_MS = 60 * 1000;
const memoryRateLimitStore = new Map<string, { count: number; expiresAt: number }>();

function sweepMemoryRateLimitStore() {
  const now = Date.now();
  for (const [key, entry] of memoryRateLimitStore) {
    if (entry.expiresAt <= now) {
      memoryRateLimitStore.delete(key);
    }
  }
}

const memoryRateLimitSweepInterval = setInterval(
  sweepMemoryRateLimitStore,
  MEMORY_RATE_LIMIT_SWEEP_INTERVAL_MS
);
const maybeUnrefInterval = memoryRateLimitSweepInterval as ReturnType<
  typeof setInterval
> & {
  unref?: () => void;
};
maybeUnrefInterval.unref?.();

// Resend transactional email. The API key is the only required secret; the
// from-address must be on a Resend-verified domain (malickland.net) and the
// recipient defaults to Phil's inbox. A missing key means mail is "not
// configured" and the handler fails closed (503) while the lead still lands in
// the backup store (lead-safety gate). This replaces the prior Gmail/SMTP
// app-password path, which was fragile — app passwords are account-bound and
// silently revocable, and had failed in production with 535 BadCredentials.
const DEFAULT_CONTACT_EMAIL_FROM = "MalickLand Contact Form <contact@malickland.net>";
const DEFAULT_CONTACT_EMAIL_TO = "phil@malickland.net";
const DEFAULT_MAIL_TIMEOUT_MS = 5000;

function getMailConfig(): MailConfig | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;

  const from = process.env.CONTACT_EMAIL_FROM?.trim() || DEFAULT_CONTACT_EMAIL_FROM;
  const to = process.env.CONTACT_EMAIL_TO?.trim() || DEFAULT_CONTACT_EMAIL_TO;
  const timeoutMs = numberFromEnv(
    "CONTACT_EMAIL_TIMEOUT_MS",
    DEFAULT_MAIL_TIMEOUT_MS
  );

  return { apiKey, from, to, timeoutMs };
}

function numberFromEnv(name: string, fallback: number) {
  const value = Number(process.env[name]);
  if (!Number.isFinite(value) || value <= 0) return fallback;
  return Math.floor(value);
}

function getClientId(req: Request) {
  if (process.env.CONTACT_RATE_LIMIT_TRUST_PROXY_HEADERS !== "true") {
    return "ip:untrusted-proxy";
  }

  const forwardedFor = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const cfIp = req.headers.get("cf-connecting-ip");
  const ip = cfIp || realIp || forwardedFor?.split(",")[0]?.trim();

  return ip ? `ip:${ip}` : "ip:unknown";
}

function rateLimitConfig() {
  return {
    limit: numberFromEnv(
      "CONTACT_RATE_LIMIT_MAX_REQUESTS",
      DEFAULT_RATE_LIMIT_MAX_REQUESTS
    ),
    windowSeconds: numberFromEnv(
      "CONTACT_RATE_LIMIT_WINDOW_SECONDS",
      DEFAULT_RATE_LIMIT_WINDOW_SECONDS
    ),
    redisTimeoutMs: numberFromEnv(
      "CONTACT_RATE_LIMIT_REDIS_TIMEOUT_MS",
      DEFAULT_RATE_LIMIT_REDIS_TIMEOUT_MS
    ),
    redisUrl: process.env.CONTACT_RATE_LIMIT_REDIS_REST_URL?.trim(),
    redisToken: process.env.CONTACT_RATE_LIMIT_REDIS_REST_TOKEN?.trim(),
  };
}

function createMemoryRateLimiter(): RateLimiter {
  return {
    async check(req: Request) {
      const { limit, windowSeconds } = rateLimitConfig();
      const now = Date.now();
      const key = getClientId(req);
      const existing = memoryRateLimitStore.get(key);
      const entry =
        existing && existing.expiresAt > now
          ? existing
          : { count: 0, expiresAt: now + windowSeconds * 1000 };

      entry.count += 1;
      memoryRateLimitStore.set(key, entry);

      const remaining = Math.max(limit - entry.count, 0);
      if (entry.count > limit) {
        return {
          allowed: false,
          limit,
          remaining,
          retryAfterSeconds: Math.max(
            1,
            Math.ceil((entry.expiresAt - now) / 1000)
          ),
        };
      }

      return { allowed: true, limit, remaining };
    },
  };
}

function createRedisRestRateLimiter(redisUrl: string, redisToken: string): RateLimiter {
  return {
    async check(req: Request) {
      const { limit, windowSeconds, redisTimeoutMs } = rateLimitConfig();
      const nowSeconds = Math.floor(Date.now() / 1000);
      const windowId = Math.floor(nowSeconds / windowSeconds);
      const key = `malickland:contact-rate:${getClientId(req)}:${windowId}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), redisTimeoutMs);
      let response: Response;

      try {
        response = await fetch(`${redisUrl.replace(/\/$/, "")}/pipeline`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${redisToken}`,
            "Content-Type": "application/json",
          },
          signal: controller.signal,
          body: JSON.stringify([
            ["INCR", key],
            ["EXPIRE", key, windowSeconds * 2],
          ]),
        });
      } finally {
        clearTimeout(timeout);
      }

      if (!response.ok) {
        throw new Error(`Redis REST rate limit check failed: ${response.status}`);
      }

      const result = (await response.json()) as Array<{ result?: unknown }>;
      const count = Number(result[0]?.result);
      if (!Number.isFinite(count)) {
        throw new Error("Redis REST rate limit check returned an invalid count.");
      }

      const remaining = Math.max(limit - count, 0);
      const retryAfterSeconds = windowSeconds - (nowSeconds % windowSeconds);

      if (count > limit) {
        return {
          allowed: false,
          limit,
          remaining,
          retryAfterSeconds,
        };
      }

      return { allowed: true, limit, remaining };
    },
  };
}

function createRateLimiter(): RateLimiter {
  const { redisUrl, redisToken } = rateLimitConfig();
  if ((redisUrl && !redisToken) || (!redisUrl && redisToken)) {
    return {
      async check() {
        throw new Error(
          "Contact rate limit Redis REST configuration is incomplete."
        );
      },
    };
  }

  if (redisUrl && redisToken) {
    return createRedisRestRateLimiter(redisUrl, redisToken);
  }

  return createMemoryRateLimiter();
}

// Backup persistence is best-effort and must never change user-facing response
// semantics (lead-safety gate). It exists so a mail failure or misconfiguration
// can never silently lose a lead: the submission lands in the backup store with
// its delivery status, and operators are alerted loudly via structured logs.
async function persistLeadBackup(
  leadStore: LeadStore,
  data: ContactSubmission,
  delivery: LeadDeliveryStatus
): Promise<LeadStoreResult> {
  let result: LeadStoreResult;
  try {
    result = await leadStore.persist(data, delivery);
  } catch (err) {
    result = {
      attempted: true,
      stored: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }

  if (!delivery.emailDelivered) {
    if (result.attempted && result.stored) {
      console.error("Contact lead email failed; lead PRESERVED in backup store.", {
        emailError: delivery.emailError,
      });
    } else {
      console.error(
        "Contact lead email failed and backup store did not capture it. " +
          "Lead details follow so it can be recovered from logs.",
        {
          emailError: delivery.emailError,
          backupAttempted: result.attempted,
          backupError: result.attempted ? result.error : "backup not configured",
          lead: data,
        }
      );
    }
  } else if (result.attempted && !result.stored) {
    console.error("Contact lead emailed OK but backup store insert failed.", {
      backupError: result.error,
    });
  }

  return result;
}

async function sendContactEmail(config: MailConfig, data: ContactSubmission) {
  const emailBody = formatContactEmail(data, new Date().toISOString());

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

  let response: Response;
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        from: config.from,
        to: [config.to],
        reply_to: data.email,
        subject: buildContactSubject(data),
        text: emailBody,
      }),
    });
  } finally {
    clearTimeout(timeout);
  }

  // Read the body regardless of status: on failure it carries Resend's error
  // detail (surfaced to logs + the backup store); on success it releases the
  // undici socket back to the connection pool.
  const responseText = await response.text().catch(() => "");

  if (!response.ok) {
    throw new Error(
      `Resend send failed with status ${response.status}: ${responseText.slice(0, 200)}`
    );
  }
}

export async function handleContactPost(req: Request, deps: ContactPostDeps = {}) {
  const rateLimiter = deps.rateLimiter || createRateLimiter();
  let rateLimit: RateLimitResult;

  try {
    rateLimit = await rateLimiter.check(req);
  } catch (err) {
    console.error("Contact form rate limit check failed:", {
      message: err instanceof Error ? err.message : "Unknown error",
    });
    return Response.json(
      {
        error:
          "The contact form is temporarily unavailable. Please call Phil directly.",
      },
      { status: 503 }
    );
  }

  if (!rateLimit.allowed) {
    return Response.json(
      {
        error:
          "Too many contact requests. Please wait before sending another message.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds || 60),
          "X-RateLimit-Limit": String(rateLimit.limit),
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        },
      }
    );
  }

  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return Response.json(
      { error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  const validation = validateContactPayload(body);
  if (!validation.ok) {
    return Response.json(
      {
        error: "Please correct the highlighted fields.",
        fields: validation.errors,
      },
      { status: 400 }
    );
  }

  const leadStore = deps.leadStore || createLeadStore();

  const mail = (deps.getMailConfig || getMailConfig)();
  if (!mail) {
    console.error("Contact form mail is not configured.");
    await persistLeadBackup(leadStore, validation.data, {
      emailDelivered: false,
      emailError: "mail_not_configured",
    });
    return Response.json(
      {
        error:
          "The contact form is temporarily unavailable. Please call Phil directly.",
      },
      { status: 503 }
    );
  }

  try {
    await (deps.sendMail || sendContactEmail)(mail, validation.data);

    await persistLeadBackup(leadStore, validation.data, {
      emailDelivered: true,
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("Contact form mail send failed:", {
      message: err instanceof Error ? err.message : "Unknown error",
    });
    await persistLeadBackup(leadStore, validation.data, {
      emailDelivered: false,
      emailError: err instanceof Error ? err.message : "Unknown error",
    });
    return Response.json(
      {
        error:
          "Failed to send message. Please try calling or emailing directly.",
      },
      { status: 500 }
    );
  }
}
