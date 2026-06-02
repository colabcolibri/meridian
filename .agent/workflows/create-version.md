---
description: Create a Meridian release in docs/versions.
---

# /create-version — create version (release)

$ARGUMENTS

---

## Critical rules

1. Use `sprint-planner` or `documentation-strategist` + `@[skills/create-version]`
2. **Gate:** `05_architecture.md` `approved`; solid `00_scope.md` + `03_user_types.md`
3. **Mandatory read:** `.agent/references/templates/INDEX.md` + `version-template.md` + `section-contracts.md` **before** Write
4. Version = **release**, not sprint or folder in `src/`
5. Save in `docs/versions/vX.md` (source of truth)
6. Sprints → `/plan-sprint` or `create-sprint` later

---

## Task

```txt
CONTEXT:
- User Request: $ARGUMENTS
- Mode: CREATE VERSION

RULES:
1. Phase 0 — scope + user types + architecture approved
2. List docs/versions/v*.md → next vX
3. Fill version-template.md (outcome, goal, in/out)
4. Save docs/versions/vX.md
5. update-decisions-log if release boundaries change
6. validate_meridian.py
```

---

## Output

```txt
Version created:
File:
Outcome:
version file saved: yes | no
Next: /plan-sprint for sprints → /create-us
```
