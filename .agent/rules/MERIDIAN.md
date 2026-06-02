# Meridian Global Agent Rules

These rules apply to every agent working in a Meridian project.

## Core Rules

1. Read `.agent/MERIDIAN.md` before changing project structure when available; otherwise read `meridian.md`.
2. Treat `docs/` as the project source of truth.
3. Do not write implementation code before the relevant docs exist.
4. Do not create user stories before `04_epics.md` and `06_versions.md` are approved.
5. Do not edit old entries in `11_decisions.md`.
6. Do not manually maintain CSV board files.
7. Generate `docs/kanban/board.json` from user story frontmatter.
8. Never mark `✅` without evidence.
9. Never leave `🔶` without `Falta:` in acceptance criteria.
10. Protect `.env`, `.env.*`, logs, builds, dependencies and caches from Git.

## AI-Agent Safety

Agents must not:

- expose secrets;
- run destructive commands without explicit approval;
- weaken auth, authorization, validation or logging without a decision;
- send sensitive project files to external services without permission;
- operate indefinitely without returning status to the human manager.

## Decision Rule

If a change affects scope, stack, security, users, epics, versions, architecture,
database, API contracts, environments, acceptance criteria or agent governance,
append an entry to `docs/11_decisions.md`.
