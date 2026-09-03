# Agent station map — maker vs checker

> **Live roster:** twelve actors. `story-maker` cooks `/create-us` + `/refine-us`. `story-checker` attests `/review-us` (`ready`) + `/complete-us`.

v11 rename history stays in [plans/agent-roster-and-workflow-v11.md](./plans/agent-roster-and-workflow-v11.md). This file is the **production-line contract** (EPIC-23). **Areas** (discovery → attest): [agent-areas.md](./agent-areas.md).

## Cook versus attest

| Object | Cook (writes) | Attest (may not be the cook) |
| ------ | ------------- | ----------------------------- |
| Product recipe (scope, epic) | `product-owner` | Human `approved` on phase docs; planner does **not** create epics |
| Phase docs `01`/`04`/`06`–`08`/`11` | `technical-writer` | Human `approved` |
| `02` standard | `security-champion` | Human `approved` on the doc; later `/security-review` attests **code** |
| `05` | `technical-architect` | Human `approved` |
| `09` | `design-system-owner` | Human `approved`; `/design-review` attests **UI** |
| `10` | `quality-owner` | Human `approved`; `/test-review` attests **test evidence** |
| Version / sprint container | `sprint-planner` | Same agent may **close** the container (`/complete-sprint`, `/complete-epic`) — not the same artifact as creating an epic |
| US recipe (Intent + Plan) | `story-maker` `/create-us` + `/refine-us` | `story-checker` `/review-us` → `ready: true` |
| Increment (code) | `developer` `/implement-us` | Specialist reviews; then **target** `story-checker` `/complete-us` → `✅` |

Who cooks the US must not set `ready` or `✅`.

## Slash → owner

| Command | Live owner (now) | Target owner |
| ------- | ---------------- | ------------ |
| `/init-meridian`, `/status`, `/daily-with-ai`, `/agents-help` | `scrum-master` | same |
| `/discover`, `/create-epic` | `product-owner` | same |
| `/create-version`, `/plan-sprint`, `/complete-sprint`, `/complete-epic` | `sprint-planner` | same |
| `/create-us`, `/refine-us` | `story-maker` | same |
| `/review-us`, `/complete-us` | `story-checker` | same |
| `/implement-us` | `developer` | same |
| `/security-pass`, `/security-review`, `/privacy-pass`, `/dependency-audit` | `security-champion` | same (doc vs code are different artifacts) |
| `/architecture` | `technical-architect` | same |
| `/design-pass`, `/design-showcase`, `/design-review` | `design-system-owner` | same |
| `/test-pass`, `/test-review` | `quality-owner` | same |
| `/investigate` | `code-investigator` | same (consult only) |

Skills may be **shared as tools** (`update-decisions-log`). A skill listed on an agent that is **not** the slash owner is a protocol bug (US-0188).

## Target twelve-actor roster

1. `scrum-master` — dispatch only  
2. `product-owner` — discovery, scope, epic  
3. `technical-writer`  
4. `security-champion`  
5. `technical-architect`  
6. `design-system-owner`  
7. `quality-owner`  
8. `sprint-planner`  
9. `story-maker` — create + refine US  
10. `story-checker` — review (`ready`) + complete (`✅`)  
11. `developer`  
12. `code-investigator` — consult  

## Allowed interactions

1. **Pass** — station ends with a handoff block: `station`, `agent`, `done`, `blocker`, `next agent`, `next command`, `artifact id`. Next agent reads the artifact + block, not the previous persona.
2. **Bounce** — checker reject → one station back (`story-checker` → `story-maker`; specialist review → `developer`). Skip to `product-owner` only when the blocker is **scope**.
3. **Consult** — `technical-architect` and `code-investigator` may be called mid-station. They must not set `ready`, `✅`, or write product code.

## Explicitly not a new agent

| Temptation | Why not |
| ---------- | ------- |
| `security-reviewer` / `test-reviewer` / `design-reviewer` | Checking the **increment** against a standard the same champion wrote is SoD enough |
| `version-planner` separate from `sprint-planner` | Same release-container craft |
| `committer` | Git stays human-triggered |
| `product-discovery` / `product-charter` | Same product judgment, different phases — one `product-owner` |
| OpenAI Symphony daemon | `.meridian/meridian.db` is already the tracker; no poll loop in the kit |

## Board mapping (derived columns)

Agents set `status`, `ready`, and `in_progress`. They do not write column names.

| Board | Fields |
| ----- | ------ |
| Backlog | `❌` + `ready` false |
| Todo | `❌` + `ready` true + `in_progress` false |
| Doing | `in_progress` true and `❌`/`🔶` |
| Partial | `🔶` and not in progress |
| Tests / Done / Frozen / Deprecated | unchanged |

`status` remains completeness (`❌`/`🔶`/`✅`/`🧊`/`🚫`), not WIP.
