---
title: Architecture
status: approved
version: 2.1
updated: 2026-07-18
depends_on:
  [00_scope.md, 01_tech_stack.md, 02_security.md, 03_user_types.md, 04_principles.md]
blocks: [06_database.md, 07_api_contracts.md, 08_environments.md]
---

# 05 — Architecture

## Objective

Document Meridian repository architecture: kit, phase docs, SQLite delivery store, and VS Code extension.

## Repository context

```txt
meridian/                    # kit + dogfood product
  README.md
  .agent/                    # operational kit for agents
    rules/MERIDIAN.md        # P0 — always_on
    MERIDIAN.md              # master protocol
    agents/
    skills/
    workflows/
    scripts/validate_meridian.py
    scripts/meridian_delivery.py
    scripts/meridian_db_cli.py
    scripts/meridian_db_export.py
    scripts/meridian_db.py
    scripts/migrate_md_to_sqlite.py
    migrations/              # SQLite schema (YYYYMMDDHHMMSS_*.sql)
  .meridian/
    meridian.db              # delivery store (gitignored) — schema: docs/06_database.md
  docs/                      # phase docs only (no delivery .md, no board.json)
    00_scope.md … 11_decisions.md
  app-visual-studio/         # VS Code extension — IDE monitor
    src/extension.ts
    dist/extension.js
```

The extension is **not** the source of truth for the protocol. It monitors **`docs/`** for phase documents and **`.meridian/meridian.db`** for delivery. **ER diagram and table contract:** `docs/06_database.md` § Schema.

## Layers

| Layer                | Responsibility                                                                 |
| -------------------- | ------------------------------------------------------------------------------ |
| Protocol             | `.agent/MERIDIAN.md` (copy `.agent/` into client projects)                     |
| Always-on governance | `.agent/rules/MERIDIAN.md`                                                     |
| Phase documents      | `docs/00`–`11`, discovery, architecture detail — **Markdown on disk**          |
| Delivery store       | `.meridian/meridian.db` — canonical ER: `docs/06_database.md` § Schema         |
| VS Code extension    | Board + Deliverables editor tabs; validate via kit Python; reads SQLite       |

## VS Code extension (`app-visual-studio/`)

**North star:** kanban + deliverables **inside the IDE** as editor tabs. Agents author via CLI/workflows; the extension **displays**, **validates**, and **edits** delivery in SQLite.

| Concern                    | Extension (v4+)                                                                 |
| -------------------------- | ------------------------------------------------------------------------------- |
| Board / kanban             | Editor tab; columns ❌🔶🧪✅🧊; version/epic filters; frozen toggle              |
| Epics / versions / sprints | Editor tab; version accordions; progress from US metadata                       |
| Open artifact              | Virtual document from `meridian_db_export.py --entity …`                        |
| Validate project           | **Meridian: Validate Project** → `validate_meridian.py` (Output channel)      |
| New US                     | Output stub (v5) — prefer `/create-us` workflow                                 |

### UI structure

| Surface                   | Role                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------- |
| Activity bar **Meridian** | Commands tree — Open Board, Open Deliverables, Validate, Status                         |
| **Editor tab — Board**    | `WebviewPanel` `meridian.board`; client-side filters                                  |
| **Editor tab — Versions** | All releases, accordions                                                            |
| **Editor tab — Sprints**  | Sprint list with version filter                                                       |
| **Editor tab — Epics**    | Epic progress with version + epic filters                                             |
| Status bar                | `Meridian: N US` when `docs/` resolved; project name when multi-product               |
| **Project context strip** | Toolbar: name, `docs/` path, US count; dropdown when N>1                              |

F5 / Extension Development Host is **maintainer-only**. End users install `.vsix` (`pnpm install:cursor`).

### Data loading

- **v10+:** extension reads delivery via `meridian_db_export.py --format planning` when `meridian.db` exists (`load-from-sqlite.ts`).
- `MeridianContext` watches `.meridian/meridian.db` → refresh board/deliverables webviews on change.

### Activation and `docs/` resolution

- `workspaceContains:.agent/MERIDIAN.md`.
- **Single product:** `docs/` next to `.agent/` at repo root (this dogfood) or client project layout.
- **Multi-product:** optional `.meridian/projects.json` at kit root; discovery finds `docs/` folders with Meridian fingerprint.
- **Active project:** `meridian.activeProject` + **Select Active Project**; validate uses active `packageRoot` (parent of `docs/`).

### Packaging

- `pnpm package:vsix` / `pnpm install:cursor` — validate requires `python3` on PATH.
- `npm.autoDetect: off` in extension folder.

## Removed: browser monitor (`app-desktop/`)

The Vite/React desktop app was removed in v10 (2026-07-18). Use the VS Code extension for all IDE visibility.

## Removed: `docs/kanban/board.json` (v11)

Kanban is read directly from SQLite. No JSON export on disk; optional `board_snapshots` table for audit history.

## Limits

- Extension does not replace agent routing (`meridian-routing` stays in the IDE chat).
- SQLite DB is local and gitignored; team sync is via phase docs in Git + shared migration/bootstrap scripts (not committed DB file).
