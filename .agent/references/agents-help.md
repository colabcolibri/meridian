# Agents & commands help

Explicit map of **who does what**, **which group they belong to**, and **which step to run** in Meridian.

| Read first | File |
| ---------- | ---- |
| Concepts (phases, US, gates) | [start-here.md](./start-here.md) |
| Day-to-day situations | [usage-guide.md](./usage-guide.md) |
| Agentic trust / earned no-read policy | [agentic-trust-policy.md](./agentic-trust-policy.md) |
| Agentic quality model / qualitySiege profiles | [agentic-quality-model.md](./agentic-quality-model.md) |
| **This file** | Agents, slash commands, skills, step order |
| Scrum mapping | [scrum-meridian-map.md](./scrum-meridian-map.md) |
| **Station map** | [agent-station-map.md](./agent-station-map.md) — cook vs attest |
| **Areas** | [agent-areas.md](./agent-areas.md) — discovery, standards, planning, build, attest |

---

## How the harness is layered

```txt
Human (manager)
    ↓ approves direction, sets approved / ✅
Slash command (/create-us)  →  opens workflow in .agent/workflows/
    ↓ assigns persona
Agent (@story-maker / @story-checker)  →  .agent/agents/{name}.md
    ↓ executes procedure
Skill (us-create)           →  .agent/skills/{name}/SKILL.md
    ↓ writes artifacts
docs/                       →  source of truth
```

| Layer | Role | You invoke |
| ----- | ---- | ---------- |
| **Workflow** | Step-by-step recipe for one command | `/status`, `/create-us` |
| **Agent** | Domain persona with gates and output format | Automatic routing or `@agent-name` |
| **Skill** | Repeatable procedure (templates, scripts) | Used by agent — rarely typed by human |

**Routing:** describe the task in chat → agent announces `Applying knowledge from @[agent]…`. Override with `@deus-ex`, `@story-maker`, `@story-checker`, `@scrum-master`, etc.

**Priority:** P0 rules → MERIDIAN.md → agent → skill → templates.

---

## Agent groups

Thirteen live actors. Line: [agent-station-map.md](./agent-station-map.md). `deus-ex` allocates; the others cook or attest.

### Group 1 — Orchestration

Keeps you as manager. `deus-ex` picks the station. `scrum-master` reports health and runs init/daily.

| Agent | Serves for | Primary artifacts | Does not |
| ----- | ---------- | ----------------- | -------- |
| **`deus-ex`** | “Who should run?”, which station, messy requests | Handoff block only | Cook US; `ready`; `✅`; product code; `/status` numbers |
| **`scrum-master`** | Project health, phase progression, init, daily loop | All `docs/` (read), decision log | Invent MVP code; approve docs; mark ✅ without Record; allocate stations (`deus-ex`) |

**When to use:** `/deus-ex` or `@deus-ex` for allocation; `/status`, `/init-meridian`, `/daily-with-ai` for ceremonies and health.

**Skills (`deus-ex`):** `deus-dispatch`, `meridian-routing`  
**Skills (`scrum-master`):** `init-project`, `update-decisions-log`, `meridian-routing`

---

### Group 2 — Scope & framing

Defines *what the product is* before structure and code.

| Agent | Serves for | Primary artifacts | Does not |
| ----- | ---------- | ----------------- | -------- |
| **`product-owner`** | Problem, users, in/out of scope, assumptions, risks, epics | `docs/00_scope.md`, SQLite epics | Tech stack, architecture, US |

**When to use:** drafting or challenging `00_scope`, scope arguments, `/discover`, `/create-epic`.

**Skills:** `discover-product`, `epic-create`, `init-project`, `update-decisions-log`, `meridian-routing`

---

### Group 3 — Documentation & phase docs

Writes and reviews phase documents and product-facing docs agents can execute.

| Agent | Serves for | Primary artifacts | Does not |
| ----- | ---------- | ----------------- | -------- |
| **`technical-writer`** | Phase docs `01`–`04`, `06`–`08`, `11` | `docs/01_*` … `docs/08_*` | Approve `status: approved`; implement code; epics; US |

