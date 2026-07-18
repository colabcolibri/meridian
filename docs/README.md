# Meridian Desktop Docs

This folder is the **source of truth** for Meridian Desktop development. In dogfooding, open **this folder** (`app-desktop/docs/`) in the monitor — not the repository root or only `app-desktop/`.

## Repository (Meridian kit)

| File                                                                                                 | Role                                                                                                               |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| [`../../README.md`](../../README.md)                                                                 | Repository onboarding (Git/GitHub)                                                                                 |
| [`../../.agent/MERIDIAN.md`](../../.agent/MERIDIAN.md)                                               | Master protocol for agents                                                                                         |
| [`../../.agent/rules/MERIDIAN.md`](../../.agent/rules/MERIDIAN.md)                                   | Global rules (`trigger: always_on`)                                                                                |
| [`../../.agent/ARCHITECTURE.md`](../../.agent/ARCHITECTURE.md)                                       | Map of agents, skills, and workflows                                                                               |
| [`../../.agent/references/instruction-surfaces.md`](../../.agent/references/instruction-surfaces.md) | **Where to edit** when protocol or UI instructions change (incl. multi-product EPIC-13 checklist)                  |
| [`../../.agent/references/usage-guide.md`](../../.agent/references/usage-guide.md)                   | Day-to-day guide — [Multiple Meridian projects](../../.agent/references/usage-guide.md#multiple-meridian-projects) |

## Phase documents (system axis)

| Document                                   | Status   | Purpose                                      |
| ------------------------------------------ | -------- | -------------------------------------------- |
| [00_scope.md](00_scope.md)                 | approved | Desktop app scope and boundaries             |
| [01_tech_stack.md](01_tech_stack.md)       | approved | React, TypeScript, Vite, Tailwind, shadcn/ui |
| [02_security.md](02_security.md)           | approved | Local version security                       |
| [03_user_types.md](03_user_types.md)       | approved | Usage profiles                               |
| [04_principles.md](04_principles.md)       | approved | Implementation principles                    |
| [05_architecture.md](05_architecture.md)   | approved | App architecture (HTTP dev path, parser)     |
| [06_database.md](06_database.md)           | draft    | Out of initial scope                         |
| [07_api_contracts.md](07_api_contracts.md) | draft    | Out of initial scope                         |
| [08_environments.md](08_environments.md)   | approved | Local commands and Git hooks                 |
| [11_decisions.md](11_decisions.md)         | approved | Stub — log rules (entries in `decisions/`)   |

## Delivery artifacts

| Artifact      | Location | Role |
| ------------- | -------- | ---- |
| Epics, versions, sprints, user stories | `.meridian/meridian.db` | **Canonical delivery** (v10+) — CLI, agents, extension |
| Kit templates | `.agent/references/templates/` | Agent contracts — not in `docs/` |
| Decision log  | [`decisions/`](decisions/) | One JSON per day (`YYYY-MM-DD.json`) |
| Phase docs    | `00_scope.md` … `11_decisions.md` | Gates, architecture, principles |

There is **no** `docs/us/`, `docs/epics/`, or `docs/kanban/board.json` in v11. The VS Code board reads SQLite via `meridian_db_export.py --format planning`. Optional audit rows live in `board_snapshots` on each upsert.

## Current version and sprint

| Sprint                           | Status  | US                                    |
| -------------------------------- | ------- | ------------------------------------- |
| v0-S1 Foundation                 | ✅      | US-0001–007                           |
| v0-S2 Monitor shell              | ✅      | US-0008                               |
| v1-S1 Real reading               | ✅      | US-0009 → US-0017, US-0016            |
| v1-S2 Monitor UX                 | ✅      | US-0018 → US-0022 (EPIC-06)           |
| v1-S6 JSON decisions             | ✅      | US-0039, US-0040                      |
| **v2-S5** Board documentation UX | ✅      | US-0073–0075 (EPIC-04)                |
| **v2-S6** Lightweight index      | ✅      | US-0076 (EPIC-04)                     |
| **v2-S4** Stale board warning    | planned | US-0051 (EPIC-04, Should)             |
| **v3-S1–S3** Monitor UI redesign | ✅      | US-0077–0082 (EPIC-11)                |
| **v2.01-S1** Local file server   | ✅      | US-0087–0088 (EPIC-02, EPIC-06)       |
| **v4-S1** Extension foundation   | planned | US-0041–0043 (EPIC-05)                |
| **v4-S2** Board sync + validate  | planned | US-0044–0046 (EPIC-05)                |
| **v4-S3** Create US on disk      | planned | US-0047–0049 (EPIC-05)                |
| **v4-S4** Templates + go-live    | planned | US-0050, US-0052–0053 (EPIC-05)       |
| **v5-S1** Sprint + complete US   | planned | US-0061–0063 (EPIC-08)                |
| **v5-S2** Status + diagnostics   | planned | US-0064–0066 (EPIC-08/04)             |
| **v5-S3** Go-live v5             | planned | US-0067 (EPIC-08)                     |
| **v6-S1** CSV + report export    | planned | US-0068–0069 (EPIC-09)                |
| **v6-S2** GitHub read-only       | planned | US-0070–0071 (EPIC-09)                |
| **v6-S3** Go-live v6             | planned | US-0072 (EPIC-09)                     |
| **v7-S1–S3** Native desktop      | planned | US-0054–0060 (EPIC-07)                |
| **v8**                           | planned | Vision gate only — EPIC-10, no US yet |

## Work order

| Phase                | Where                             | Axis     |
| -------------------- | --------------------------------- | -------- |
| 0 — Foundation       | 11, 00–03                         | System   |
| 1 — Principles       | 04                                | System   |
| 2 — Architecture     | 05                                | System   |
| 3 — Technical detail | 06–08                             | System   |
| Backlog              | SQLite (`meridian_db_cli list`)   | Delivery |
| Execution            | `.meridian/meridian.db`           | Delivery |

US gate: `05_architecture` approved + referenced epic/version exist in SQLite.

**US lifecycle:** `/create-us` (`ready: false`) → `/refine-us` (`ready: true`) → `/implement-us` → `/complete-us` → commit (human).

Validate: `python3 .agent/scripts/validate_meridian.py . --sqlite-only` (`--json` for CI).

## How agents should work

See also: [Start here](../../.agent/references/start-here.md) · [Usage guide](../../.agent/references/usage-guide.md) · [Instruction surfaces](../../.agent/references/instruction-surfaces.md) · [Scrum ↔ Meridian map](../../.agent/references/scrum-meridian-map.md) · [Scrum guide (human, optional)](../../.agent/references/scrum-guide-complete.md) · `/daily-with-ai` in Cursor.

**Updating Learn/Commands in the app:** UI copy is duplicated in `src/features/monitor/content/meridian-concepts.ts` — not synced from markdown. See [instruction-surfaces.md](../../.agent/references/instruction-surfaces.md).

### Daily loop (manager + AI)

1. **Orient** — `/status`; app (Setup + Board); pick an unblocked Must US.
2. **Create/refine** — `/create-us` then `/refine-us US-XXXX` until `ready: true`.
3. **Contextualize** — cite `US-XXXX` (`meridian_db_cli.py show US-XXXX --full`).
4. **Implement** — `/implement-us US-XXXX` after `ready: true`; review diff; partial → `🔶` + `Missing:`.
5. **Close** — `/complete-us US-XXXX` (Record + acceptance + `✅`); board UI refreshes on DB save.
6. **Commit** — one commit per US per `commit-after-us-close.md`.
7. **Review** — Board tab in VS Code extension.

### Detail by artifact

1. Pick a US from the board or `meridian_db_cli.py list user_stories`.
2. Implement citing `US-XXXX` in context; gate with `/implement-us`.
3. Fill `## Record` on close (skill `complete-user-story`).
4. Update US in SQLite (`update-us` / `--write-form`) with status and evidence.
5. Cross-cutting decisions → prepend in `docs/decisions/YYYY-MM-DD.json`.

## Dogfooding in the IDE

```bash
cd app-visual-studio && pnpm install && pnpm install:cursor
```

Open this repo in VS Code/Cursor → **Meridian: Open Board**. Delivery reads `.meridian/meridian.db` at repository root (bootstrap with `python3 .agent/scripts/bootstrap_meridian_db.py .` if missing).
