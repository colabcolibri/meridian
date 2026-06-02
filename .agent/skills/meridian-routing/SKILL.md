---
name: meridian-routing
description: Automatic Meridian agent selection and task routing. Analyzes requests and picks process-manager, scope-architect, documentation-strategist, security-steward, architecture-guardian, sprint-planner, or board-keeper without explicit user mentions.
allowed-tools: Read, Glob, Grep
version: 1.0.0
---

# Meridian intelligent routing

> The agent acts as **Meridian process manager**, not a generic implementer.

## Principle

Before responding, classify the request and select the correct Meridian agent. State which expertise is active.

## Selection matrix

| Intent | Keywords | Agent(s) | Auto? |
| -------- | -------------- | -------- | ----- |
| Start / structure | "start", "setup", "create docs", "init meridian" | `process-manager` | yes |
| Status / governance | "status", "phase", "blocker", "can advance" | `process-manager` | yes |
| Daily AI workflow | "how to use AI", "day to day", "cursor routine", `/daily-with-ai` | `process-manager` | yes |
| Scope | "scope", "in scope", "out of scope", `00_scope` | `scope-architect` | yes |
| Phase documents | "tech stack", "principle", "environment", `01_`–`05_`, `08`–`10` | `documentation-strategist` | yes |
| Epic (capability) | "create epic", "new epic", `/create-epic`, `docs/epics/`, `EPIC-` | `documentation-strategist` + skill `create-epic` | yes |
| Security | "security", "OWASP", "secrets", "threat", `02_security` | `security-steward` | yes |
| Architecture | "architecture", `05_architecture` | `architecture-guardian` | yes |
| Version / sprint | "version", "sprint", "roadmap", `/create-version`, `docs/versions/`, `docs/sprints/` | `sprint-planner` + skill `create-version` / `create-sprint` | yes |
| Decisions / log | "decision", "decisions", "decision log", `docs/decisions/` | skill `update-decisions-log` | yes |
| User story / board | "user story", "US-", "kanban", "board.json", "acceptance" | `board-keeper` | yes |
| Close US | "complete US", "mark done", "technical implementation", `/complete-us`, "close story" | `board-keeper` + `complete-user-story` | yes |
| US + planning | "plan sprint" + "create US" | `sprint-planner` + `board-keeper` | yes |
| Implement code | "implement", "build", "create API", "component" | `process-manager` first; when done → `complete-user-story` | **block** if docs immature |

## Decision flow

```txt
1. Conceptual question? → Answer without changing files
2. Slash command? → Open .agent/workflows/{cmd}.md
3. Code? → process-manager validates maturity → then domain technical agent (outside kit) only if docs OK
4. Otherwise → one row from matrix above
```

## Response format (required)

```markdown
🤖 **Applying knowledge from `@[agent-name]`...**

[response]
```

Multiple agents:

```markdown
🤖 **Applying knowledge from `@[scope-architect]` + `@[documentation-strategist]`...**
```

## Rules

1. **Silent analysis** — do not narrate "I am analyzing" for paragraphs.
2. **User override** — `@agent` wins over automatic routing.
3. **Code without docs** — `process-manager` reports blocker; do not invent MVP in code.
4. **Decisions** — any relevant change triggers `update-decisions-log`.

## Complexity detection

| Complexity | Signals | Action |
| ------------ | ------ | ---- |
| Simple | One doc, one domain | One agent |
| Moderate | Two domains (e.g. security + architecture) | Two agents in sequence |
| High | "Build entire product" without docs | `process-manager` + questions (max 3) + `/init-meridian` |

## Gate questions (when vague)

Before creating structure or US:

1. What problem and for whom?
2. What is mandatory now vs later?
3. Which version/epic is the target?

Then proceed with the selected agent.