**When to use:** filling tech stack, principles, environments.

**Skills:** `init-project`, `document-existing-project`, `audit-phase-docs`, `update-decisions-log`, `meridian-routing`

---

### Group 4 — Security & architecture

Hardens structure before backlog and implementation.

| Agent | Serves for | Primary artifacts | Does not |
| ----- | ---------- | ----------------- | -------- |
| **`security-champion`** | Threat model, secrets, OWASP, AI-agent safety, Git hygiene | `docs/02_security.md` | Skip security to ship faster |
| **`technical-architect`** | System boundaries, modules, integrations, consistency | `docs/05_architecture.md` | Architecture before scope/security drafts exist |

**When to use:** `/security-pass`, `/architecture`, security review before merge.

**Skills:** `security-doc`, `security-privacy`, `security-code`, `security-supply-chain`, `update-decisions-log`, `meridian-routing` (architect **consults** `security-code`, does not own `/security-review`)

**Gate:** `05_architecture.md` must be **`approved`** before epics/versions/US (enforced by `sprint-planner` and `story-maker`).

---

### Group 5 — Delivery planning

Turns approved architecture into releases, sprints, and execution order.

| Agent | Serves for | Primary artifacts | Does not |
| ----- | ---------- | ----------------- | -------- |
| **`sprint-planner`** | Versions, sprints, MoSCoW, go-live checklist, story sequencing | SQLite `versions`, `sprints` | Create US before architecture approved |

**When to use:** `/create-version`, `/plan-sprint`, roadmap and sprint scope.

**Skills:** `version-create`, `sprint-create`, `sprint-complete`, `epic-complete`, `update-decisions-log`, `meridian-routing`

---

### Group 6 — Board & user stories

Owns the executable backlog and honest execution state.

| Agent | Serves for | Primary artifacts | Does not |
| ----- | ---------- | ----------------- | -------- |
| **`story-maker`** | Cook US Intent/Plan | SQLite `user_stories` | Set `ready` or `✅`; product code |
| **`story-checker`** | Attest DoR (`ready`) and DoD (`✅`) | SQLite `user_stories` | Cook Plan; implement |

**When to use:** `/create-us`, `/refine-us` → maker; `/review-us`, `/complete-us` → checker.

**Skills (maker):** `us-create`, `us-refine`, `update-decisions-log`, `meridian-routing`  
**Skills (checker):** `us-review`, `us-complete`, `update-decisions-log`, `meridian-routing`

---

### Group 7 — Code investigation (read-only)

Trace flows and explain behavior before refine, spike, or architecture updates.

| Agent | Serves for | Primary artifacts | Does not |
| ----- | ---------- | ----------------- | -------- |
| **`code-investigator`** | How code works, where logic lives, flow traces | Investigation report (chat) | Product code; US/epic without manager ask |

**When to use:** `/investigate`, "how does X work?", before `/refine-us` when Plan needs code facts.

**Skills:** `investigate-codebase`, `update-decisions-log`, `meridian-routing`

---

## Slash command groups

Slash command groups — workflows in **six groups**. Each maps to one primary agent (sometimes two).

### Group A — Bootstrap

| Step | Command | Agent | What it does |
| ---- | ------- | ----- | ------------ |
| A1 | **`/init-meridian`** | `scrum-master` | Creates `docs/` tree, initial scope, decision log, empty board. **Mode B (existing codebase):** also `docs/inventory/as-is.md` — transitional capability map; no retroactive US. **No product code.** |

---

### Group B — Session & orientation

| Step | Command | Agent | What it does |
| ---- | ------- | ----- | ------------ |
| B0 | **`/deus-ex`** | `deus-ex` | Dispatch: next agent + next command. Does **not** execute that station. |
| B1 | **`/status`** | `scrum-master` | Read-only health: kit root, Meridian projects (multi-`docs/` repos), active product, phase doc statuses, US counts, blockers. |
| B2 | **`/daily-with-ai`** | `scrum-master` | Guided session: status → pick story → implement → close → sync. |
| B3 | **`/agents-help`** | `scrum-master` | Opens this reference; summarizes groups and current-step hints. |

