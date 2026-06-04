---
trigger: always_on
---

# MERIDIAN.md — global kit rules

> Defines how the agent behaves in workspaces that use Meridian.

---

## CRITICAL: agent + skill protocol (start here)

> **REQUIRED:** Read the appropriate agent and its skills BEFORE changing project structure, docs, or code.

### 1. Modular skill loading

Agent activated → check frontmatter `skills:` → read `SKILL.md` (index) → read `.agent/references/templates/INDEX.md` when creating/closing delivery artifacts → read the **full template file** listed for that artifact → read `section-contracts.md` for US/epic/version structure → read only other relevant files in `references/`.

- **Selective reading:** Do NOT read every file in the skill folder. Read `SKILL.md` first; then only what the request requires.
- **Scrum:** use `.agent/references/scrum-meridian-map.md` for delivery mapping. Do **not** read `scrum-guide-complete.md` unless the manager explicitly asks.
- **Rule priority:** P0 (`rules/MERIDIAN.md`) > P1 (`.agent/MERIDIAN.md` + agent `.md`) > P2 (`SKILL.md`).

### 2. Enforcement protocol

1. **When an agent is activated:** read rules → frontmatter → `SKILL.md` → apply everything.
2. **Forbidden:** skip agent/skill and go straight to implementation.

---

## Request classifier (step 1)

Before any action, classify:

| Type | Triggers | Outcome |
| ---- | -------- | ------- |
| **QUESTION** | "what is", "how does", "explain" | Text answer; do not change docs |
| **STATUS** | "status", "where are we", "blockers" | `process-manager` + `/status` |
| **DOC / PHASE** | "scope", "epic", "version", "architecture", `00_`–`11_` | Documentation agent per matrix |
| **US / BOARD** | "user story", "US-", "kanban", "board" | `board-keeper` or `sprint-planner` |
| **REFINE US** | "refine US", `/refine-us`, "ready for implement" | `board-keeper` + `refine-user-story` |
| **REVIEW US** | "review US", `/review-us`, "audit US", "check story" | `board-keeper` + `review-user-story` |
| **CLOSE US** | "complete US", "mark done", "record", `/complete-us` | `board-keeper` + `complete-user-story` |
| **SECURITY** | "security", "OWASP", "secrets", `02_security` | `security-steward` |
| **START PROJECT** | "start", "meridian setup", "create docs" | `process-manager` + `init-project` |
| **CODE** | "implement", "create app", "fix", "refactor" | Verify doc maturity FIRST |
| **SLASH** | `/init-meridian`, `/create-epic`, `/create-us`, `/complete-us`, `/daily-with-ai`, etc. | Corresponding workflow |

> For automatic agent routing, follow `@[skills/meridian-routing]`.

---

## Automatic routing (step 2)

1. **Analyze (silent):** Meridian domain (governance, scope, doc, security, architecture, sprint, board).
2. **Select agent(s).**
3. **Inform the user:**

```markdown
🤖 **Applying knowledge from `@[agent-name]`...**

[specialized response]
```

4. **Respect override:** if the user cites `@scope-architect`, use that agent.

### Checklist before code or US

| Step | Check | If it fails |
| ---- | ----- | ----------- |
| 1 | Correct agent for the domain? | Stop; reclassify the request |
| 2 | Read `.agent/agents/{agent}.md`? | Stop; open the agent |
| 3 | Announced `🤖 Applying...`? | Add before the response |
| 4 | Loaded skills from frontmatter? | Read each listed `SKILL.md` |
| 5 | Creating/closing epic, version, sprint, or US? | Read `.agent/references/templates/INDEX.md` + full template + `section-contracts.md` **before** Write |
| 6 | Implementing code for a US? | US `ready: true` + Plan filled; else `/refine-us` |
| 7 | Required docs exist at correct maturity? | Block; report to manager |

**Violations:**

- Code without minimum docs = **protocol failure**
- US without `05_architecture` approved = **protocol failure**
- `✅` without evidence = **protocol failure**
- `✅` without filled `## Record` on the US (skill `complete-user-story`) = **protocol failure**

---

## TIER 0: universal rules (always active)

### Source of truth

- `docs/` is the source of truth of the **target project** (do not confuse with this repo's `app-desktop/docs/` unless context is explicit).
- `docs/kanban/board.json` is **derived** from `docs/us/*.md`.
- Read `.agent/MERIDIAN.md` before changing project structure.

### Documentation precedes code

Do not write product code until required docs for the current phase exist (see `.agent/MERIDIAN.md`).

### Maturity

- Do not mark `approved` without human confirmation or explicit authorization.
- Do not create US before `05_architecture.md` is `approved`.
- Do not edit old entries in `docs/decisions/`; new entries go **at the start** of `entries`.

### Acceptance and status

- Never `✅` without objective evidence.
- Never `🔶` without `Missing:` in acceptance criteria.

### Security and Git

- Protect `.env`, `.env.*`, logs, builds, `node_modules`, caches.
- Do not expose secrets; do not run destructive commands without approval.
- Security changes require a decision in `docs/decisions/YYYY-MM-DD.json`.
- After `/complete-us` + `/sync-board`, the **manager** commits (one US per commit by default). Agents may suggest a message in `### Executed`; they do not `git commit` unless explicitly asked. See `.agent/references/commit-after-us-close.md`.

### Human manager

The person is manager of the process. Agents report blockers, next step, and pending decisions — they do not replace judgment.

---

## TIER 1: when writing or changing artifacts

| Artifact | Primary agent | Skill |
| -------- | ------------- | ----- |
| `docs/` structure | `process-manager` | `init-project` |
| `00_scope.md` | `scope-architect` | `init-project` |
| `01`–`08`, `11` (phase) | `documentation-strategist` | `update-decisions-log` |
| `02_security.md` | `security-steward` | `security-review` |
| `05_architecture.md` | `architecture-guardian` | `security-review` |
| `docs/versions/`, `docs/sprints/` | `sprint-planner` | `create-user-story` |
| `docs/us/*.md` (create) | `board-keeper` | `create-user-story` |
| `docs/us/*.md` (review) | `board-keeper` | `review-user-story` |
| `docs/us/*.md` (refine) | `board-keeper` | `refine-user-story` |
| `docs/us/*.md` (close) | `board-keeper` | `complete-user-story` |
| `board.json` | `board-keeper` | `generate-board-json` |
| `11_decisions.md` (stub) + `docs/decisions/` | any relevant agent | `update-decisions-log` |

---

## Kit map (session reading)

| Resource | Path |
| -------- | ---- |
| Master protocol | `.agent/MERIDIAN.md` |
| Kit architecture | `.agent/ARCHITECTURE.md` |
| **Templates (agents)** | `.agent/references/templates/INDEX.md` + `TEMPLATE_SOURCES.md` + `writing-guide.md` |
| Agents | `.agent/agents/` |
| Skills | `.agent/skills/` |
| Workflows | `.agent/workflows/` |
| Validation | `python3 .agent/scripts/validate_meridian.py <project-folder>` (`--json` for CI) |

---

## Quick reference

- **Governance:** `process-manager`
- **Scope:** `scope-architect`
- **Phase docs:** `documentation-strategist`
- **Security:** `security-steward`
- **Architecture:** `architecture-guardian`
- **Versions/sprints:** `sprint-planner`
- **US/board:** `board-keeper`
- **Routing:** `meridian-routing`
