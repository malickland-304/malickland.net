import assert from "node:assert/strict";
import test from "node:test";
import worker from "./worker.js";

class MemoryKV {
  constructor(seed = {}) {
    this.map = new Map(Object.entries(seed));
    this.puts = [];
  }

  async get(key) {
    return this.map.get(key) ?? null;
  }

  async put(key, value, options) {
    this.map.set(key, value);
    this.puts.push({ key, value, options });
  }
}

function makeEnv(seed) {
  return {
    API_TOKEN: "test-token",
    LISTINGS: new MemoryKV(seed),
  };
}

async function fetchWorker(path, init = {}, env = makeEnv()) {
  const request = new Request(`https://worker.test${path}`, init);
  return worker.fetch(request, env, {});
}

test("health responses use the requesting origin when allowed", async () => {
  const response = await fetchWorker("/api/health", {
    headers: { Origin: "https://malickland.net" },
  });

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Access-Control-Allow-Origin"), "https://malickland.net");
});

test("CORS falls back to the canonical origin for untrusted origins", async () => {
  const response = await fetchWorker("/api/health", {
    headers: { Origin: "https://example.invalid" },
  });

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Access-Control-Allow-Origin"), "https://malickland.net");
});

test("public /listings route redirects to the Next.js owner route", async () => {
  const response = await fetchWorker("/listings");

  assert.equal(response.status, 301);
  assert.equal(response.headers.get("Location"), "https://malickland.net/listings");
});

test("save endpoint rejects missing bearer auth", async () => {
  const response = await fetchWorker("/api/save", {
    method: "POST",
    body: JSON.stringify({ slug: "test", title: "Test", price: 1000 }),
    headers: { "Content-Type": "application/json" },
  });
  const body = await response.json();

  assert.equal(response.status, 401);
  assert.equal(body.success, false);
});

test("save endpoint enforces payload limits before parsing JSON", async () => {
  const response = await fetchWorker("/api/save", {
    method: "POST",
    body: "x".repeat(500_001),
    headers: {
      Authorization: "Bearer test-token",
      "Content-Type": "application/json",
    },
  });
  const body = await response.json();

  assert.equal(response.status, 413);
  assert.equal(body.error, "Payload too large");
});

test("lead endpoint validates required contact fields", async () => {
  const response = await fetchWorker("/api/lead", {
    method: "POST",
    body: JSON.stringify({ name: "Jane Buyer" }),
    headers: { "Content-Type": "application/json" },
  });
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.success, false);
});

test("listing page escapes structured data and inline script values", async () => {
  const dangerousTitle = "Bad </script><script>alert(1)</script>";
  const listing = {
    slug: "xss-check",
    title: dangerousTitle,
    price: 125000,
    status: "Active",
    city: "Romney",
    county: "Hampshire",
    description: "A safe description",
    images: ["https://cdn.example.com/photo.jpg"],
  };
  const env = makeEnv({
    "listing:xss-check": JSON.stringify(listing),
  });

  const response = await fetchWorker("/listing/xss-check", {}, env);
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.doesNotMatch(html, /<\/script><script>alert\(1\)<\/script>/);
  assert.match(html, /\\u003C\/script\\u003E\\u003Cscript\\u003Ealert\(1\)\\u003C\/script\\u003E/);
  assert.match(html, /Bad &lt;\/script&gt;&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
});