---

### Group C — Phase documents (structure)

Complete in order: `00` → `01` → `02` → `03` → `04` → **`05`** → `06` → `07` → `08`.

| Step | Command | Agent | Target doc | What it does |
| ---- | ------- | ----- | ---------- | ------------ |
| C1 | *(conversation)* | `product-owner` | `00_scope.md` | Scope, users, out of scope. |
| C2 | *(conversation)* | `technical-writer` | `01`, `03`, `04`, `06`–`08` | Draft phase documents. |
| C3 | **`/security-pass`** | `security-champion` | `02_security.md` + `08` CI rows | Threat model, secrets, OWASP, agent safety; bootstrap uses `security-bootstrap.md` + `ci-gates-bootstrap.md`. |
| C3b | **`/privacy-pass`** | `security-champion` | `02_security.md` § LGPD + GDPR | Brazil (ANPD) and EU (EDPB) privacy sections; official refs in checklist. **Doc only.** |
| C4 | **`/architecture`** | `technical-architect` | `05_architecture.md` + optional `docs/architecture/` + `docs/architecture/diagrams/` | Overview, detail files, **diagram index** (multi-file Mermaid maps for IDE); gate for backlog. Skill: `generate-architecture-diagram`. |
| C5 | **`/design-pass`** | `design-system-owner` | `09_design_system.md` | Contract: tokens, stack, components. Modes: `bootstrap`, `US-XXXX`. **Doc only.** |
| C5b | **`/design-flow`** | `design-system-owner` | `09` § Screen flows | Jobs → screens → states; web vs app vs extension. **Doc only.** |
| C5c | **`/design-theme`** | `design-system-owner` | `09` § Theme + type | Modes, semantic tokens, type ramp integrity. **Doc only.** |
| C6 | **`/design-showcase`** | `design-system-owner` | `09` § Showcase + US drafts | Plan catalog routes; creates showcase US for `developer`. **No code.** |
| C7 | **`/design-review`** | `design-system-owner` | Report | Audit live UI vs `09` + showcase. **No code.** |
| C8 | **`/security-review`** | `security-champion` | Report | Audit code vs `02` + US security acceptance. **No code.** |
| C9 | **`/dependency-audit`** | `security-champion` | Report | Lockfiles and supply chain hygiene. **No code.** |
| C10 | **`/test-pass`** | `quality-owner` | `10_test_strategy.md` | Pyramid, runners, coverage; bootstrap runs `quality-profile` then `test-stack-catalog.md` + `ci-gates-catalog.md` for `08` CI (gates up to declared tier). Modes: `bootstrap`, `US-XXXX`. **Doc only.** |
| C11 | **`/test-review`** | `quality-owner` | Report | Audit US tests vs strategy before close. **No code.** |
| C12 | **`/seo-pass`** | `seo-strategy` + `technical-writer` | `12_marketing_seo.md` | Public web only — meta, sitemap, CWV. **Doc only.** Skip CLI-only. |
| C13 | **`/investigate`** | `code-investigator` | Report | Read-only codebase trace and explanation. **No code.** |
| C14 | **`/discover`** | `product-owner` | `docs/discovery/product-brief.md` | Product discovery before scope. **No code.** |
| C15 | **`/document-project`** | `technical-writer` | `docs/` + `inventory/as-is.md` | Brownfield baseline in phase docs. **No US.** |
| C16 | **`/audit-docs`** | `technical-writer` | Report | Phase docs depth and drift vs code. **Report only** unless `apply`. |

**HAR (ação humana necessária):** agents stop for external accounts, OAuth/PAT, billing, production credentials — see `rules/MERIDIAN.md`. Not a slash command; applies during any workflow.

**UI products:** create `09` stub at `/init-meridian` when stack has UI. Run `/design-pass bootstrap` after `01_tech_stack`, then `/design-flow` and `/design-theme` before treating `09` as complete. Human approves `09` before Must UI US ship.

