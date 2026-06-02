---
description: Create a Meridian release in docs/versions.
---

# /create-version — criar versão (release)

$ARGUMENTS

---

## Regras críticas

1. Use `sprint-planner` ou `documentation-strategist` + `@[skills/create-version]`
2. **Gate:** `05_architecture.md` `approved`; `00_scope.md` + `03_user_types.md` sólidos
3. Template: `references/version-template.md`
4. Versão = **release**, não sprint nem pasta em `src/`
5. Salvar em `docs/versions/vX.md` (fonte de verdade)
6. Sprints → `/plan-sprint` ou `create-sprint` depois

---

## Task

```txt
CONTEXT:
- User Request: $ARGUMENTS
- Mode: CREATE VERSION

RULES:
1. Phase 0 — scope + user types + architecture approved
2. List docs/versions/v*.md → next vX
3. Fill version-template.md (outcome, objetivo, in/out)
4. Save docs/versions/vX.md
5. update-decisions-log if release boundaries change
6. validate_meridian.py
```

---

## Saída

```txt
Version created:
File:
Outcome:
version file saved: yes | no
Next: /plan-sprint for sprints → /create-us
```
