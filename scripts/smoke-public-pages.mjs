#!/usr/bin/env node

import { spawn } from "node:child_process";
import { once } from "node:events";
import { existsSync } from "node:fs";
import net from "node:net";
import path from "node:path";

const root = process.cwd();
const buildIdPath = path.join(root, ".next", "BUILD_ID");
const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");

const pageChecks = [
  {
    path: "/",
    status: 200,
    includes: ["Your WV Real Estate", "Eastern Panhandle, West Virginia"],
  },
  {
    path: "/contact",
    status: 200,
    includes: ["Contact Phil Malick", "Send a Message"],
  },
  {
    path: "/listings",
    status: 200,
    includes: ["Request a property search", "will not display sample or placeholder properties"],
  },
  {
    path: "/services",
    status: 200,
    includes: ["Clear WV Property Offers", "Deal Facilitation"],
  },
  {
    path: "/services/deal-facilitation",
    status: 200,
    includes: ["WV Deal Facilitation", "Start a Deal Conversation"],
  },
  {
    path: "/services/property-intelligence-report",
    status: 200,
    includes: ["MEDjAi Property Intelligence Report", "informational market research only"],
  },
  {
    path: "/services/seller-readiness-checkup",
    status: 200,
    includes: ["MEDjAi Seller Readiness Checkup", "informational market research only"],
  },
  {
    path: "/api/contact",
    status: 405,
    includes: [],
  },
];

function fail(message, details = "") {
  console.error(`public page smoke failed: ${message}`);
  if (details) console.error(details.trim());
  process.exitCode = 1;
}

async function getOpenPort() {
  const server = net.createServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : undefined;
  server.close();
  await once(server, "close");

  if (!port) throw new Error("Could not allocate a localhost port");
  return port;
}

async function waitForServer(baseUrl, child) {
  const deadline = Date.now() + 20_000;
  let lastError = "";

  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`next start exited early with code ${child.exitCode}`);
    }

    try {
      const response = await fetch(baseUrl, { signal: AbortSignal.timeout(1000) });
      if (response.status < 500) return;
      lastError = `HTTP ${response.status}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }

    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  throw new Error(`Timed out waiting for ${baseUrl}: ${lastError}`);
}

async function checkRoute(baseUrl, check) {
  const url = new URL(check.path, baseUrl);
  const response = await fetch(url, { redirect: "manual" });
  const body = await response.text();

  if (response.status !== check.status) {
    throw new Error(`${check.path}: expected ${check.status}, got ${response.status}`);
  }

  for (const expectedText of check.includes) {
    if (!body.includes(expectedText)) {
      throw new Error(`${check.path}: missing expected text "${expectedText}"`);
    }
  }

  console.log(`ok ${check.path} ${response.status}`);
}

async function main() {
  if (!existsSync(buildIdPath)) {
    fail("missing .next/BUILD_ID; run `npm run build` before `npm run test:public-pages`");
    return;
  }

  if (!existsSync(nextBin)) {
    fail("missing Next.js CLI; run `npm ci` before smoke testing");
    return;
  }

  const port = await getOpenPort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const output = [];
  const child = spawn(process.execPath, [nextBin, "start", "--hostname", "127.0.0.1", "--port", String(port)], {
    cwd: root,
    env: {
      ...process.env,
      NEXT_TELEMETRY_DISABLED: "1",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  child.stdout.on("data", (chunk) => output.push(chunk.toString()));
  child.stderr.on("data", (chunk) => output.push(chunk.toString()));

  try {
    await waitForServer(baseUrl, child);
    for (const check of pageChecks) {
      await checkRoute(baseUrl, check);
    }
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error), output.join(""));
  } finally {
    if (child.exitCode === null) child.kill("SIGTERM");
  }
}

await main();
