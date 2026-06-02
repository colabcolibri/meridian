# Meridian Desktop Docs

This folder is the **source of truth** for Meridian Desktop development. In dogfooding, open **this folder** (`app-desktop/docs/`) in the monitor — not the repository root or only `app-desktop/`.

## Repository (Meridian kit)

| File                                                               | Role                                 |
| ------------------------------------------------------------------ | ------------------------------------ |
| [`../../README.md`](../../README.md)                               | Repository onboarding (Git/GitHub)   |
| [`../../.agent/MERIDIAN.md`](../../.agent/MERIDIAN.md)             | Master protocol for agents           |
| [`../../.agent/rules/MERIDIAN.md`](../../.agent/rules/MERIDIAN.md) | Global rules (`trigger: always_on`)  |
| [`../../.agent/ARCHITECTURE.md`](../../.agent/ARCHITECTURE.md)     | Map of agents, skills, and workflows |

## Phase documents (system axis)

| Document                                   | Status   | Purpose                                      |
| ------------------------------------------ | -------- | -------------------------------------------- |
| [00_scope.md](00_scope.md)                 | approved | Desktop app scope and boundaries             |
| [01_tech_stack.md](01_tech_stack.md)       | approved | React, TypeScript, Vite, Tailwind, shadcn/ui |
| [02_security.md](02_security.md)           | approved | Local version security                       |
| [03_user_types.md](03_user_types.md)       | approved | Usage profiles                               |
| [04_principles.md](04_principles.md)       | approved | Implementation principles                    |
| [05_architecture.md](05_architecture.md)   | approved | App architecture (parser, docs folder)       |
| [06_database.md](06_database.md)           | draft    | Out of initial scope                         |
| [07_api_contracts.md](07_api_contracts.md) | draft    | Out of initial scope                         |
| [08_environments.md](08_environments.md)   | approved | Local commands and Git hooks                 |
| [11_decisions.md](11_decisions.md)         | approved | Stub — log rules (entries in `decisions/`)   |

## Delivery artifacts (folders — source of truth)

| Artifact      | Path                                     | Role                                           |
| ------------- | ---------------------------------------- | ---------------------------------------------- |
| Epics         | [`epics/`](epics/)                       | One file per EPIC-XX (product capability)      |
| Releases      | [`versions/`](versions/)                 | One file per vX (go-live)                      |
| Sprints       | [`sprints/`](sprints/)                   | vX-SY slices within each release               |
| User stories  | [`us/`](us/)                             | Backlog (one US = one file)                    |
| Decision log  | [`decisions/`](decisions/)               | One JSON per day (`YYYY-MM-DD.json`)           |
| Derived board | [`kanban/board.json`](kanban/board.json) | Kanban generated from US — do not edit by hand |

Epics, versions, and sprints live **only** in the folders above — no parallel markdown index.

## Current version and sprint

| Sprint               | Status  | US                             |
| -------------------- | ------- | ------------------------------ |
| v0-S1 Foundation     | ✅      | US-0001–007                    |
| v0-S2 Monitor shell  | ✅      | US-0008                        |
| v1-S1 Real reading   | ✅      | US-0009 → US-0017, US-0016     |
| v1-S2 Monitor UX     | ✅      | US-0018 → US-0022 (EPIC-06)    |
| v1-S6 JSON decisions | ✅      | US-0039, US-0040               |
| **v2**               | planned | VSCode / disk writes (EPIC-05) |

## Work order

| Phase                | Where                             | Axis     |
| -------------------- | --------------------------------- | -------- |
| 0 — Foundation       | 11, 00–03                         | System   |
| 1 — Principles       | 04                                | System   |
| 2 — Architecture     | 05                                | System   |
| 3 — Technical detail | 06–08                             | System   |
| Backlog              | `epics/`, `versions/`, `sprints/` | Delivery |
| Execution            | `us/`, `board.json`               | Delivery |

US gate: `05_architecture` approved + referenced epic/version exist in `docs/epics/` and `docs/versions/`.

## How agents should work

See also: [daily AI workflow](../../.agent/references/daily-ai-workflow.md) and `/daily-with-ai` in Cursor.

### Daily loop (manager + AI)

1. **Orient** — `/status`; app (Setup + Board); pick an unblocked Must US.
2. **Contextualize** — cite the US in chat (`US-XXXX` or `docs/us/US-XXXX.md`).
3. **Implement** — agent executes; review diff; partial → `🔶` + `Missing:` in acceptance.
4. **Close** — `/complete-us US-XXXX` (technical implementation + acceptance + `✅`); `/sync-board`.
5. **Review** — check the Board tab in the app.

### Detail by artifact

1. Pick a US in `docs/sprints/` or `docs/versions/` (next milestone: v2 in `versions/v2.md`).
2. Implement citing `US-XXXX` in context.
3. Fill `## Technical implementation` when done (skill `complete-user-story`).
4. Update US frontmatter (`🔶` + `Missing:` or `✅` with evidence).
5. Regenerate `board.json` (skill `generate-board-json` or `/sync-board`).
6. Relevant decisions → prepend in `docs/decisions/YYYY-MM-DD.json` (skill `update-decisions-log`).

## Dogfooding in the app

```bash
cd app-desktop && pnpm dev
```

In the monitor: **Open docs folder** → select `app-desktop/docs/`.
