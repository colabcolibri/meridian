---
title: Architecture
status: approved
version: 1.5
updated: 2026-06-04
depends_on:
  [00_scope.md, 01_tech_stack.md, 02_security.md, 03_user_types.md, 04_principles.md]
blocks: [06_database.md, 07_api_contracts.md, 08_environments.md]
---

# 05 — Architecture

## Objective

Document Meridian Desktop architecture and how it relates to the Meridian kit at the repository root.

## Repository context

```txt
meridian/                    # kit + app repository
  README.md                  # Git onboarding
  README.md                  # kit monorepo onboarding only (optional in client projects)
  .agent/                    # operational kit for agents
    rules/MERIDIAN.md        # P0 — always_on
    MERIDIAN.md              # master protocol
    agents/                  # 7 personas
    skills/                  # progressive disclosure + references/
    workflows/               # slash commands
    scripts/validate_meridian.py
    scripts/generate_board.py  # v4-S2 — board from US frontmatter
  app-visual-studio/         # VS Code extension (v4) — read-first IDE monitor
    src/extension.ts
    src/board-editor-panel.ts
    src/deliverables-editor-panel.ts
    dist/extension.js
  app-desktop/               # browser monitor (Vite) — read-only UI
    docs/                    # source of truth for THIS app (monitored folder in dogfooding)
      00_scope.md … 11_decisions.md
      decisions/YYYY-MM-DD.json
      us/
      epics/
      versions/
      sprints/
      kanban/board.json      # derived from US
    src/
```

The app is **not** the source of truth for the protocol. It monitors the project's **`docs/`** folder (the same one agents edit in Cursor).

## Layers

| Layer                | Responsibility                                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------------------------- |
| Protocol             | `.agent/MERIDIAN.md` (copy `.agent/` into client projects)                                                    |
| Always-on governance | `.agent/rules/MERIDIAN.md`                                                                                    |
| Monitored project    | phase docs 00–08 and 11, `docs/decisions/`, `docs/epics/`, `docs/versions/`, `docs/us/`, derived `board.json` |
| Desktop monitor      | **Read-only** UI: Setup, Deliverables (epics/versions/sprints), Board (kanban), Decisions                     |
| VS Code extension    | **Read-first** in v4: Board + Deliverables editor tabs; validate via kit Python; disk writes deferred to v5   |

## Desktop app (v1 + v2.01)

- **Stack:** Vite, React, TypeScript, Tailwind, shadcn/ui, `yaml` (frontmatter).
- **Opened folder (two transports):**
  - **Dev HTTP path (v2.01, preferred in `pnpm dev`):** User enters an absolute path to **`docs/`** in `PathInput` (Welcome screen). Value persists in `localStorage` under `meridian.localFolderPath` (`{ "path": "..." }`). On mount, if the key is set and `HEAD /api/list?dir=<path>` succeeds, `ProjectFolderContext` loads via `http-folder-access.ts` (`fetch('/api/list')`, `fetch('/api/files')`) — no picker on reload (F5).
  - **Browser picker (fallback):** File System Access API (`showDirectoryPicker` / `input[webkitdirectory]`) when no persisted path or HTTP probe fails. Same folder layout: handle root = `docs/`; subfolders `decisions/`, `us/`, `epics/`, `versions/`, `sprints/`, `kanban/`.
- **Local file server (dev only):** `vite-file-server.ts` → plugin `meridianFileServerPlugin()` in `vite.config.ts`. Middleware on Vite dev server:
  - `GET /api/list?dir=<absolute>` — JSON array of entry names (directory must resolve under supplied root; traversal blocked).
  - `GET /api/files?path=<absolute>` — raw UTF-8 file text.
  - `HEAD /api/list?dir=<absolute>` — reachability probe for rehydrate on load.
  - Localhost-only; no auth; not registered in production build (`configureServer` only).
- **Loading:** **Index-first (US-0076)** — on open, list directories and parse US **frontmatter only** (prefix read up to 8KB); phase docs, epics, versions, sprints, and decisions load metadata needed for tabs. Directory mirror is either HTTP paths or `FileSystemDirectoryHandle`; full markdown loads in sheets via the active adapter. Body-dependent protocol checks and kanban doc badges run in background after the index is ready (`enrichUserStoryValidation`).
- **TS validation:** `protocol-validators.ts` (P0 rules in the UI).
- **Python validation (dev):** `vite-meridian-validate.ts` → `POST /api/meridian/validate` runs `validate_meridian.py` with root **`app-desktop/`** (full project with `docs/` subfolder). Static build does not run Python.

## Monitor views (v1)

