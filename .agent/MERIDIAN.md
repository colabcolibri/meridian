# Meridian — documentation-driven development protocol

> Define the meridian before writing code.

This file is the **master manifest**: principles, gates, and where to read operational detail.
It is **not** the structural contract for epics, versions, or user stories — use templates for that.

In the kit monorepo, [`README.md`](../README.md) is human onboarding; `.agent/` is the portable kit for agents.

**Protocol version:** 2.0 (US schema: Intent / Plan / Record / Boundaries)

---

## 1. What Meridian is

Meridian is a documentation-driven protocol for building software with AI agents.

- **Documentation is the project** — code implements what is documented.
- **The person is manager** — agents execute; humans approve maturity and direction.
- **Files are the source of truth** — not chat, not a dashboard, not manually edited board JSON.
- **Works with Markdown + JSON only** — apps and extensions are optional monitors.

Meridian is not a mesh of autonomous agents. It is a minimal, auditable flow.

---

## 2. Core principles

| # | Principle |
| - | --------- |
| 1 | Documentation precedes product code |
| 2 | Status reflects evidence, not optimism |
| 3 | Decisions live in `docs/decisions/YYYY-MM-DD.json` (prepend; never edit old entries) |
| 4 | `docs/kanban/board.json` is **derived** from `docs/us/*.md` — never the primary source |
| 5 | Simplicity over bureaucracy — use agents/skills for detail, not duplicate specs here |

---

## 3. Rule priority (agents)

```txt
P0  .agent/rules/MERIDIAN.md          always-on gates and routing
P1  .agent/MERIDIAN.md (this file)    manifest + phase order
      + .agent/agents/{agent}.md      domain procedures
P2  .agent/skills/{skill}/SKILL.md    task execution
      + references/templates/         artifact structure (canonical)
```

**Do not invent US/epic/version structure from this file alone.** Read `section-contracts.md` and the full template before Write.

---

## 4. Kit layout

See `.agent/ARCHITECTURE.md` for the full map. Minimum:

```txt
.agent/
  MERIDIAN.md              ← this manifest
  rules/MERIDIAN.md        ← P0 always-on
  ARCHITECTURE.md          ← kit structure
  agents/                  ← personas (board-keeper, process-manager, …)
  skills/                  ← procedures (create-user-story, …)
  workflows/               ← slash commands (/create-us, …)
  references/templates/    ← INDEX, section-contracts, us-template, …
  scripts/
    validate_meridian.py
    migrate_us_v2_structure.py   # one-off US schema migration
    sync_cursor_kit.sh

docs/                        ← target project source of truth
  00_scope.md … 11_decisions.md
  epics/  versions/  sprints/  us/  kanban/board.json  decisions/
  templates/                 ← symlinks to kit templates (human mirror)
```

**IDE adapters:** edit `.agent/`, run `./.agent/scripts/sync_cursor_kit.sh` for `.cursor/` and `.claude/`. Do not commit adapter folders. See [IDE_ADAPTERS.md](./IDE_ADAPTERS.md).

---

## 5. Phase documents (`00`–`11`)

### Frontmatter (all phase docs)

```yaml
---
title: Document name
status: draft | review | approved
version: 1.0
updated: YYYY-MM-DD
depends_on: []
blocks: []
---
```

**Maturity:** `draft → review → approved`. Relevant change returns to `review`. Dependents stay at `draft` until predecessors are `approved`.

### Dependency order

```txt
11_decisions + docs/decisions/     starts day 1; never blocks
00_scope                           unblocks all
01_tech_stack                      → 02, 04, 08
02_security                        → 03, 04
03_user_types                      → 04, 05, 06, 07
04_principles                      → 05
05_architecture                    → 06, 07, 08 + US creation gate
06_database                        → 07
07_api_contracts
08_environments
```

### Required content per document

**Do not duplicate here.** Read:

| Document | Agent | Template / skill |
| -------- | ----- | ---------------- |
| `00_scope.md` | `scope-architect` | `init-project` → `doc-templates.md` |
| `01_tech_stack.md` | `documentation-strategist` | `doc-templates.md` |
| `02_security.md` | `security-steward` | `doc-templates.md` + `security-review` |
| `03_user_types.md` | `documentation-strategist` | `doc-templates.md` |
| `04_principles.md` | `documentation-strategist` | `doc-templates.md` |
| `05_architecture.md` | `architecture-guardian` | `doc-templates.md` + `security-review` |
| `06_database.md` | `documentation-strategist` | `doc-templates.md` |
| `07_api_contracts.md` | `documentation-strategist` | `doc-templates.md` |
| `08_environments.md` | `documentation-strategist` | `doc-templates.md` |
| `11_decisions.md` | any | stub + `decision-template.md` |

---

## 6. Delivery artifacts (folders)

After `05_architecture` is `approved`:

| Artifact | Path | Create | Close |
| -------- | ---- | ------ | ----- |
| Epic | `docs/epics/EPIC-XX.md` | `/create-epic` | — |
| Version | `docs/versions/vX.md` | `/create-version` | go-live checklist |
| Sprint | `docs/sprints/vX-SY.md` | `/plan-sprint` | — |
| User story | `docs/us/US-XXXX.md` | `/create-us` | `/complete-us` |
| Board | `docs/kanban/board.json` | `/sync-board` | derived only |

Templates registry: `.agent/references/templates/INDEX.md`  
Canonical edit paths: `TEMPLATE_SOURCES.md`  
Prose quality: `writing-guide.md`  
Fixed headings: `section-contracts.md`  
Lifecycle: `lifecycle.md`

