---
title: Architecture
status: approved
version: 1.2
updated: 2026-06-03
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
  app-desktop/               # this app (Vite)
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
| Desktop app          | Reading, visual validation, status, blockers                                                                  |
| Future VSCode        | Real disk writes near the editor                                                                              |

## Desktop app (v1)

- **Stack:** Vite, React, TypeScript, Tailwind, shadcn/ui, `yaml` (frontmatter).
- **Opened folder:** File System Access API → user selects **`docs/`** (e.g. `app-desktop/docs/`). The handle is the root; phase docs at root; subfolders `decisions/`, `us/`, `epics/`, `versions/`, `sprints/`, `kanban/`.
- **Loading:** **Index-first (US-0076)** — on open, list directories and parse US **frontmatter only** (prefix read up to 8KB); phase docs, epics, versions, sprints, and decisions load metadata needed for tabs. `FileSystemDirectoryHandle` stays the mirror; full markdown loads in sheets via `readMarkdownDocFromFolder`. Body-dependent protocol checks and kanban doc badges run in background after the index is ready (`enrichUserStoryValidation`).
- **TS validation:** `protocol-validators.ts` (P0 rules in the UI).
- **Python validation (dev):** `vite-meridian-validate.ts` → `POST /api/meridian/validate` runs `validate_meridian.py` with root **`app-desktop/`** (full project with `docs/` subfolder). Static build does not run Python.

## Monitor views (v1)

| Tab          | Source (relative to opened `docs/` folder) |
| ------------ | ------------------------------------------ |
| Setup        | parsed docs 00–08 and 11 + inline reader   |
| Decisions    | `decisions/*.json` — structured log by day |
| Deliverables | `versions/`, `sprints/`, `epics/`          |
| Board        | `us/*.md` + diff with `kanban/board.json`  |

## Pending (v2)

- Disk writes / VSCode extension.
- Validate arbitrary folder via Python without dev server bridge (e.g. Tauri).

## Limits

- Browser does not **write** to disk in v1 (read-only).
- App does not replace agent routing (`meridian-routing` stays in the IDE).
