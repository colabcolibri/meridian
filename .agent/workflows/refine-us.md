---
description: Refine a user story for implementation — deepen Approach, architecture refs and tests.
---

# /refine-us — refine user story

$ARGUMENTS

---

## Critical rules

1. Use `board-keeper` + `@[skills/refine-user-story]`
2. **Mandatory read:** `writing-guide.md` (refine section) + `refine-checklist.md`
3. **NO product code** — docs only
4. Approach bullets must **explain** (full sentences) — not bare paths
5. `ready: true` only when checklist passes

---

## Task

```txt
CONTEXT:
- User Request: $ARGUMENTS
- Mode: REFINE US

RULES:
1. Read US, depends_on US, cited architecture sections
2. Deepen ### Approach — each bullet: what + where + why
3. Fix ### Architecture refs — exact § heading from 05_architecture.md
4. Concrete Tests/Planned — numbered manual steps or commands
5. Fix Why/Where only if create left real gaps
6. ready: true iff checklist passes
7. generate-board-json
```

---

## Output

```txt
US refined:
File:
Ready: yes | no
Approach quality: explanatory | still thin
Tests: concrete | generic
Next: implement | /refine-us again
```
