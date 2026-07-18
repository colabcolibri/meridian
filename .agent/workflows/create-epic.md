---
description: Create a Meridian epic in SQLite.
---

# /create-epic — create epic

$ARGUMENTS

---

## Critical rules

1. Use `documentation-strategist` + `@[skills/create-epic]`
2. **Mandatory read:** `writing-guide.md` + `epic-template.md`
3. **Gate:** `05_architecture.md` + `03_user_types.md` approved
4. Upsert via `create-epic` + `meridian_db_export.py --write` — never `docs/epics/`
5. Do not create US in same turn

---

## Output

```txt
Epic created:
ID: EPIC-XX
Outcome:
Next: /create-us for slices
```
