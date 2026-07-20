# Meridian dogfood docs

This folder is the **source of truth for phase documents** of the Meridian kit + extension (dogfood at **repository root**). Delivery (epics, versions, sprints, US) lives in **`.meridian/meridian.db`** — not under `docs/`.

## Repository (Meridian kit)

| File                                                                                                 | Role                                                                                                               |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| [`../README.md`](../README.md)                                                                       | Repository onboarding (Git/GitHub)                                                                                 |
| [`../.agent/MERIDIAN.md`](../.agent/MERIDIAN.md)                                                     | Master protocol for agents                                                                                         |
| [`../.agent/rules/MERIDIAN.md`](../.agent/rules/MERIDIAN.md)                                         | Global rules (`trigger: always_on`)                                                                                |
| [`../.agent/ARCHITECTURE.md`](../.agent/ARCHITECTURE.md)                                             | Map of agents, skills, and workflows                                                                               |
| [`../.agent/references/instruction-surfaces.md`](../.agent/references/instruction-surfaces.md)       | **Where to edit** when protocol changes                                                                            |
| [`../.agent/references/usage-guide.md`](../.agent/references/usage-guide.md)                         | Day-to-day guide                                                                                                   |
| [`../.agent/references/plans/markdown-audit-v11.md`](../.agent/references/plans/markdown-audit-v11.md) | Markdown audit checklist (onda G)                                                                                  |
| [`../.agent/references/plans/agent-roster-and-workflow-v11.md`](../.agent/references/plans/agent-roster-and-workflow-v11.md) | Agent roster redesign (onda H) |

## Phase documents (system axis)

| Document                                   | Status   | Purpose                                      |
| ------------------------------------------ | -------- | -------------------------------------------- |
| [00_scope.md](00_scope.md)                 | approved | Product scope and boundaries                 |
| [01_tech_stack.md](01_tech_stack.md)       | approved | React, TypeScript, extension, kit scripts    |
| [02_security.md](02_security.md)           | approved | Security model                               |
| [03_user_types.md](03_user_types.md)       | approved | Usage profiles                               |
| [04_principles.md](04_principles.md)       | approved | Implementation principles                    |
| [05_architecture.md](05_architecture.md)   | approved | Kit + extension architecture                 |
| [06_database.md](06_database.md)           | draft    | SQLite delivery schema                       |
| [07_api_contracts.md](07_api_contracts.md) | draft    | Extension ↔ kit script contracts             |
| [08_environments.md](08_environments.md)   | approved | Local commands and CI                        |
| [09_design_system.md](09_design_system.md) | review   | UI contract — Harness webviews (`design-system-owner`) |
| [11_decisions.md](11_decisions.md)         | approved | Stub — log rules (entries in `decisions/`)   |

## Delivery artifacts

| Artifact      | Location | Role |
| ------------- | -------- | ---- |
| Epics, versions, sprints, user stories | `.meridian/meridian.db` | **Canonical delivery** (v11) |
| Kit templates | `.agent/references/templates/` | Agent contracts |
| Decision log  | [`decisions/`](decisions/) | One JSON per day |
| Phase docs    | `00_scope.md` … `11_decisions.md` | Gates, architecture, design |

There is **no** `docs/us/`, `docs/epics/`, or `docs/kanban/board.json`. Board reads SQLite via `meridian_db_export.py --format planning`.

**Board columns (computed in the extension, not DB fields):** 📋 Backlog (`status: ❌`, `ready: false`) · 📌 Todo (`ready: true`, still `❌`) · 🔶 Partial · 🧪 Tests · ✅ Done · toggles 🧊 Frozen · 🚫 Deprecated. Detail: [05_architecture.md](05_architecture.md) and [.agent/MERIDIAN.md](../.agent/MERIDIAN.md) status rules.

## Work order

| Phase                | Where                             | Axis     |
| -------------------- | --------------------------------- | -------- |
| 0 — Foundation       | 11, 00–03                         | System   |
| 1 — Principles       | 04, 09 (design)                   | System   |
| 2 — Architecture     | 05, 06–08                         | System   |
| Backlog              | `meridian_delivery.py list`       | Delivery |
| Execution            | `.meridian/meridian.db`           | Delivery |

US gate: `05_architecture` approved + epic/version exist in SQLite + `ready: true` for `/implement-us`.

**US lifecycle:** `/create-us` → `/refine-us` → `/implement-us` (`developer`) → `/complete-us` → commit (human).

Validate: `python3 .agent/scripts/validate_meridian.py . --sqlite-only`

## How agents should work

See: [Start here](../.agent/references/start-here.md) · [Usage guide](../.agent/references/usage-guide.md) · [Agents help](../.agent/references/agents-help.md) · `/daily-with-ai`

### Daily loop (manager + AI)

1. **Orient** — `/status`; VS Code **Meridian: Open Board**; pick an unblocked Must US.
2. **Create/refine** — `/create-us` then `/refine-us US-XXXX` until `ready: true`.
3. **Contextualize** — `meridian_delivery.py show US-XXXX --full`.
4. **Implement** — `/implement-us US-XXXX` after gate; review diff.
5. **Close** — `/complete-us US-XXXX` (Record + `✅`); board refreshes on DB save.
6. **Commit** — one commit per US per `commit-after-us-close.md`.

## Dogfooding in the IDE

```bash
cd app-visual-studio && pnpm install && pnpm install:cursor
```

Open this repo in VS Code/Cursor → **Meridian: Open Board**. Bootstrap: `python3 .agent/scripts/bootstrap_meridian_db.py .`