**Tested products:** create `10` stub when automated tests in scope. Run `/test-pass bootstrap` after `01_tech_stack`.

**Human gate:** you set `status: approved` on each doc. Agent never sets `approved`.

---

### Group D — Backlog artifacts

**Prerequisite:** `05_architecture.md` is **`approved`**.

| Step | Command | Agent | Output | What it does |
| ---- | ------- | ----- | ------ | ------------ |
| D1 | **`/create-epic`** | `product-owner` | `EPIC-XX` in SQLite | Product capability block. |
| D2 | **`/create-version`** | `sprint-planner` | `vX` in SQLite | Release grouping epics/US. |
| D3 | **`/plan-sprint`** | `sprint-planner` | `vX-SY` in SQLite | Time-boxed goal + story list. |
| D4 | **`/complete-sprint vX-SY`** | `sprint-planner` | sprint `status: complete` | Sprint review + Retrospective filled. |
| D5 | **`/complete-epic EPIC-XX`** | `sprint-planner` | epic `status: complete` | No open Must US; outcome confirmed. |

Order: **Epic → Version → Sprint** (sprint optional but recommended) → User story → **`/complete-us` cascade invites** `/complete-sprint` / `/complete-epic` when containers are eligible (slash commands remain for recovery).

Epic/version **close:** `/complete-epic` for epics; version via `update-version` when invited by cascade or hygiene. Prefer new epic over reopening `complete`.

---

### Group E — User story lifecycle

| Step | Command | Agent | US state after | What it does |
| ---- | ------- | ----- | -------------- | ------------ |
| E1 | **`/create-us`** | `story-maker` | `ready: false` | New US: Intent + draft Plan. |
| E2 | **`/refine-us US-XXXX`** | `story-maker` | `ready: false` | Approach, arch refs, concrete tests. Does **not** set ready. |
| E3 | **`/review-us US-XXXX`** | `story-checker` | `ready: true` if DoR attest | Audit; only path that sets `ready`. Report-only leaves ready unchanged. |
| E4 | **`/implement-us US-XXXX`** | `developer` | — | Gate: `ready: true`, deps, Plan; then product code. **Block if not attested.** |
| E5 | *(manager review)* | human | — | Review diff and run tests. |
| E6 | **`/complete-us US-XXXX`** | `story-checker` | `status: ✅` | Fills Record; **lifecycle cascade** offers sprint/epic/version close. |

**Rules:** no code without E3 (`ready: true`) **and** E4 gate. No ✅ without E6 (`## Record` + evidence).

### Pass / bounce / consult

Every station ends with a **handoff** block: `station`, `agent`, `done`, `blocker`, `next agent`, `next command`, `artifact id`. The next agent reads the artifact + block, not the previous persona.

| Interaction | Meaning |
| ----------- | ------- |
| **Pass** | Work finished; handoff names the next owner and slash command |
| **Bounce** | Checker reject → one station back (`story-checker` → `story-maker`; specialist review → `developer`). Skip to `product-owner` only for **scope** |
| **Consult** | `technical-architect` and `code-investigator` mid-station; they must not set `ready`, `✅`, or write product code |

---

### Group F — Decisions & validation

| Step | Command / action | Agent / tool | What it does |
| ---- | ---------------- | ------------ | ------------ |
| F1 | **`/update-decisions-log`** | any + skill | `prepend-decision` in SQLite. Run `date` first. Never edit old rows. |
| F2 | **`validate_meridian.py`** | script | `python3 .agent/scripts/validate_meridian.py <project-root>` — structure, US contracts, board. |
| F3 | **Meridian: Validate Project** *(extension)* | IDE command | Same validator from VS Code/Cursor sidebar. |

---

## End-to-end steps (numbered)

Use this as the canonical sequence. Skip steps only when the artifact already exists and is approved.

