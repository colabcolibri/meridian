---
description: Create a Meridian release in docs/versions and update the 06_versions index.
---

# /create-version — criar versão (release)

$ARGUMENTS

---

## Regras críticas

1. Use `sprint-planner` ou `documentation-strategist` + `@[skills/create-version]`
2. **Gate:** `00_scope.md` + `03_user_types.md` sólidos
3. Template: `references/version-template.md`
4. Versão = **release**, não sprint nem pasta em `src/`
5. Atualizar tabela em `06_versions.md`
6. Sprints → `/plan-sprint` ou `create-sprint` depois

---

## Task

```txt
CONTEXT:
- User Request: $ARGUMENTS
- Mode: CREATE VERSION

RULES:
1. Phase 0 — scope + user types
2. List docs/versions/v*.md → next vX
3. Fill version-template.md (outcome, objetivo, in/out)
4. Save docs/versions/vX.md
5. Update 06_versions.md catalog
6. update-decisions-log if release boundaries change
7. validate_meridian.py
```

---

## Saída

```txt
Version created:
File:
Outcome:
06_versions index updated:
Next: /plan-sprint for sprints → /create-us
```
