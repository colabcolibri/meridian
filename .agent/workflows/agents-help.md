---
description: Open the agents and slash commands reference — groups, steps, and who serves what.
---

# /agents-help — agents & commands map

$ARGUMENTS

---

## Critical rules

1. **Read-only** — do not change docs unless `$ARGUMENTS` explicitly asks
2. Use `scrum-master`
3. Primary reference: `.agent/references/agents-help.md`
4. Cross-read: `.agent/references/how-to-use.md` (entry), `start-here.md` (concepts), `usage-guide.md` (situations)

---

## Task

```txt
CONTEXT:
- User Request: $ARGUMENTS
- Mode: HELP / ORIENTATION

PROCEDURE:
1. Read .agent/references/agents-help.md
2. If project has docs/, read docs/README.md and phase frontmatter 00–08, 11
3. Summarize for the human:
   - Agent groups (Scrum-aligned roster — 9 agents)
   - Slash command groups (A Bootstrap … F Decisions)
   - Where they are in the numbered end-to-end steps (1–18)
   - Which agent + command applies to their request (or /status if unclear)
4. Tell them to open agents-help.md in the editor for the full tables
5. If $ARGUMENTS names a specific agent or command, expand that row only
```

---

## Output format

```txt
Meridian agents help

Your situation: [one line from docs state or user request]

You are around step [N]: [step name]
Recommended next: [command] → agent [name] → group [letter/number]

Quick map:
- Scrum Master: scrum-master — /status, /init-meridian, /daily-with-ai
- Product Owner: product-owner — /discover, 00_scope, /create-epic
- Technical writer: technical-writer — phase docs 01–08, 11
- Security: security-champion — /security-pass
- Architect: technical-architect — /architecture (gate before backlog)
- Design: design-system-owner — /design-pass, 09_design_system
- Planning: sprint-planner — /create-version, /plan-sprint
- Backlog: backlog-refiner — /create-us, /refine-us, /complete-us
- Developer: developer — /implement-us

Full reference: .agent/references/agents-help.md
```

---

## After

Offer to run **`/status`** if the user wants project-specific next action instead of the generic map.
