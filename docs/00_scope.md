---
title: Scope
status: approved
version: 2.1
updated: 2026-09-03
depends_on: []
blocks: [01_tech_stack.md, 04_principles.md, 05_architecture.md]
---

# 00 — Scope

## Name and description

**Meridian** is a repo-native harness for AI-assisted software development: the `.agent/` kit (agents, skills, workflows, validators) plus product documentation under `docs/`. This repository dogfoods the protocol at the root (`docs/` next to `.agent/`).

Visibility and planning happen in two **read-only** monitors of the same SQLite store: the **VS Code / Cursor extension** (`app-visual-studio/`) and the **kit HTML board** (`.agent/board-ui/` served by `python3 .agent/board` on `127.0.0.1`, ephemeral port, foreground process). Neither writes `board.json`. The Vite desktop app `app-desktop/` stays removed.

Delivery artifacts (epics, versions, sprints, user stories, decisions) live in **SQLite** (`.meridian/meridian.db`) from v9 onward. Phase documents (`00`–`11`, discovery, architecture detail) remain Markdown.

## Problem it solves

Software projects with AI agents often move to code before minimum documentation, acceptance criteria, and recorded decisions exist. That creates rework, misalignment, hard-to-audit sprints, lost context, and agents running without clear direction.

Meridian keeps the contract in Git and gives the process manager visibility in the IDE **or** in a local browser from the kit — without a remote toolchain or pnpm for the HTML monitor.

## Who it is for

- Anyone who wants to run software development with AI agents without losing control, clarity, or consistency.
- Devs, founders, product managers, tech leads, and operators who manage delivery from the editor.
- Teams using Cursor, VS Code, Codex, or the kit alone (clone + `python3`) to inspect delivery.

## In initial scope

- `.agent/` kit: agents, skills, workflows, `validate_meridian.py`, SQLite delivery store (v9+).
- `docs/` phase documents and governance gates.
- VS Code extension: Board, Deliverables, validate, project picker (multi-product); board reads SQLite directly.
- Kit HTML monitor: static `.agent/board-ui/` + Python 3 stdlib serve (`127.0.0.1`, porta efêmera, Ctrl+C encerra); GET only; same `export_planning_json` as the extension.
- Kit distribution (`meridian-kit` tarball) and IDE adapters (Cursor, Claude, Codex).

## Out of initial scope

- Vite/React desktop monitor (`app-desktop/` — **removed** v10). The kit HTML board is not that app: no pnpm, no bundler, no upsert from the browser.
- Writes to delivery from the HTML monitor (ready, ✅, forms) — later epic.
- Remote backend, authentication, multi-user, and cloud sync (v8 vision gate).
- Binding the HTML serve to `0.0.0.0` or running it as a daemon / extension `activate` hook.
- Autonomous agents without human review or recorded decisions.
- Integration with GitHub Issues, Linear, Jira (future).

## Known constraints

- Extension and kit HTML monitor require `python3` on PATH.
- SQLite is local per product package (`{packageRoot}/.meridian/meridian.db`).
- Client projects copy `.agent/` only; `docs/` is per product.

## Assumptions

- Primary authoring remains IDE chat slash workflows (`/create-us`, `/refine-us`, etc.).
- Inspecting the board does not require the extension: `python3` + kit scripts suffice.

## Identified risks

- Kit and extension drift if adapters are not synced after kit upgrades.
- v11: delivery cutover to SQLite complete; legacy `docs/us/*.md` removed from dogfood after migration.
