---
description: Plan a Meridian version or sprint without writing implementation code.
---

# /plan-sprint — plan version/sprint

$ARGUMENTS

---

## Critical rules

1. **NO CODE** — only SQLite delivery rows (`versions`, `sprints`, `user_stories`) when gate OK
2. Use `sprint-planner` + `@[skills/create-sprint]` + `@[skills/create-user-story]` when applicable
3. Requires `05_architecture.md` approved
4. **Mandatory read:** `sprint-template.md` (+ `us-template.md` + `section-contracts.md` if creating US) **before** Write
5. New US only with epic/version referenced in SQLite
6. Sprints in **`sprints` table** — one row per sprint
7. Log scope shifts → read `@[skills/update-decisions-log]` + run `date` before Write
8. After changing US → extension refreshes on `meridian.db` save
9. `validate_meridian.py` on project folder when available

---

## Task

```txt
CONTEXT:
- User Request: $ARGUMENTS
- Mode: PLANNING ONLY

RULES:
1. sprint-planner Phase 0 context check
2. Update SQLite `versions` and `sprints` as needed
3. MoSCoW per US
4. Explicit dependency order — stories: [US-…] order = sprint priority (no story points)
5. Capacity = Must US + ready + deps + human judgment (see scrum-meridian-map.md)
6. Active sprint: do not expand scope without manager; log scope shifts in decisions
7. Log decisions if scope/version changes — read `update-decisions-log` skill + run `date` before Write
8. NO app/API/DB implementation files
9. validate_meridian.py when available
```

Read `.agent/references/scrum-meridian-map.md` for sprint ↔ ceremony mapping.

---

## Deliverables

| Item | Location |
| ---- | ----- |
| Planned version | SQLite `versions` |
| Sprint | SQLite `sprints` |
| New US | SQLite `user_stories` (only if preconditions OK) |

---

## Output

```txt
Version:
Sprint:
US in scope:
Dependency order:
Blocked US:
SQLite saved: yes | no (versions/sprints/US rows)
Human approval needed:
```

---

## After

```txt
Next: review release with manager → /create-us for stories
```
