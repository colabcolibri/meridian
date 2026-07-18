---
title: Architecture
status: approved
version: 2.0
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
    scripts/generate_board.py
    scripts/meridian_db.py
    scripts/migrate_md_to_sqlite.py
    migrations/              # SQLite schema (YYYYMMDDHHMMSS_*.sql)
  .meridian/
    meridian.db              # v9+ delivery store (gitignored)
  docs/                      # dogfood phase docs + derived board.json
    00_scope.md … 11_decisions.md
    decisions/               # legacy import; new entries via meridian_db_cli
    us/                      # legacy .md (v1 import); v9+ primary store is SQLite
    epics/ versions/ sprints/
    kanban/board.json        # derived from SQLite (generate_board.py)
  app-visual-studio/         # VS Code extension — IDE monitor
    src/extension.ts
    dist/extension.js
```

The extension is **not** the source of truth for the protocol. It monitors **`docs/`** for phase documents and **`.meridian/meridian.db`** for delivery artifacts (v9+).

## Layers

| Layer                | Responsibility                                                                 |
| -------------------- | ------------------------------------------------------------------------------ |
| Protocol             | `.agent/MERIDIAN.md` (copy `.agent/` into client projects)                     |
| Always-on governance | `.agent/rules/MERIDIAN.md`                                                     |
| Phase documents      | `docs/00`–`11`, discovery, architecture detail — **Markdown on disk**          |
| Delivery store (v9+) | `.meridian/meridian.db` — epics, versions, sprints, US, decisions, board snaps |
| Derived kanban       | `docs/kanban/board.json` — generated from SQLite (`generate_board.py`)         |
| VS Code extension    | Board + Deliverables editor tabs; validate via kit Python; sync board          |

## VS Code extension (`app-visual-studio/`)

**North star:** kanban + deliverables **inside the IDE** as editor tabs. Agents author via workflows; the extension **displays**, **validates**, and **syncs** `board.json`.

| Concern                    | Extension (v4+)                                                                 |
| -------------------------- | ------------------------------------------------------------------------------- |
| Board / kanban             | Editor tab; columns ❌🔶🧪✅🧊; version/epic filters; frozen toggle              |
| Epics / versions / sprints | Editor tab; version accordions; progress from US metadata                       |
| Open artifact              | Opens `docs/us/`, `epics/`, `versions/`, `sprints/` `.md` beside tab (legacy)   |
| Sync `board.json`          | **Meridian: Sync Board** — TS export or `generate_board.py` from SQLite        |
| Validate project           | **Meridian: Validate Project** → `validate_meridian.py` (Output channel)      |
| New US                     | Output stub (v5) — prefer `/create-us` workflow                                 |

### UI structure

| Surface                   | Role                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------- |
| Activity bar **Meridian** | Commands tree — Open Board, Open Deliverables, Validate, Status, Sync, New US stub    |
| **Editor tab — Board**    | `WebviewPanel` `meridian.board`; client-side filters                                  |
| **Editor tab — Versions** | All releases, accordions                                                            |
| **Editor tab — Sprints**  | Sprint list with version filter                                                       |
| **Editor tab — Epics**    | Epic progress with version + epic filters                                             |
| **Sync Board**            | Export to `docs/kanban/board.json`                                                    |
| Status bar                | `Meridian: N US` when `docs/` resolved; project name when multi-product               |
| **Project context strip** | Toolbar: name, `docs/` path, US count; dropdown when N>1                              |

F5 / Extension Development Host is **maintainer-only**. End users install `.vsix` (`pnpm install:cursor`).

### Data loading

- Parsers: `load-stories.ts`, `load-epics.ts`, `load-versions.ts`, `load-sprints.ts` (YAML frontmatter).
- **v9+:** extension should read delivery from SQLite export API when `meridian.db` exists (US-0112 scope — follow-up).
- `MeridianContext` file watcher: `docs/us/*.md`, `docs/kanban/board.json`, deliverables folders → refresh webviews.

### Activation and `docs/` resolution

- `workspaceContains:.agent/MERIDIAN.md`.
- **Single product:** `docs/` next to `.agent/` at repo root (this dogfood) or client project layout.
- **Multi-product:** optional `.meridian/projects.json` at kit root; discovery finds `docs/` folders with Meridian fingerprint.
- **Active project:** `meridian.activeProject` + **Select Active Project**; validate/sync use active `packageRoot` (parent of `docs/`).

### Packaging

- `pnpm package:vsix` / `pnpm install:cursor` — validate requires `python3` on PATH.
- `npm.autoDetect: off` in extension folder.

## Removed: browser monitor (`app-desktop/`)

The Vite/React desktop app was removed in v10 (2026-07-18). GitHub Pages demo and `vite-file-server` are retired. Use the VS Code extension for all IDE visibility.

## Limits

- Extension v4 still reads legacy `docs/us/*.md` for board until SQLite read path ships.
- Extension does not replace agent routing (`meridian-routing` stays in the IDE chat).
- SQLite DB is local and gitignored; team sync is via exported `board.json` + phase docs in Git.