| Tab          | Source (relative to opened `docs/` folder) |
| ------------ | ------------------------------------------ |
| Setup        | parsed docs 00–08 and 11 + inline reader   |
| Decisions    | `decisions/*.json` — structured log by day |
| Deliverables | `versions/`, `sprints/`, `epics/`          |
| Board        | `us/*.md` + diff with `kanban/board.json`  |

## VS Code extension (v4 — `app-visual-studio/`)

**North star:** kanban + deliverables **inside the IDE** as editor tabs. **Read-only** on `docs/` for board UI. Agents keep authoring US and `board.json`; the extension **displays** and **validates**.

| Concern                    | Browser monitor               | Extension (v4 shipped)                                                               |
| -------------------------- | ----------------------------- | ------------------------------------------------------------------------------------ |
| Board / kanban             | ✅ Deliverables tab + filters | ✅ Editor tab; columns ❌🔶🧪✅🧊; version/epic All·None·multi-select; frozen toggle |
| Epics / versions / sprints | ✅ Deliverables layouts       | ✅ Editor tab; version accordions; progress from US frontmatter                      |
| Open artifact              | Sheet / inline reader         | Opens `docs/us/`, `epics/`, `versions/`, `sprints/` `.md` beside tab                 |
| Sync `board.json`          | stale warning                 | ✅ **Meridian: Sync Board** — TS export to `docs/kanban/board.json`                  |
| Validate project           | dev HTTP → Python             | ✅ `Meridian: Validate Project` → `validate_meridian.py` (Output channel)            |
| New US                     | —                             | Output stub (v5)                                                                     |

### UI structure (shipped)

| Surface                   | Role                                                                                                                  |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Activity bar **Meridian** | **Commands** tree — same actions as palette (Open Board, Open Deliverables, Validate, Status, Sync stub, New US stub) |
| **Editor tab — Board**    | `WebviewPanel` `meridian.board`; client-side filters; empty status columns always visible                             |
| **Editor tab — Versions** | All releases, accordions, no version filter                                                                           |
| **Editor tab — Sprints**  | Sprint list with version filter (All/None/multi)                                                                      |
| **Editor tab — Epics**    | Epic progress with version + epic filters                                                                             |
| **Sync Board**            | TypeScript export to `docs/kanban/board.json` (not Python)                                                            |
| Status bar                | `Meridian: N US` when `docs/` resolved                                                                                |
| Menu **View → Meridian**  | Quick access to commands                                                                                              |

F5 / Extension Development Host is **maintainer-only**. End users install `.vsix` (`pnpm install:cursor` or Marketplace later).

### Data loading

- Parsers in extension: `load-stories.ts`, `load-epics.ts`, `load-versions.ts`, `load-sprints.ts` (YAML frontmatter via `yaml` package).
- Kanban column rules aligned with `app-desktop` `kanban-columns` / monitor `KanbanView`.
- `MeridianContext` file watcher: `docs/us/*.md`, `docs/kanban/board.json`, `docs/versions|epics|sprints/*.md` → refresh open webviews.

### Activation and `docs/` resolution

- `workspaceContains:.agent/MERIDIAN.md`.
- **Single product:** `docs/` next to copied `.agent/` (client) or dogfood `app-desktop/docs/` when kit is at monorepo root.
- **Multi-product (v2.03, US-0101):** optional `.meridian/projects.json` at kit root declares `projects[]` (`id`, `name`, `docs` path relative to repo) plus `default` and `exclude`. **Discovery B** also finds every folder named exactly `docs` whose tree passes Meridian fingerprint (`00_scope.md` or `us/US-*.md`). Manifest **A** merges with discovery; `exclude` removes paths. Only the folder name `docs` counts — not `docs-extra`.
- **Active project:** `meridian.activeProject` + **Select Active Project**; board, deliverables, validate, and sync use the active `docs/` and its `packageRoot` (parent of `docs/`).

### Packaging

- `pnpm package:vsix` / `pnpm install:cursor` — no bundled Python; validate requires `python3` on PATH.
- `npm.autoDetect: off` in extension folder avoids NPM noise in monorepo.

## Pending (v7+)

- Validate arbitrary folder via Python without Vite dev bridge (Tauri, v7).
- Optional native monitor packaging (EPIC-07).

## Limits

- Browser monitor does not **write** to disk (read-only); HTTP dev server is read-only as well.
- VS Code extension v4 is the **default** board UI in the IDE; browser monitor remains optional/demo.
- Production static build does not bundle or call `/api/list` / `/api/files` on the hot path when not in dev.
- App does not replace agent routing (`meridian-routing` stays in the IDE).
