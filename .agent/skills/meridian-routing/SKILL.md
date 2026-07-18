---
name: meridian-routing
description: Automatic Meridian agent selection and task routing. Picks scrum-master, product-owner, technical-writer, security-champion, technical-architect, design-system-owner, sprint-planner, backlog-refiner, or developer.
allowed-tools: Read, Glob, Grep
version: 2.0.0
---

# Meridian intelligent routing

> Route to the **Scrum-aligned** agent. Legacy `@` slugs: § **Legacy aliases** below + `references/agent-aliases-h2.md` (H2 deletes `.md` files; routing table stays).

## Principle

Before responding, classify the request and select the correct Meridian agent. State which expertise is active.

## Legacy aliases (H1 — resolve to new slug)

| User cites | Route to |
| ---------- | -------- |
| `@process-manager` | `scrum-master` |
| `@board-keeper` | `backlog-refiner` |
| `@scope-architect` | `product-owner` |
| `@documentation-strategist` | `technical-writer` |
| `@architecture-guardian` | `technical-architect` |
| `@security-steward` | `security-champion` |

Announce the **new** slug in `🤖 Applying knowledge from @[slug]...`. After H2, legacy `@` files are removed — chat text still maps via this table.

## Selection matrix

| Intent | Keywords | Agent(s) | Auto? |
| -------- | -------------- | -------- | ----- |
| Start / structure | "start", "setup", "init meridian" | `scrum-master` | yes |
| Status / governance | "status", "phase", "blocker", `/daily-with-ai` | `scrum-master` | yes |
| Discovery | `/discover`, product brief | `product-owner` | yes |
| Scope | "scope", "in scope", `00_scope` | `product-owner` | yes |
| Epic | "create epic", `/create-epic`, `EPIC-` | `product-owner` + `create-epic` | yes |
| Phase documents | `01_`–`08`, `11_`, tech stack, principles | `technical-writer` | yes |
| Security | "security", OWASP, `/security-pass`, `02_security` | `security-champion` | yes |
| Architecture | "architecture", `/architecture`, `05_architecture` | `technical-architect` | yes |
| Design system | "design system", UI tokens, `/design-pass`, `09_design` | `design-system-owner` | yes |
| Version / sprint | "version", "sprint", `/create-version`, `/plan-sprint` | `sprint-planner` | yes |
| Close sprint | `/complete-sprint` | `sprint-planner` + `complete-sprint` | yes |
| Decisions / log | `/update-decisions-log`, `docs/decisions/` | skill `update-decisions-log` + `date` before Write | yes |
| User story | "user story", "US-", `/create-us` | `backlog-refiner` | yes |
| Refine US | `/refine-us`, "ready for implement" | `backlog-refiner` + `refine-user-story` | yes |
| Review US | `/review-us` | `backlog-refiner` + `review-user-story` | yes |
| Close US | `/complete-us` | `backlog-refiner` + `complete-user-story` | yes |
| Implement US / code | "implement", `/implement-us`, "code for US" | `developer` + `implement-user-story` | **block** if `ready` not true |
| US + planning | "plan sprint" + "create US" | `sprint-planner` + `backlog-refiner` | yes |

## Decision flow

```txt
1. Conceptual question? → Answer without changing files
2. Slash command? → .agent/workflows/{cmd}.md → templates before Write
3. Code? → developer + implement-gate; ready: true + Plan required
4. Create/close epic, version, sprint, US? → INDEX + template + section-contracts
5. Otherwise → matrix row above
```

## Response format (required)

```markdown
🤖 **Applying knowledge from `@[agent-name]`...**

[response]
```

## Rules

1. **Silent analysis** — do not narrate long routing prose.
2. **User override** — `@agent` wins; apply alias table if legacy slug.
3. **Code without docs** — `scrum-master` reports blocker; no MVP in code.
4. **Decisions** — `update-decisions-log` + real `date` commands before Write.
5. **Scrum concepts** — `scrum-meridian-map.md` only unless manager asks for full guide.

## Gate questions (when vague)

1. What problem and for whom?
2. What is mandatory now vs later?
3. Which version/epic is the target?
