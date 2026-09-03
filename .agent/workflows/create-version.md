---
description: Create a Meridian version row in SQLite.
---

# /create-version — create version

$ARGUMENTS

---

## Critical rules

1. Use `sprint-planner` + `@[skills/version-create]`
2. **Mandatory read:** `version-template.md`
3. `version-create` + `update-version` (stdin heredoc) — never `docs/versions/`

---

## Output

```txt
Version created:
ID: vX
Next: /plan-sprint
```
