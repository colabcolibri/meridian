---
description: Create a Meridian epic in SQLite.
---

# /create-epic — create epic

$ARGUMENTS

---

## Critical rules

1. Use `product-owner` + `@[skills/create-epic]`
2. **Mandatory read:** `writing-guide.md` + `epic-template.md` **before** Write
3. **Gate:** `05_architecture.md` + `03_user_types.md` approved
4. Capability = **≥2 paragraphs** (problem → product behavior)
5. Expected outcome = **1 paragraph** observable done-state
6. Do not create US in same turn

---

## Task

```txt
CONTEXT:
- User Request: $ARGUMENTS
- Mode: CREATE EPIC

RULES:
1. Phase 0 — who uses it, what friction exists today, what changes
2. Next EPIC-XX id
3. Write prose Capability + Expected outcome (see writing-guide golden example)
4. Out of scope — bullets with rationale
5. Upsert: `meridian_db_cli.py create-epic` or `meridian_db_export.py --write-form`
6. validate_meridian.py . --sqlite-only
```

---

## Output

```txt
Epic created:
Id: EPIC-XX
SQLite saved: yes | no
Problem summarized (one line):
Outcome:
Next: /create-us for executable slices
```
