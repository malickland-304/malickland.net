# Malickland 2.0 - AI Agent Instructions

This repository is governed by persistent repository documentation. Agents must coordinate through files in this repo, not through private chat memory.

## Authority And Governance Rule

Unless a future repository governance document explicitly changes this model, use this safe precedence order:

1. Explicit human project-owner instruction for the current task.
2. Security, privacy, legal, and production-safety constraints.
3. `AGENTS.md`
4. `ARCHITECTURE.md`
5. `SECURITY.md`
6. `DECISIONS.md`
7. `TASKS.md`
8. `PROJECT_STATE.md`
9. `QA_CHECKLIST.md`
10. `WORK_LOG.md`
11. Temporary handoff documents and conversational notes.

If conflicts are discovered:

- Prefer the safer implementation.
- Document the conflict in `DECISIONS.md`.
- Do not appoint ChatGPT, Gemini, Claude, Codex, or another AI as final arbiter.
- Escalate unresolved authority conflicts to the human project owner.
- Avoid destructive, irreversible, production-data, credential, or infrastructure changes until the blocker is resolved.

## Autonomous Stability Rules

- Do not substantially alter architecture, frameworks, database strategy, authentication model, or deployment topology unless the current implementation is failing requirements and the change is documented in `DECISIONS.md` with migration impact and rollback strategy.
- Stop and document blockers instead of improvising when requirements are contradictory, security implications are unclear, destructive actions are required, production data could be affected, migrations are irreversible, or credentials/infrastructure access are missing.
- Report only checks actually run, tests actually executed, and builds actually completed. Label assumed, simulated, inferred, or skipped verification as unverified.
- Treat `WORK_LOG.md` as chronological evidence; it does not override governance.

## Before Editing

- Read `README.md`, `PROJECT_STATE.md`, `TASKS.md`, `DECISIONS.md`, `SECURITY.md`, `ARCHITECTURE.md`, `QA_CHECKLIST.md`, and recent entries in `WORK_LOG.md`.
- Inspect current `git status` and avoid overwriting uncommitted work.
- State the task, acceptance criteria, security impact, performance impact, and verification plan.

## During Implementation

- Make focused production-quality changes that follow the existing Next.js, TypeScript, Tailwind, Cloudflare Worker, and Google Apps Script patterns.
- Validate all untrusted input at server and worker boundaries.
- Enforce authorization server-side.
- Never hardcode or expose secrets.
- Avoid unnecessary dependencies.
- Add or update tests for important behavior when test infrastructure exists; otherwise document the test gap in `TASKS.md`.
- Do not make destructive, production, DNS, Cloudflare, Vercel, Google, or credential changes without a repository-documented safety stop and explicit operational plan.

## Before Marking Work Complete

- Run relevant lint, type-check, build, dependency audit, and targeted runtime checks available in the project.
- Review for security vulnerabilities, data leakage, authorization gaps, regressions, inefficiencies, accessibility problems, and documentation drift.
- Update `PROJECT_STATE.md`, `TASKS.md`, `DECISIONS.md`, `SECURITY.md`, `QA_CHECKLIST.md`, `WORK_LOG.md`, or `README.md` when discoveries or changes affect shared project state.
