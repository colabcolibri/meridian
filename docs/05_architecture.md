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
| Board / kanban             | Editor tab; columns 📋 Backlog·📌 Todo·🔨 Doing·🔶 Partial·🧪 Tests·✅ Done; toggles 🧊 Frozen·🚫 Deprecated; version/epic filters; US cards show `sprint` when allocated |
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
| **Editor tab — Decisions**| Read-only decision log by date from SQLite (`--format decisions`)                     |
| **Editor tab — Architecture** | Interactive maps from `docs/architecture/diagrams/*.{md,mmd}` (pan, zoom, picker) |
| **Editor tab — Delivery Graph** | US nodes + `dependsOn` edges from planning export; version/sprint filters |
| **Editor tab — Import Graph** | Scoped file import graph via `.agent/scripts/meridian_import_graph.py` |
| Status bar                | `Meridian: N US` when `docs/` resolved; project name when multi-product               |
| **Project context strip** | Toolbar: name, `docs/` path, US count; dropdown when N>1                              |

F5 / Extension Development Host is **maintainer-only**. End users install `.vsix` (`pnpm install:cursor`).

## Architecture diagrams

Visual structures for onboarding and review — **runtime**, **database (ER)**, integrations, flows. One diagram per file in `docs/architecture/diagrams/` (authored via skill `generate-architecture-diagram`). **View:** extension command **Meridian: Open Architecture Diagram** (Meridian diagram renderer in plugin — bundled Mermaid.js + in-house theme, pan/zoom).

| File | Kind | Scope |
| ---- | ---- | ----- |
| `architecture/diagrams/meridian-runtime.md` | runtime | Kit, docs, SQLite, extension tabs |
| `architecture/diagrams/meridian-database.md` | database | Delivery store ER (companion to `06_database`) |

`05_architecture.md` keeps inline Mermaid for the gate; `diagrams/` holds full IDE companion maps with auto-layout. Add a new row here when adding a diagram file — multiple files are expected as the system grows.

### Data loading

- **v10+:** extension reads delivery via `meridian_db_export.py --format planning` when `meridian.db` exists (`load-from-sqlite.ts`). Planning JSON includes per-US `sprint` (from `user_stories.sprint_id`).
- **Decisions:** `meridian_db_export.py --format decisions` → `load-decisions.ts` → **Open Decisions** tab.
- **Architecture diagrams:** `docs/architecture/diagrams/*.{md,mmd}` → `load-architecture-diagrams.ts` → **Open Architecture Diagram** tab (`meridian-mermaid` theme in webview); refreshes when source changes.
- `MeridianContext` watches `.meridian/meridian.db` → refresh board/deliverables webviews on change.

### Activation and `docs/` resolution

- `workspaceContains:.agent/MERIDIAN.md`.
- **Single product:** `docs/` next to `.agent/` at repo root (this dogfood) or client project layout.
- **Multi-product:** optional `.meridian/projects.json` at kit root; discovery finds `docs/` folders with Meridian fingerprint; per-product `qualitySiege` tier (`kit` | `standard` | `full`).
- **Active project:** `meridian.activeProject` + **Select Active Project**; validate uses active `packageRoot` (parent of `docs/`).
- **Quality profile:** `meridian_delivery.py quality-profile` resolves tier from manifest or `delivery.json` → `options.qualitySiege`; see `.agent/references/agentic-quality-model.md`. Validator WARNs when `10` is `approved` but tier is undeclared.

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
