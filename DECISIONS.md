# Malickland 2.0 Decisions

## 2026-05-27 - Human Owner And Repository-Governed Multi-Agent Authority

Problem: Multiple agents need deterministic coordination without relying on conversational memory, while unresolved project authority conflicts still need a non-AI final escalation path.

Decision: Use this precedence order: explicit human project-owner instruction for the current task; security, privacy, legal, and production-safety constraints; `AGENTS.md`; `ARCHITECTURE.md`; `SECURITY.md`; `DECISIONS.md`; `TASKS.md`; `PROJECT_STATE.md`; `QA_CHECKLIST.md`; `WORK_LOG.md`; temporary handoff documents and conversational notes.

Reasoning: Persistent repo governance reduces prompt drift and makes coordination reproducible. Human owner instruction remains the final escalation path for unresolved authority conflicts, while AI agents are prohibited from appointing themselves as final arbiters.

Alternatives considered: conversation-only coordination, repository-only authority with no human escalation path, and tool-specific instructions. Each is weaker for multi-agent continuity or unresolved project governance conflicts.

Security/performance impact: Safer conflict handling and clearer stop conditions reduce accidental insecure changes and architecture churn.

Files affected: `AGENTS.md`, `ARCHITECTURE.md`, `PROJECT_STATE.md`, `TASKS.md`, `DECISIONS.md`, `SECURITY.md`, `QA_CHECKLIST.md`, `WORK_LOG.md`.

## 2026-05-27 - Preserve Current Next.js Plus Listing Worker Architecture Pending Evidence

Problem: The repo contains a Next.js marketing app and an untracked Cloudflare Worker listing subsystem, while prior Malickland work also involved a separate `wv-property-intelligence` Express/SQLite app.

Decision: Treat this checkout as the `malickland.net` Next.js 16/React 19 app with a candidate Worker/Apps Script listing subsystem. Do not import assumptions from `wv-property-intelligence` without fresh evidence.

Reasoning: Current repo evidence shows `package.json`, App Router files under `src/app`, and `listing-system/` with Worker/KV/Apps Script docs. Mixing architectures would increase risk.

Alternatives considered: treating `wv-property-intelligence` as the active app or redesigning around a new database-backed architecture. Both are rejected until repo governance documents justify that change.

Security/performance impact: Reduces accidental deployment, data, and routing mistakes while the listing system is still unverified.

Files affected: `ARCHITECTURE.md`, `PROJECT_STATE.md`, `TASKS.md`.
