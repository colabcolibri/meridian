---
description: Dispatch the next Meridian station — next agent and slash. Does not execute that station.
---

# /deus-ex — allocate the next station

$ARGUMENTS

---

## Critical rules

1. Use `deus-ex` + `@[skills/deus-dispatch]` + `@[skills/meridian-routing]`
2. **Mandatory read:** `deus-dispatch` references (`project-context`, `dispatch-checklist`, `handoff-envelope`) then `agent-station-map.md`
3. **Dispatch only** — do not run `/create-us`, `/refine-us`, `/review-us`, `/implement-us`, `/complete-us`, or write product docs/code in this turn
4. Human still owns `approved` and `✅`
5. If `$ARGUMENTS` already names a slash, pass to that slash’s owner — do not execute it here

---

## Task

```txt
CONTEXT:
- User Request: $ARGUMENTS
- Mode: DISPATCH (deus ex machina)

RULES:
1. project-context.md — understand this product (read-only)
2. dispatch-checklist.md — area, gates, one next command
3. Fill handoff-envelope.md (Evidence required)
4. Stop — next agent executes next command in a later turn
```

---

## Output

```txt
Station: dispatch
Agent: deus-ex
Area:
Done:
Blocker:
Next agent:
Next command:
Artifact id:
Evidence:
```

---

## When to run

- “Who should do this?”
- “Which agent / which station?”
- `@deus-ex` with a messy request
- After a bounce, when the manager wants the chief to re-allocate
