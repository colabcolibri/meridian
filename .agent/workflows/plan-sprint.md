---
description: Plan a Meridian version or sprint without writing implementation code.
---

# /plan-sprint — plan version/sprint

$ARGUMENTS

---

## Critical rules

1. **NO CODE** — only `docs/versions/`, `docs/sprints/` and US (if gate OK)
2. Use `sprint-planner` + `@[skills/create-sprint]` + `@[skills/create-user-story]` when applicable
3. Requires `05_architecture.md` approved
4. New US only with epic/version referenced in existing folders
5. Sprints in **`docs/sprints/`** — one file per sprint
6. After changing US → `/sync-board`

---

## Task

```txt
CONTEXT:
- User Request: $ARGUMENTS
- Mode: PLANNING ONLY

RULES:
1. sprint-planner Phase 0 context check
2. Update docs/versions/ and docs/sprints/ as needed
3. MoSCoW per US
4. Explicit dependency order
5. Log decisions if scope/version changes
6. NO app/API/DB implementation files
```

---

## Deliverables

| Item | Location |
| ---- | ----- |
| Planned version | `docs/versions/vX.md` |
| Sprint doc | `docs/sprints/vX-SY.md` |
| New US | `docs/us/` (only if preconditions OK) |

---

## Output

```txt
Version:
Sprint:
US in scope:
Dependency order:
Blocked US:
Board synced: yes | no
Human approval needed:
```

---

## After

```txt
Next: review release with manager → /create-us for stories → /sync-board
```
