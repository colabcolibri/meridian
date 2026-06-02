---
description: Create a Meridian user story after checking epics, versions and dependencies.
---

# /create-us — create user story

$ARGUMENTS

---

## Critical rules

1. Use `board-keeper` + `@[skills/create-user-story]`
2. **Gate:** `05_architecture` = `approved`; referenced epic must exist in `docs/epics/` (otherwise → `/create-epic` first)
3. Template: `references/us-template.md`
4. Regenerate `board.json` at the end
5. Do not mark `✅` on creation — starts as `❌`
6. Post-implementation closure → `/complete-us` + skill `complete-user-story`

---

## Task

```txt
CONTEXT:
- User Request: $ARGUMENTS
- Mode: CREATE US

RULES:
1. board-keeper Phase 0 — verify prerequisites
2. If blocked, report smallest doc to fix
3. Assign next `US-XXXX` id (4 digits, zero-padded)
4. Fill template with measurable done_when
5. generate-board-json
6. update-decisions-log if acceptance model changes
```

---

## Output

```txt
US created:
File:
Epic:
Version:
Depends on:
Board updated:
Open questions:
```

---

## Examples

| Request | Result |
| ------ | --------- |
| `/create-us manager login` | US-00N with explicit epic/version |
| `/create-us` without epic | Ask epic + version before saving |
