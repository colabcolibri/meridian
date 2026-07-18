# Agents & commands help

Explicit map of **who does what**, **which group they belong to**, and **which step to run** in Meridian.

| Read first | File |
| ---------- | ---- |
| Concepts (phases, US, gates) | [start-here.md](./start-here.md) |
| Day-to-day situations | [usage-guide.md](./usage-guide.md) |
| **This file** | Agents, slash commands, skills, step order |
| Scrum mapping | [scrum-meridian-map.md](./scrum-meridian-map.md) |

---

## How the harness is layered

```txt
Human (manager)
    ↓ approves direction, sets approved / ✅
Slash command (/create-us)  →  opens workflow in .agent/workflows/
    ↓ assigns persona
Agent (@backlog-refiner)       →  .agent/agents/{name}.md
    ↓ executes procedure
Skill (create-user-story)   →  .agent/skills/{name}/SKILL.md
    ↓ writes artifacts
docs/                       →  phase docs + SQLite delivery (.meridian/meridian.db)
```

| Layer | Role | You invoke |
| ----- | ---- | ---------- |
| **Workflow** | Step-by-step recipe for one command | `/status`, `/create-us` |
| **Agent** | Domain persona with gates and output format | Automatic routing or `@agent-name` |
| **Skill** | Repeatable procedure (templates, scripts) | Used by agent — rarely typed by human |

**Routing:** describe the task in chat → agent announces `Applying knowledge from @[agent]…`. Override with `@scrum-master`, `@backlog-refiner`, `@developer`, etc. Legacy chat slugs: `meridian-routing` alias table (IDE `@` picklist: use v11 slugs — see `agent-aliases-h2.md`).

**Priority:** P0 rules → MERIDIAN.md → agent → skill → templates.

---

## Agent groups

Nine agents in **five Scrum-aligned groups**. One agent may delegate to another when the domain shifts.

### Group 1 — Scrum Master (process)

Facilitates the protocol. Gates phases, reports blockers — **never product code or US close**.

| Agent | Serves for | Primary artifacts | Does not |
| ----- | ---------- | ----------------- | -------- |
| **`scrum-master`** | Project health, `/status`, `/init-meridian`, `/daily-with-ai` | All `docs/` (read), decision log | Implement US; approve docs; mark ✅ |

**Skills:** `init-project`, `update-decisions-log`, `meridian-routing`

---

### Group 2 — Product Owner (discovery + scope + epic)

Defines *what* and *why* before executable backlog.

| Agent | Serves for | Primary artifacts | Does not |
| ----- | ---------- | ----------------- | -------- |
| **`product-owner`** | Discovery, scope, epics | `docs/discovery/`, `00_scope`, SQLite `epics` | US rows; implement code |

**When to use:** `/discover`, `00_scope`, `/create-epic`, “is this in scope?”

**Skills:** `discover-product`, `create-epic`, `init-project`, `update-decisions-log`, `meridian-routing`

---

### Group 3 — Enablers (docs, security, architecture, design)

Foundation before backlog and code.

| Agent | Serves for | Primary artifacts |
| ----- | ---------- | ----------------- |
| **`technical-writer`** | Phase docs `01`–`08`, `11` | `docs/01_*` … `docs/08_*` |
| **`security-champion`** | Threat model, secrets, OWASP | `docs/02_security.md` |
| **`technical-architect`** | System boundaries, gate `05` | `docs/05_architecture.md`, `docs/architecture/` |
| **`design-system-owner`** | UI contract | `docs/09_design_system.md` |

**When to use:** phase doc drafts; `/security-pass`, `/architecture`, `/design-pass`

**Gate:** `05_architecture.md` **`approved`** before epics/US.

---

### Group 4 — Sprint planning

Releases and time-boxes.

| Agent | Serves for | Primary artifacts |
| ----- | ---------- | ----------------- |
| **`sprint-planner`** | Versions, sprints, go-live | SQLite `versions`, `sprints` |

**When to use:** `/create-version`, `/plan-sprint`, `/complete-sprint`

---

### Group 5 — Backlog refinement + Development Team

| Agent | Serves for | Primary artifacts | Does not |
| ----- | ---------- | ----------------- | -------- |
| **`backlog-refiner`** | US create → review → refine → close | SQLite `user_stories` | Product code |
| **`developer`** | `/implement-us` after `ready: true` | Product code per US Plan | Close US; create US |

**When to use:** `/create-us`, `/refine-us`, `/complete-us` → refiner; `/implement-us` → developer.

---

## Slash command groups

Slash command groups — workflows in **six groups**. Each maps to one primary agent (sometimes two).

### Group A — Bootstrap

| Step | Command | Agent | What it does |
| ---- | ------- | ----- | ------------ |
| A1 | **`/init-meridian`** | `scrum-master` | Creates `docs/` tree, initial scope, decision log, bootstraps `meridian.db`. **Mode B:** also `docs/inventory/as-is.md`. **No product code.** |

---

### Group B — Session & orientation

