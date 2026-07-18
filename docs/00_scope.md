---
title: Scope
status: approved
version: 2.0
updated: 2026-07-18
depends_on: []
blocks: [01_tech_stack.md, 04_principles.md, 05_architecture.md]
---

# 00 — Scope

## Name and description

**Meridian** is a repo-native harness for AI-assisted software development: the `.agent/` kit (agents, skills, workflows, validators) plus product documentation under `docs/`. This repository dogfoods the protocol at the root (`docs/` next to `.agent/`).

Visibility and planning happen in the **VS Code / Cursor extension** (`app-visual-studio/`): Board, Deliverables, validate, and sync board. There is no separate browser desktop app — the IDE is the monitor.

Delivery artifacts (epics, versions, sprints, user stories, decisions) live in **SQLite** (`.meridian/meridian.db`) from v9 onward. Phase documents (`00`–`11`, discovery, architecture detail) remain Markdown.

## Problem it solves

Software projects with AI agents often move to code before minimum documentation, acceptance criteria, and recorded decisions exist. That creates rework, misalignment, hard-to-audit sprints, lost context, and agents running without clear direction.

Meridian keeps the contract in Git and gives the process manager visibility inside the IDE — without a separate toolchain.

## Who it is for

- Anyone who wants to run software development with AI agents without losing control, clarity, or consistency.
- Devs, founders, product managers, tech leads, and operators who manage delivery from the editor.
- Teams using Cursor, VS Code, or Codex with the Meridian kit installed.

## In initial scope

- `.agent/` kit: agents, skills, workflows, `validate_meridian.py`, SQLite delivery store (v9+).
- `docs/` phase documents and governance gates.
- VS Code extension: Board, Deliverables, validate, sync board, project picker (multi-product).
- Kit distribution (`meridian-kit` tarball) and IDE adapters (Cursor, Claude, Codex).

## Out of initial scope

- Browser-based desktop monitor (`app-desktop/` — **removed**; superseded by extension).
- Remote backend, authentication, multi-user, and cloud sync (v8 vision gate).
- Autonomous agents without human review or recorded decisions.
- Integration with GitHub Issues, Linear, Jira (future).

## Known constraints

- Extension requires `python3` on PATH for validate.
- SQLite is local per product package (`{packageRoot}/.meridian/meridian.db`).
- Client projects copy `.agent/` only; `docs/` is per product.

## Assumptions

- Primary IDE is VS Code or Cursor with the Meridian extension.
- Managers run slash workflows (`/create-us`, `/refine-us`, etc.) from the IDE chat.

## Identified risks

- Kit and extension drift if adapters are not synced after kit upgrades.
- Dual storage during migration (legacy `docs/us/*.md` + SQLite) until cutover is complete.
