---
description: Create a Meridian release in SQLite.
---

# /create-version — create version (release)

$ARGUMENTS

---

## Critical rules

1. Use `sprint-planner` + `@[skills/create-version]`
2. **Mandatory read:** `writing-guide.md` + `version-template.md`
3. **Gate:** `05_architecture.md` approved; scope + user types solid
4. Objective + Done criteria = **paragraphs**, not one-liners

---

## Task

```txt
CONTEXT:
- User Request: $ARGUMENTS
- Mode: CREATE VERSION

RULES:
1. Next vX id
2. Write Objective paragraph — release theme for user/manager
3. Write Done criteria paragraph — observable complete state
4. Included — epics/US with one explanatory line each
5. Upsert: `meridian_db_cli.py create-version` or `meridian_db_export.py --write-form`
6. validate_meridian.py . --sqlite-only
```

---

## Output

```txt
Version created:
Id: vX
SQLite saved: yes | no
Release theme (one line):
Next: /plan-sprint → /create-us
```
