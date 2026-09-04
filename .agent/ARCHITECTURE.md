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
| Human references | `.agent/references/` | `INDEX.md`, `guides/`, `protocol/`, `agents/`, `scrum/`, `templates/` |

The VS Code extension (`app-visual-studio/`) is the optional monitor for Meridian folders; it is not the source of truth. Help panels read `.agent/references/guides/` and `.agent/references/protocol/` at runtime — see [instruction-surfaces.md](./references/protocol/instruction-surfaces.md) when the protocol changes.

### Why `.agent` and `.cursor`?

- **`.agent/`** — Antigravity convention; copyable to projects and other tools.
- **`.cursor/`** — **local** adapter (generated symlinks; **do not commit**).

**Edit in `.agent/`** and run `./.agent/scripts/sync_kit.sh` to recreate adapters in `.cursor/`, `.claude/`, Codex paths, and `.opencode/` (required after clone).

---

## Directory structure

```txt
.agent/                    # canonical source (Antigravity / distribution)
  MERIDIAN.md
  rules/MERIDIAN.md
  agents/                    # {slug}/agent.md + references/
    README.md
  skills/
  workflows/
  scripts/
    validate_meridian.py
    migrate_us_v2_structure.py
    sync_kit.sh
  references/                # INDEX, guides/, protocol/, agents/, scrum/, templates/, plans/

.cursor/                   # Cursor adapter (local, gitignored — sync_kit.sh)
  rules/meridian.mdc       # alwaysApply
  skills/
  agents/
  commands/                # workflows as slash commands

.opencode/                 # OpenCode adapter (local, gitignored — sync_kit.sh)
  commands/                # workflows as slash commands
  agents/                  # kit agents (generated frontmatter)
  skills/                  # kit skills
```

---

## Rule priority

```txt
P0  .agent/rules/MERIDIAN.md
P1  .agent/MERIDIAN.md + .agent/agents/{agent}/agent.md
P2  .agent/skills/  (+ agent `references/` symlinks → skills)
      + references/templates/         artifact structure (canonical)
```

Workflows orchestrate agents; they do not replace the master protocol.

---

## Agents

Sixteen stations. Each agent lists **skills** in frontmatter (domain + shared). Procedures live in `.agent/skills/`. See [station-references.md](./references/protocol/station-references.md).

| Agent | Purpose | Shared skills |
| ----- | ------- | ------------- |
| `deus-ex` | Allocate next station (pass only) | meridian-routing, update-decisions-log |
| `product-owner` | `00_scope`, discovery, epics | discover-product, init-project, update-decisions-log, meridian-routing |
| `technical-writer` | Phase docs `01`, `04`, `11`; SEO operator | init-project, update-decisions-log, meridian-routing |
| `ux-researcher` (Iris) | `03_user_types`, `/ux-pass` | discover-product, update-decisions-log, meridian-routing |
| `data-engineer` (Mnemosyne) | `06_database.md` | update-decisions-log, meridian-routing |
| `devops-engineer` (Vulcan) | `08_environments.md` | update-decisions-log, meridian-routing |
| `security-champion` (Janus) | `02`, security passes | update-decisions-log, meridian-routing |
| `technical-architect` (Daedalus) | `05`, `07`, `/api-pass`, MCP | update-decisions-log, meridian-routing |
| `design-system-owner` (Harmonia) | `09`, design/i18n/a11y passes | update-decisions-log, meridian-routing |
| `quality-owner` (Themis) | `10`, test/perf passes | update-decisions-log, meridian-routing |
| `sprint-planner` (Hesperus) | versions, sprints, epic close | update-decisions-log, meridian-routing |
| `story-maker` (Penelope) | US create + refine | update-decisions-log, meridian-routing |
| `story-checker` (Argus) | US review + complete | update-decisions-log, meridian-routing |
| `developer` (Hephaestus) | `/implement-us` | update-decisions-log, meridian-routing |
| `scrum-master` (Kairos) | Governance, status, init | init-project, update-decisions-log, meridian-routing |
| `code-investigator` (Hermes) | `/investigate` read-only | update-decisions-log, meridian-routing |

Each agent includes: phases 0/-1, mission, **station references**, prohibitions, output format, delegation.

---

## Skills (`.agent/skills/`)

Domain procedures (e.g. `us-create`, `data-engineering`, `design-system`) and shared utilities (`meridian-routing`, `update-decisions-log`, …). Each station's `agent.md` declares which skills to load.

**Agent mirror:** `agents/{slug}/references/{skill}/` symlinks → `skills/{skill}/` for template registry paths.

See `.agent/skills/doc.md` and `create-meridian-artifact` to extend the kit.

---

## Workflows (optional aliases)

| Workflow | Agent | Mode |
| -------- | ----- | ---- |
| `deus-ex` | deus-ex | dispatch next station — do not execute it |
| `init-meridian` | scrum-master | init, no code |
| `status` | scrum-master | read-only |
| `plan-sprint` | sprint-planner | planning |
| `create-version` | sprint-planner | create release in SQLite |
| `create-us` | story-maker | create US |
| `review-us` | story-checker | audit US; may set `ready` |
| `refine-us` | story-maker | refine US; must not set `ready` |
| `implement-us` | developer | gate + implement when `ready: true` |
| `complete-us` | story-checker | close US after implementation (+ lifecycle cascade invite) |
| `complete-sprint` | sprint-planner | close sprint + retrospective |
| `complete-epic` | sprint-planner | close epic + outcome |
| `create-epic` | product-owner | create epic in SQLite |
| `architecture` | technical-architect | doc 05 |
| `security-pass` | security-champion | doc 02 |
| `privacy-pass` | security-champion | LGPD + GDPR in 02 |
| `security-review` | security-champion | code vs 02 — report only |
| `dependency-audit` | security-champion | supply chain — report only |
| `ux-pass` | ux-researcher | doc 03 / discovery |
| `database-pass` | data-engineer | doc 06 |
| `release-pass` | devops-engineer | doc 08 — human deploy |
| `design-pass` | design-system-owner | doc 09 |
| `design-flow` | design-system-owner | screen flows / IA — doc 09 |
| `design-theme` | design-system-owner | theme + type ramp — doc 09 |
| `design-showcase` | design-system-owner | showcase plan |
| `design-review` | design-system-owner | UI audit — report only |
| `test-pass` | quality-owner | doc 10 |
| `test-review` | quality-owner | tests audit — report only |
| `seo-pass` | seo-strategy | doc 12 (public web) |
| `investigate` | code-investigator | read-only code trace — report only |
| `discover` | product-owner | product brief — no code |
| `document-project` | technical-writer | brownfield phase docs — no US |
| `audit-docs` | technical-writer | phase doc audit — report only |
| `daily-with-ai` | scrum-master | daily manager + AI routine |

All support `$ARGUMENTS` and a critical rules section.

---

## Scripts

```bash
# Structure + semantic validation (US Plan/Record, epic prose, board sync hints)
python3 .agent/scripts/validate_meridian.py <project-root>
python3 .agent/scripts/validate_meridian.py <project-root> --json   # CI

# One-time US schema migration (flat sections → Intent/Plan/Record/Boundaries)
python3 .agent/scripts/migrate_us_v2_structure.py <project-root>
python3 .agent/scripts/migrate_us_v2_structure.py <project-root> --restore-preamble

# IDE adapters (after clone or kit changes)
./.agent/scripts/sync_kit.sh
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