```txt
 0. /deus-ex (when lost on who/station)     [Group B]  deus-ex — pass, do not cook
 1. /init-meridian                          [Group A]  scrum-master
 2. Complete 00_scope → approve             [Group C]  product-owner
 3. Complete 01, 03, 04 (draft → approve)  [Group C]  technical-writer
 4. /security-pass → approve 02             [Group C]  security-champion
 5. /architecture → approve 05              [Group C]  technical-architect  ← GATE
 5b. /design-pass bootstrap → approve 09     [Group C]  design-system-owner    (UI products)
 5b2. /design-flow + /design-theme            [Group C]  design-system-owner    (UI products — journeys + tokens)
 5c. /design-showcase (catalog US)          [Group C]  design-system-owner    (UI products)
 6. Complete 06, 07, 08 as needed          [Group C]  technical-writer
 7. /create-epic                            [Group D]  product-owner
 8. /create-version                         [Group D]  sprint-planner
 9. /plan-sprint                            [Group D]  sprint-planner
10. /create-us                               [Group E]  story-maker
11. /refine-us US-XXXX                       [Group E]  story-maker  (Plan; ready stays false)
12. /review-us US-XXXX                       [Group E]  story-checker → ready: true
13. /implement-us US-XXXX                    [Group E]  developer → gate then code
14. /design-review (UI US)                   [Group C]  design-system-owner → before close
14b. /security-review (sensitive US)          [Group C]  security-champion → before close
14c. /test-review (tests: required)           [Group C]  quality-owner → before close
15. Manager review diff + tests              [Group E]  human
16. /complete-us US-XXXX                     [Group E]  story-checker
17. git commit (human)                       [Group F]  you — one US per commit
18. /status or /daily-with-ai                [Group B]  scrum-master → back to step 10
19. /complete-sprint vX-SY (when sprint done) [Group D]  sprint-planner — after US in sprint closed
```

---

## Skill groups

Skills are procedures agents load automatically. Grouped by purpose.

### Governance & routing

| Skill | Used by | Purpose |
| ----- | ------- | ------- |
| `deus-dispatch` | deus-ex | Product context + allocate station (read-only) |
| `meridian-routing` | all agents | Pick correct agent from intent |
| `init-project` | scrum-master, product-owner, technical-writer | Bootstrap `docs/` |
| `update-decisions-log` | most agents | Prepend decision JSON (real `date` commands) |

### Delivery authoring

| Skill | Used by | Purpose |
| ----- | ------- | ------- |
| `epic-create` | product-owner | Epic row in SQLite |
| `version-create` | sprint-planner | Version file |
| `sprint-create` | sprint-planner | Sprint file |
| `sprint-complete` | sprint-planner | Sprint close + Retrospective |
| `epic-complete` | sprint-planner | Epic close + outcome confirmation |
| `us-create` | story-maker | US row at create |
| `us-refine` | story-maker | Approach; does not set `ready` |
| `us-review` | story-checker | Audit; may set `ready` |
| `us-complete` | story-checker | Record + ✅ + board sync |

### User story quality & close

| Skill | Used by | Purpose |
| ----- | ------- | ------- |
| `us-implement` | developer | Gate + implement when `ready: true` |

### Board & security

| Skill | Used by | Purpose |
| ----- | ------- | ------- |
| _(removed)_ | — | v11: `board_snapshots` in SQLite |
| `security-doc` | security-champion | `/security-pass` — `02` |
| `security-privacy` | security-champion | `/privacy-pass` |
| `security-code` | security-champion | `/security-review` — code vs `02` |
| `security-supply-chain` | security-champion | `/dependency-audit` |
| `test-strategy` | quality-owner | `10`, `/test-pass` |
| `test-review` | quality-owner | `/test-review` evidence audit |
| `design-system` | design-system-owner | `09`, stack bootstrap, showcase, review checklists |
| `design-flow` | design-system-owner | `/design-flow` — screen IA, states, web/app |
| `design-theme` | design-system-owner | `/design-theme` — modes, type ramp |
| `investigate-codebase` | code-investigator | `/investigate` checklists and report template |

### Kit maintenance (maintainers)

