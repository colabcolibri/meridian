---
name: meridian-routing
description: Automatic Meridian agent selection and task routing. Analyzes requests and picks deus-ex (dispatch), scrum-master, product-owner, technical-writer, security-champion, technical-architect, design-system-owner, quality-owner, sprint-planner, story-maker, story-checker, developer, code-investigator.
allowed-tools: Read, Glob, Grep
version: 1.1.0
---

# Meridian intelligent routing

> The agent acts as **Meridian facilitator**, not a generic implementer.

## Principle

Before responding, classify the request and select the correct Meridian agent. State which expertise is active.

**Station contract:** [agent-station-map.md](../../references/agent-station-map.md) — cook vs attest, pass/bounce/consult. `deus-ex` allocates; `story-maker` / `story-checker` cook vs attest US.

## Selection matrix

| Intent | Keywords | Agent(s) | Auto? |
| -------- | -------------- | -------- | ----- |
| Allocate station | "who should", "which agent", "which station", "orquestr", "orchestrat", "deus ex", `/deus-ex`, `@deus-ex` | `deus-ex` | yes |
| Start / structure | "start", "setup", "create docs", "init meridian" | `scrum-master` | yes |
| Status / governance | "status", "phase", "blocker", "can advance" | `scrum-master` | yes |
| Daily AI workflow | "how to use AI", "day to day", "cursor routine", `/daily-with-ai` | `scrum-master` | yes |
| Scope / discovery | "scope", "in scope", "out of scope", `00_scope`, `/discover` | `product-owner` | yes |
| Phase documents | "tech stack", "principle", "environment", `01_`–`08`, `11` | `technical-writer` | yes |
| Epic (capability) | "create epic", "new epic", `/create-epic`, `EPIC-` | `product-owner` + `epic-create` | yes |
| Security doc | "security pass", `02_security`, threat model draft | `security-champion` + `security-doc` | yes |
| Security audit | `/security-review`, code security, offensive checklist | `security-champion` + `security-code` | yes |
| Dependency audit | `/dependency-audit`, lockfile, supply chain, CVE | `security-champion` + `security-supply-chain` | yes |
| Privacy doc | LGPD, GDPR, `/privacy-pass`, titular, data subject, encarregado, DPO, consentimento | `security-champion` + `security-privacy` | yes |
| Human-only action | create account, OAuth, PAT, API key, billing, payment, Stripe dashboard, production deploy, accept terms | **HAR stop** — no agent continues until manager acts | yes |
| SEO (public web) | SEO, sitemap, meta tags, robots, Core Web Vitals, schema.org | `seo-strategy` skill + `technical-writer` / `developer` | yes |
| Deploy / CI doc | deploy, rollback, CI pipeline, production release | `technical-writer` + `08_environments` | yes |
| Architecture | "architecture", `05_architecture`, `/architecture`, diagram, system map, ER map, architecture diagrams | `technical-architect` + `generate-architecture-diagram` | yes |
| Design system | `09_design`, `/design-pass`, `/design-showcase`, `/design-review`, tokens, UI | `design-system-owner` + `design-system` | yes |
| Screen flow / IA | screen flow, jornada, telas, navigation map, empty state, `/design-flow`, responsive app/web | `design-system-owner` + `design-flow` | yes |
| Theme / type | theme, dark mode, tokens, font hierarchy, tipografia, `/design-theme` | `design-system-owner` + `design-theme` | yes |
| Test strategy | `10_test`, `/test-pass`, pyramid, coverage, runners, `qualitySiege` | `quality-owner` + `test-strategy` | yes |
| Test audit | `/test-review`, tests evidence, before complete-us | `quality-owner` + `test-review` | yes |
| Version / sprint | "version", "sprint", `/create-version`, `/plan-sprint` | `sprint-planner` | yes |
| Close sprint | `/complete-sprint`, retrospective | `sprint-planner` + `sprint-complete` | yes |
| Close epic | `/complete-epic`, epic outcome | `sprint-planner` + `epic-complete` | yes |
| Decisions / log | "decision", `/update-decisions-log` | `update-decisions-log` skill + `date` | yes |
| User story / board | "user story", "US-", "kanban", `board_snapshots` | `story-maker` (create/refine) or `story-checker` (review/complete) | yes |
| Implement US / code | "implement", "build", `/implement-us` | `developer` + `us-implement` | **block** if `ready` not true |
| Create US | `/create-us`, "new user story" | `story-maker` + `us-create` | yes |
| Refine US | `/refine-us` | `story-maker` + `us-refine` | yes |
| Review US / ready | `/review-us`, "audit US", "ready for implement" | `story-checker` + `us-review` | yes |
| Close US | `/complete-us`, "close story" | `story-checker` + `us-complete` | yes |
| US + planning | "plan sprint" + "create US" | `sprint-planner` + `story-maker` | yes |
| Code investigation | "how does", "where is", "trace", "explain flow", `/investigate`, spike prep | `code-investigator` + `investigate-codebase` | yes |
| Brownfield docs | `/document-project`, "document as-is", inventory | `technical-writer` + `document-existing-project` | yes |
| Phase doc audit | `/audit-docs`, docs stale vs code | `technical-writer` + `audit-phase-docs` | yes |
| Extend Meridian kit | new skill, new agent, new workflow, register slash | `create-meridian-artifact` | yes |

## Decision flow

```txt
1. Conceptual question? → Answer without changing files
2. Slash command? → Open .agent/workflows/{cmd}.md → read template before Write
3. Code? → `developer` + `/implement-us` gate (`ready: true` + Plan) → then implement
4. Create/close epic, version, sprint, US? → INDEX.md + template + section-contracts.md mandatory
5. Otherwise → one row from matrix above
```

## Response format (required)

```markdown
🤖 **Applying knowledge from `@[agent-name]`...**

[response]
```

## Rules

1. **Silent analysis** — do not narrate "I am analyzing" for paragraphs.
2. **User override** — `@agent` wins over automatic routing.
3. **Code without docs** — `scrum-master` reports blocker; do not invent MVP in code.
4. **Decisions** — run `date +"%Y-%m-%d"` and `date +"%H:%M"` before `prepend-decision`.
5. **Scrum concepts** — read `.agent/references/scrum-meridian-map.md` only unless manager asks otherwise.

## Gate questions (when vague)

1. What problem and for whom?
2. What is mandatory now vs later?
3. Which version/epic is the target?

Then proceed with the selected agent.