| Step | Command | Agent | What it does |
| ---- | ------- | ----- | ------------ |
| B1 | **`/status`** | `scrum-master` | Read-only health: kit root, Meridian projects (multi-`docs/` repos), active product, phase doc statuses, US counts, blockers. |
| B2 | **`/daily-with-ai`** | `scrum-master` | Guided session: status → pick story → implement → close. |
| B3 | **`/agents-help`** | `scrum-master` | Opens this reference; summarizes groups and current-step hints. |

---

### Group C — Phase documents (structure)

Complete in order: `00` → `01` → `02` → `03` → `04` → **`05`** → `06` → `07` → `08`.

| Step | Command | Agent | Target | What it does |
| ---- | ------- | ----- | ------ | ------------ |
| C0 | **`/discover`** | `product-owner` | `docs/discovery/` | Product brief, epic candidates |
| C1 | *(conversation)* | `product-owner` | `00_scope.md` | Scope, users, out of scope |
| C2 | *(conversation)* | `technical-writer` | `01`, `03`, `04`, `06`–`08`, `11` | Draft phase documents |
| C3 | **`/security-pass`** | `security-champion` | `02_security.md` | Threat model, secrets, OWASP |
| C4 | **`/architecture`** | `technical-architect` | `05` + `docs/architecture/` | Gate before backlog |
| C5 | **`/design-pass`** | `design-system-owner` | `09_design_system.md` | UI contract (recommended for UI US) |

**Human gate:** you set `status: approved` on each doc. Agent never sets `approved`.

---

### Group D — Backlog artifacts

**Prerequisite:** `05_architecture.md` is **`approved`**.

| Step | Command | Agent | Output | What it does |
| ---- | ------- | ----- | ------ | ------------ |
| D1 | **`/create-epic`** | `product-owner` | SQLite `epics` row | Product capability block. |
| D2 | **`/create-version`** | `sprint-planner` | SQLite `versions` row | Release grouping epics/US. |
| D3 | **`/plan-sprint`** | `sprint-planner` | SQLite `sprints` row | Time-boxed goal + story list. |
| D4 | **`/complete-sprint vX-SY`** | `sprint-planner` | sprint `status: complete` | Sprint review + Retrospective filled. |

Order: **Epic → Version → Sprint** (sprint optional but recommended) → User story → **`/complete-sprint`** when increment delivered.

Epic/version **close:** set `status: complete` manually when outcome reached (no `/complete-epic` workflow).

---

### Group E — User story lifecycle

| Step | Command | Agent | US state after | What it does |
| ---- | ------- | ----- | -------------- | ------------ |
| E1 | **`/create-us`** | `backlog-refiner` | `ready: false` | New US: Intent + draft Plan. |
| E2 | **`/review-us US-XXXX`** | `backlog-refiner` | unchanged | Read-only quality audit. No `ready` change. |
| E3 | **`/refine-us US-XXXX`** | `backlog-refiner` | `ready: true` | Approach, arch refs, concrete tests. **Gate for code.** |
| E4 | **`/implement-us US-XXXX`** | `developer` | — | Gate: `ready: true`, deps, Plan; then product code. **Block if not refined.** |
| E5 | *(manager review)* | human | — | Review diff and run tests. |
| E6 | **`/complete-us US-XXXX`** | `backlog-refiner` | `status: ✅` | Fills Record, checks acceptance, updates SQLite. |

**Rules:** no code without E3 (`ready: true`) **and** E4 gate. No ✅ without E6 (`## Record` + evidence).

---

### Group F — Decisions & validation

| Step | Command / action | Agent / tool | What it does |
| ---- | ---------------- | ------------ | ------------ |
| F1 | **`/update-decisions-log`** | any + skill | Read skill; run `date +"%Y-%m-%d"` + `date +"%H:%M"`; prepend `docs/decisions/YYYY-MM-DD.json`. Never edit old entries. |
| F2 | **`validate_meridian.py`** | script | `python3 .agent/scripts/validate_meridian.py <project-root> --sqlite-only` — structure, US contracts, phase docs. |
| F3 | **Meridian: Validate Project** *(extension)* | IDE command | Same validator from VS Code/Cursor sidebar. |

---

## End-to-end steps (numbered)

Use this as the canonical sequence. Skip steps only when the artifact already exists and is approved.

```txt
 1. /init-meridian                          [Group A]  scrum-master
 2. /discover (optional)                    [Group C]  product-owner
 3. Complete 00_scope → approve             [Group C]  product-owner
 4. Complete 01, 03, 04 (draft → approve)  [Group C]  technical-writer
 5. /security-pass → approve 02             [Group C]  security-champion
 6. /architecture → approve 05              [Group C]  technical-architect  ← GATE
 7. /design-pass → approve 09 (if UI)      [Group C]  design-system-owner
 8. Complete 06, 07, 08 as needed          [Group C]  technical-writer
 9. /create-epic                            [Group D]  product-owner
10. /create-version                         [Group D]  sprint-planner
11. /plan-sprint                            [Group D]  sprint-planner
12. /create-us                               [Group E]  backlog-refiner
13. /review-us US-XXXX                       [Group E]  backlog-refiner  (optional)
14. /refine-us US-XXXX                       [Group E]  backlog-refiner  → ready: true
15. /implement-us US-XXXX                    [Group E]  developer → gate then code
16. Manager review diff + tests              [Group E]  human
17. /complete-us US-XXXX                     [Group E]  backlog-refiner
18. git commit (human)                       [Group F]  you — one US per commit
19. /status or /daily-with-ai                [Group B]  scrum-master → back to step 12
20. /complete-sprint vX-SY (when sprint done) [Group D]  sprint-planner
```