| Skill | Used by | Purpose |
| ----- | ------- | ------- |
| `create-meridian-artifact` | maintainers | Procedure + registry checklist for new kit pieces |

---

## Intent → agent quick lookup

| You want to… | Group | Agent | Command |
| ------------ | ----- | ----- | ------- |
| Who should run this / which station | B | `deus-ex` | `/deus-ex` |
| Start or migrate project | A | `scrum-master` | `/init-meridian` |
| See blockers and next step | B | `scrum-master` | `/status` |
| Full guided day | B | `scrum-master` | `/daily-with-ai` |
| Open this manual | B | `scrum-master` | `/agents-help` |
| Define scope | C | `product-owner` | chat + `00_scope` |
| Draft phase docs | C | `technical-writer` | chat |
| Security doc | C | `security-champion` | `/security-pass` |
| Security code audit | C | `security-champion` | `/security-review`, `/dependency-audit` |
| Test strategy | C | `quality-owner` | `/test-pass`, `/test-pass bootstrap` |
| Test audit | C | `quality-owner` | `/test-review` |
| Architecture doc | C | `technical-architect` | `/architecture` |
| New epic | D | `product-owner` | `/create-epic` |
| New version / sprint | D | `sprint-planner` | `/create-version`, `/plan-sprint`, `/complete-sprint` |
| New / refine / review / close US | E | `story-maker` / `story-checker` / `developer` | `/create-us`, `/refine-us`, `/review-us`, `/implement-us`, `/complete-us` |
| Board refresh | — | Extension reads SQLite on save |
| Log a decision | F | any | `/update-decisions-log` |
| Design contract (`09`) | C | `design-system-owner` | `/design-pass`, `/design-pass bootstrap` |
| Screen flows / IA | C | `design-system-owner` | `/design-flow` |
| Theme / type hierarchy | C | `design-system-owner` | `/design-theme` |
| Design catalog plan | C | `design-system-owner` | `/design-showcase` |
| Design UI audit | C | `design-system-owner` | `/design-review` |
| Code investigation | C | `code-investigator` | `/investigate` |
| Brownfield baseline | C | `technical-writer` | `/document-project` |
| Phase doc audit | C | `technical-writer` | `/audit-docs` |
| Product discovery | C | `product-owner` | `/discover` |
| Extend Meridian kit | — | `create-meridian-artifact` skill | edit `.agent/` + `sync_kit.sh` |
| Validate structure | F | script / extension | `validate_meridian.py` or **Validate Project** |

---

## IDE extension commands (separate layer)

These are **not** agents. They read the **active** `docs/` in the editor (extension `app-visual-studio`). In monorepos, **one active project** at a time — see [usage-guide.md § Multiple Meridian projects](./usage-guide.md#multiple-meridian-projects).

| Group | Command | Purpose |
| ----- | ------- | ------- |
| Views | **Open Board**, **Open Versions**, **Open Sprints**, **Open Epics**, **Open Decisions** | Board: 📋 Backlog · 📌 Todo · 🔨 Doing · 🔶 Partial · 🧪 Tests · ✅ Done (from `status` + `ready` + `in_progress` + tests); toggles 🧊 Frozen · 🚫 Deprecated. Other tabs read-only; **Project** row shows name + `docs/` path |
| Governance | **Select Active Project**, **Validate Project**, **Sync Board**, **Show Workspace Status** | Switch product (saved); validate `packageRoot`; board JSON; list all projects |
| Help | **Open Command Help**, **Open Agents Help** | Extension catalog; kit `agents-help.md` at runtime |

**Multi-product UI:** Board and Deliverables show which `docs/` is loaded; dropdown switches product and refreshes open tabs. Status bar shows project name when N>1. Install: Marketplace **Meridian Harness** or `pnpm install:cursor` in `app-visual-studio/`.

---

## Invocation cheat sheet

| Method | Example | When |
| ------ | ------- | ---- |
| Slash command | `/refine-us US-0017` | Known workflow step |
| Explicit agent | `@story-maker refine US-0017` | Override routing |
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
