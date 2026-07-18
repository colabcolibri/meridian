# Meridian agent architecture

> Structure of agents, skills, workflows, rules and scripts — Antigravity pattern adapted to the Meridian protocol.

---

## Purpose

| Layer | File | Audience |
| ------ | ------- | ------- |
| Kit monorepo | `README.md` | Humans (GitHub, onboarding) |
| Portable kit | `.agent/` | Copy to client projects; Antigravity, ag-kit, Cursor, Claude Code |
| IDE adapters | `.cursor/`, `.claude/`, `.agents/skills/`, `.codex/` (local, gitignored) | Cursor, Claude Code, Codex (symlinks + generated TOMLs → `.agent/`) — see [IDE_ADAPTERS.md](./IDE_ADAPTERS.md) |
| Always-on rules | `.agent/rules/meridian.mdc` + `.agent/rules/MERIDIAN.md` | Agents |
| Master protocol | `.agent/MERIDIAN.md` | Full governance |
| Operations | `.agent/agents`, `skills`, `workflows` | Personas and procedures |
| Human references | `.agent/references/` | `start-here`, `usage-guide`, `agents-help`, `instruction-surfaces`, `scrum-meridian-map`, optional `scrum-guide-complete` |

The VS Code extension (`app-visual-studio/`) monitors Meridian projects; it is not the source of truth. Help UI copy lives in `app-visual-studio/src/help-webview-html.ts` and `command-catalog.ts` — see [instruction-surfaces.md](./references/instruction-surfaces.md) when the protocol changes.

### Why `.agent` and `.cursor`?

- **`.agent/`** — Antigravity convention; copyable to projects and other tools.
- **`.cursor/`** — **local** adapter (generated symlinks; **do not commit**).

**Edit in `.agent/`** and run `./.agent/scripts/sync_cursor_kit.sh` to recreate adapters in `.cursor/`, `.claude/`, and Codex paths (required after clone).

---

## Directory structure

```txt
.agent/                    # canonical source (Antigravity / distribution)
  MERIDIAN.md
  rules/MERIDIAN.md
  agents/
  skills/
  workflows/
  scripts/
    lib/                   # meridian_db, parsers, contracts, form, implement_gate
    migrate/               # v1 → SQLite one-shot
    test/                  # smoke tests (root shims for CI)
    dev/                   # meridian-teste seed
    meridian_delivery.py     ← agent facade (reads delivery.json)
    meridian_db_cli.py       ← sqlite driver (implementation)
    validate_meridian.py
    sync_cursor_kit.sh
  references/templates/      # delivery templates (INDEX, writing-guide, section-contracts, …)

.cursor/                   # Cursor adapter (local, gitignored — sync_cursor_kit.sh)
  rules/meridian.mdc       # alwaysApply
  skills/
  agents/
  commands/                # workflows as slash commands
```

---

## Rule priority

```txt
P0  .agent/rules/MERIDIAN.md
P1  .agent/MERIDIAN.md + .agent/agents/{agent}.md
P2  .agent/skills/{skill}/SKILL.md (+ references on demand)
```

Workflows orchestrate agents; they do not replace the master protocol.

---

## Agents (v11 Scrum roster)

| Agent | Purpose | Skills |
| ----- | ------- | ------ |
| `scrum-master` | Process, status, init — **no product code** | init-project, update-decisions-log, meridian-routing |
| `product-owner` | Discovery, `00_scope`, epics | discover-product, create-epic, init-project, update-decisions-log, meridian-routing |
| `technical-writer` | Phase docs `01`–`08`, `11` | init-project, update-decisions-log, meridian-routing |
| `security-champion` | `02_security.md` | security-review, update-decisions-log, meridian-routing |
| `technical-architect` | `05_architecture.md` | security-review, update-decisions-log, meridian-routing |
| `design-system-owner` | `09_design_system.md` | design-system, update-decisions-log, meridian-routing |
| `sprint-planner` | SQLite `versions`, `sprints` | create-version, create-sprint, complete-sprint, … |
| `backlog-refiner` | US lifecycle (not implement) | create-user-story, review-user-story, refine-user-story, complete-user-story, … |
| `developer` | `/implement-us` gate + code | implement-user-story, update-decisions-log, meridian-routing |

