---
description: Refine a user story for implementation — Context, tests and hints before coding.
---

# /refine-us — refine user story

$ARGUMENTS

---

## Critical rules

1. Use `board-keeper` + `@[skills/refine-user-story]`
2. **Gate:** US exists; `05_architecture` = `approved`; status not `✅`
3. **Mandatory read:** `us-template.md` + `section-contracts.md` + `refine-checklist.md` **before** Edit
4. **NO product code** — docs/US only
5. Set `ready: true` only when refine-checklist passes entirely
6. Regenerate `board.json` if frontmatter changed

---

## Task

```txt
CONTEXT:
- User Request: $ARGUMENTS
- Mode: REFINE US (pre-implementation)

RULES:
1. board-keeper Phase 0 — resolve US id from $ARGUMENTS
2. Read epic + architecture sections needed for Context
3. Fill ## Context & constraints (all subsections)
4. Replace generic Tests/Planned with concrete items
5. Sharpen Acceptance if vague
6. ready: true only if refine-checklist passes
7. generate-board-json
8. update-decisions-log if acceptance or scope changed
```

---

## Output

```txt
US refined:
File:
Ready for implementation: yes | no
Context filled: yes | partial
Tests concrete: yes | no
Board updated: yes | no
Blockers for implement:
Next step: implement US-XXXX | manager input needed
```

---

## Examples

| Request | Result |
| ------ | --------- |
| `/refine-us US-0070` | Context + tests filled; ready true/false per checklist |
| `/refine-us` without id | Ask which US or infer from conversation |
| `/refine-us US-0001` already ✅ | Block — closed US cannot be refined |

---

## After

```txt
Ready yes → separate conversation: implement docs/us/US-XXXX.md
Ready no → manager fills gaps → /refine-us again
```
