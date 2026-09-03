---
description: Plan a Meridian version or sprint in SQLite without writing implementation code.
---

# /plan-sprint — plan version/sprint

$ARGUMENTS

---

## Critical rules

1. **NO CODE** — only SQLite delivery (`versions`, `sprints`, `user_stories`)
2. Use `sprint-planner` + `version-create` / `sprint-create` skills. New US → `/create-us` (`story-maker`), not this planner.
3. Requires `05_architecture.md` approved
4. Log scope shifts → `prepend-decision` (read `update-decisions-log` skill + run `date`)
5. `validate_meridian.py` when available

---

## Deliverables

| Item | Store |
| ---- | ----- |
| Version | `versions` table |
| Sprint | `sprints` table |
| New US | `user_stories` table (if gate OK) |

---

## Output

```txt
Planning complete:
Version:
Sprint:
Stories:
SQLite saved: yes
Next: /refine-us …
```