**Agents:** 9 v11 slugs in `.agent/agents/` — no legacy files or chat aliases (H3 ✅).

Each agent includes: phases 0/-1, mission, prohibitions, output format, delegation.

---

## Skills

| Skill | References |
| ----- | ---------- |
| `init-project` | `doc-templates.md`, `gitignore-baseline.md` |
| `create-epic` | `epic-template.md`, `writing-guide.md` |
| `create-version` | `version-template.md`, `writing-guide.md` |
| `create-sprint` | `sprint-template.md` |
| `complete-sprint` | `sprint-template.md` |
| `create-user-story` | `us-template.md`, `writing-guide.md` |
| `review-user-story` | `review-checklist.md`, `writing-guide.md` |
| `refine-user-story` | `refine-checklist.md`, `writing-guide.md` |
| `implement-user-story` | `implement-gate-checklist.md` |
| `complete-user-story` | `implementation-template.md` |
| `update-decisions-log` | `decision-template.md`, `decision-schema.md` |
| `security-review` | `checklists.md` |
| `design-system` | `design-system-checklist.md` |
| `meridian-routing` | — (inline matrix) |

**Agent mirror:** all delivery templates are symlinked under `.agent/references/templates/` with registry `INDEX.md`. Agents must read INDEX + full template before Write — see each agent's **Template protocol** section.

See `.agent/skills/doc.md` to create new skills.

---

## Workflows

| Workflow | Agent | Mode |
| -------- | ----- | ---- |
| `init-meridian` | scrum-master | init, no code |
| `status` | scrum-master | read-only |
| `plan-sprint` | sprint-planner | planning |
| `create-version` | sprint-planner | create release in SQLite |
| `create-us` | backlog-refiner | create US |
| `review-us` | backlog-refiner | audit US — report only |
| `refine-us` | backlog-refiner | refine US before implement |
| `implement-us` | developer | gate + implement when `ready: true` |
| `complete-us` | backlog-refiner | close US after implementation |
| `create-epic` | product-owner | create epic in SQLite |
| `architecture` | technical-architect | doc 05 |
| `security-pass` | security-champion | doc 02 |
| `design-pass` | design-system-owner | doc 09 |
| `discover` | product-owner | discovery brief |
| `migrate-delivery` | scrum-master | v1 Markdown → SQLite |
| `daily-with-ai` | scrum-master | daily manager + AI routine |

All support `$ARGUMENTS` and a critical rules section.

---

## Scripts

```bash
# Structure + semantic validation
python3 .agent/scripts/validate_meridian.py <project-root>
python3 .agent/scripts/validate_meridian.py <project-root> --sqlite-only
python3 .agent/scripts/validate_meridian.py <project-root> --json   # CI

# Delivery CLI (facade + sqlite driver)
python3 .agent/scripts/meridian_delivery.py counts
python3 .agent/scripts/meridian_delivery.py create-epic --title "..." --versions "[v1]"
python3 .agent/scripts/meridian_delivery.py create-version --id v1 --title "..."
python3 .agent/scripts/meridian_delivery.py create-sprint --version v1 --title "..."

# Legacy v1 import (one-shot) — /migrate-delivery or:
python3 .agent/scripts/migrate_md_to_sqlite.py <project-root>

# Legacy v1 import (one-shot) — see scripts/migrate/
python3 .agent/scripts/migrate_md_to_sqlite.py <project-root>

# IDE adapters (after clone or kit changes)
./.agent/scripts/sync_cursor_kit.sh
```

---

## Authority

1. User instruction
2. `.agent/MERIDIAN.md`
3. `.agent/rules/MERIDIAN.md`
4. Workflows
5. Agents
6. Skills

---

## Difference vs Antigravity kit

| Antigravity | Meridian |
| ----------- | -------- |
| `README.md` + `rules/GEMINI.md` | `README.md` (kit repo) + `.agent/` + `rules/MERIDIAN.md` |
| 37 code/stack skills | 10 document governance skills |
| `intelligent-routing` (technical domains) | `meridian-routing` (docs/US phases) |
| Plan files `{task-slug}.md` | `docs/` phases `00`–`11` + US |
| Long agents for implementation | Agents for documentation and gates before code |