---

## Skill groups

Skills are procedures agents load automatically. Grouped by purpose.

### Governance & routing

| Skill | Used by | Purpose |
| ----- | ------- | ------- |
| `meridian-routing` | all agents | Pick correct agent from intent |
| `init-project` | scrum-master, product-owner, technical-writer | Bootstrap `docs/` |
| `update-decisions-log` | most agents | Prepend decision JSON (real `date` commands) |

### Delivery authoring

| Skill | Used by | Purpose |
| ----- | ------- | ------- |
| `create-epic` | product-owner | Epic row from template |
| `create-version` | sprint-planner | Version file |
| `create-sprint` | sprint-planner | Sprint file |
| `complete-sprint` | sprint-planner | Sprint close + Retrospective |
| `create-user-story` | backlog-refiner | US row in SQLite at create |

### User story quality & close

| Skill | Used by | Purpose |
| ----- | ------- | ------- |
| `review-user-story` | backlog-refiner | Read-only US audit |
| `refine-user-story` | backlog-refiner | Approach + `ready: true` |
| `implement-user-story` | developer | Gate + implement when `ready: true` |
| `complete-user-story` | backlog-refiner | Record + ✅ in SQLite |
| `design-system` | design-system-owner | `09_design_system` pass |

### Security

| Skill | Used by | Purpose |
| ----- | ------- | ------- |
| `security-review` | security-champion, technical-architect | Security doc pass |
| `sqlite-delivery-operations` | backlog-refiner, sprint-planner, product-owner | **Read before** any delivery Write |

---

## Intent → agent quick lookup

| You want to… | Group | Agent | Command |
| ------------ | ----- | ----- | ------- |
| Start or migrate project | A | `scrum-master` | `/init-meridian` |
| See blockers and next step | B | `scrum-master` | `/status` |
| Full guided day | B | `scrum-master` | `/daily-with-ai` |
| Open this manual | B | `scrum-master` | `/agents-help` |
| Discovery / scope / epic | C | `product-owner` | `/discover`, `/create-epic`, `00_scope` |
| Draft phase docs | C | `technical-writer` | chat |
| Security doc | C | `security-champion` | `/security-pass` |
| Architecture doc | C | `technical-architect` | `/architecture` |
| Design system | C | `design-system-owner` | `/design-pass` |
| New version / sprint | D | `sprint-planner` | `/create-version`, `/plan-sprint`, `/complete-sprint` |
| New / refine / close US | E | `backlog-refiner` | `/create-us`, `/refine-us`, `/complete-us` |
| Implement US | E | `developer` | `/implement-us` |
| Log a decision | F | any | `/update-decisions-log` |
| Validate structure | F | script / extension | `validate_meridian.py` or **Validate Project** |

---

## IDE extension commands (separate layer)

These are **not** agents. They read the **active** `docs/` in the editor (extension `app-visual-studio`). In monorepos, **one active project** at a time — see [usage-guide.md § Multiple Meridian projects](./usage-guide.md#multiple-meridian-projects).

| Group | Command | Purpose |
| ----- | ------- | ------- |
| Views | **Open Board**, **Open Versions**, **Open Sprints**, **Open Epics** | Read-only planning UI; **Project** row in toolbar shows name + `docs/` path |
| Governance | **Select Active Project**, **Validate Project**, **Show Workspace Status** | Switch product (saved); validate `packageRoot`; list all projects |
| Help | **Open Command Help**, **Open Agents Help** | Extension catalog; kit `agents-help.md` at runtime |

**Multi-product UI:** Board and Deliverables show which `docs/` is loaded; dropdown switches product and refreshes open tabs. Status bar shows project name when N>1. Install: Marketplace **Meridian Harness** or `pnpm install:cursor` in `app-visual-studio/`.

---

## Invocation cheat sheet

| Method | Example | When |
| ------ | ------- | ---- |
| Slash command | `/refine-us US-0017` | Known workflow step |
| Explicit agent | `@backlog-refiner refine US-0017` | Override routing |
| Natural language | “Implement US-0017” | Run `/implement-us US-0017` if `ready: true`; else block |
| Read-only check | `/status` | Start of every session |

---

## Related files

| Path | Content |
| ---- | ------- |
| `.agent/agents/*.md` | Full agent procedures |
| `.agent/workflows/*.md` | Full slash command recipes |
| `.agent/skills/*/SKILL.md` | Skill procedures |
| `.agent/references/usage-guide.md` | Situation-based how-to |
| `.agent/references/start-here.md` | Concepts and artifact anatomy |