---

## 7. User stories — schema v2

US body uses **four phase groups** (validated by script + monitor):

```txt
## Intent       → Acceptance, Why, Where
## Plan         → Approach (optional at create, **required at refine**), Architecture refs, API/DB, Security, Related decisions, Planned
## Record       → Files, Backend, Frontend, Scripts/Docs, Executed
## Boundaries   → Out of scope for this story, Notes
```

Full template: `us-template.md`. Do not use flat `## Acceptance`, `## Context & constraints`, or `## Technical implementation` — legacy format.

### Frontmatter (required)

`id`, `title`, `epic`, `version`, `status`, `moscow`, `depends_on`, `done_when`, `tests`, `tests_status`

Strict US also require `ready: true | false`.

### Status rules

| Symbol | Meaning |
| ------ | ------- |
| ❌ | Not started |
| 🔶 | Partial — **Missing:** required in Intent/Acceptance |
| ✅ | Done — evidence + filled Record when applicable |
| 🧊 | Frozen for this version |

- `✅` requires proven acceptance; if `tests: required`, then `tests_status: done`, Plan/Planned `[x]`, Record/Executed filled.
- `✅` requires `## Record` with real paths in `### Files` (skill `complete-user-story`).
- US may leave ❌ only when all `depends_on` are ✅.

### US lifecycle

```txt
/create-us     → Intent + Plan draft, ready: false
/review-us     → optional audit (no edits, no ready)
/refine-us     → deepen Plan + Approach (required), ready: true
implement      → process-manager gate: ready + Plan filled
/complete-us   → Record + status ✅
/sync-board    → regenerate board.json
commit (human) → after close + board sync; one commit per US — see commit-after-us-close.md
```

Agent: `board-keeper`. Skills: `create-user-story`, `review-user-story`, `refine-user-story`, `complete-user-story`, `generate-board-json`.

---

## 8. Board JSON

Schema: `board-schema.md`. Generated from US frontmatter — never maintained by hand as source of truth.

```bash
python3 .agent/scripts/validate_meridian.py <project-folder>
python3 .agent/scripts/validate_meridian.py <project-folder> --json
```

---

## 9. Agents and routing

| Need | Agent | Entry |
| ---- | ----- | ----- |
| Status / gates | `process-manager` | `/status` |
| Scope | `scope-architect` | `/init-meridian` |
| Phase docs | `documentation-strategist` | — |
| Security | `security-steward` | `/security-pass` |
| Architecture | `architecture-guardian` | `/architecture` |
| Versions / sprints | `sprint-planner` | `/create-version`, `/plan-sprint` |
| US / board | `board-keeper` | `/create-us`, `/refine-us`, `/complete-us`, `/sync-board` |
| Auto-pick | `meridian-routing` skill | — |

Always announce: `🤖 Applying knowledge from @[agent-name]...` before specialized work.

### Agent may

Create drafts, suggest decisions, implement approved US, run tests, update docs, regenerate board, report blockers.

### Agent must not

- Start product code without minimum docs and US `ready: true`
- Create US before `05_architecture` approved and epic/version exist
- Mark `✅` without evidence or filled Record
- Edit old decision log entries
- Edit `board.json` as primary source
- Expose secrets or run destructive commands without confirmation

If documentation is missing, report: what blocks, why, smallest fix, offer draft.

---

## 10. Bootstrap

Use workflow `/init-meridian` and skill `init-project`. Two modes:

**Mode A — New project:** agent interviews user (up to 5 questions), creates `docs/` from answers.

**Mode B — Existing codebase:** agent reads code first, infers scope and tech, asks only what is unclear, populates phase docs from observations. All inferences marked as assumptions for human review.

Both modes:

1. Create `docs/` tree + `docs/decisions/YYYY-MM-DD.json`
2. Stub `11_decisions.md`; initial decision entry
3. Draft `00_scope.md`; populated, not blank
4. Follow dependency order for remaining phase docs
5. Empty `board.json`; add epics/versions after architecture approved
6. `.gitignore` before secrets or dependencies land

Human guide: `.agent/references/start-here.md`  
Operational guide: `.agent/references/usage-guide.md`

---

## 11. Pre-code checklist

Before product code for a US:

- [ ] `05_architecture` approved; epic and version exist
- [ ] Target US exists; `ready: true`
- [ ] `## Plan` filled (no placeholders); Architecture refs readable
- [ ] `depends_on` US all ✅
- [ ] Acceptance observable; tests planned if required

If any fail → `/refine-us` or phase doc work first.

---

## 12. Done checklist

Delivery is done when:

- Code matches US acceptance
- Build/lint/test passed as applicable
- Intent/Acceptance marked `[x]` (or `🔶` + Missing:)
- `## Record` filled (Files + layers + Executed when tests required)
- `tests_status: done` when `tests: required`
- `status: ✅` in frontmatter
- `board.json` regenerated
- Cross-cutting changes in decision log

**Repository (human, after the above):** one git commit per closed US — code + `docs/us/US-XXXX.md` + board/decisions in scope. Agents suggest message on close; they do not commit unless the manager explicitly asks. See `.agent/references/commit-after-us-close.md`.

---

## 13. Management tools

Meridian works without any app. Optional tools (e.g. app-desktop monitor) read the same folder — they are not the source of truth.

---

## 14. Operational phrase

> If it is not documented, it is not ready to be implemented.  
> If it has been implemented, it must be reflected in the documentation.  
> If an agent worked, the process manager must be able to audit what changed.
