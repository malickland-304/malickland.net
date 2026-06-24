import nodemailer from "nodemailer";
import {
  buildContactSubject,
  type ContactSubmission,
  formatContactEmail,
  validateContactPayload,
} from "./validation.ts";

type GmailConfig = {
  user: string;
  pass: string;
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
  getGmailConfig?: () => GmailConfig | null;
  rateLimiter?: RateLimiter;
  sendMail?: (config: GmailConfig, data: ContactSubmission) => Promise<void>;
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

function getGmailConfig() {
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");

  if (!user || !pass) return null;
  return { user, pass };
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

async function sendContactEmail(config: GmailConfig, data: ContactSubmission) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  const emailBody = formatContactEmail(data, new Date().toISOString());

  await transporter.sendMail({
    from: `"MalickLand Contact Form" <${config.user}>`,
    to: config.user,
    replyTo: data.email,
    subject: buildContactSubject(data),
    text: emailBody,
  });
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

  const gmail = (deps.getGmailConfig || getGmailConfig)();
  if (!gmail) {
    console.error("Contact form mail is not configured.");
    return Response.json(
      {
        error:
          "The contact form is temporarily unavailable. Please call Phil directly.",
      },
      { status: 503 }
    );
  }

  try {
    await (deps.sendMail || sendContactEmail)(gmail, validation.data);

    return Response.json({ success: true });
  } catch (err) {
    console.error("Contact form mail send failed:", {
      message: err instanceof Error ? err.message : "Unknown error",
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
