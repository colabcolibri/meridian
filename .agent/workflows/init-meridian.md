---
description: Initialize Meridian on a project — phase docs in docs/, delivery in SQLite.
---

# /init-meridian — bootstrap project

$ARGUMENTS

---

## Critical rules

1. Use `process-manager` + `@[skills/init-project]`
2. **Mandatory read:** `doc-templates.md` before creating phase files
3. Run `meridian_delivery.py bootstrap` for SQLite delivery store
4. Register initial decision via `prepend-decision` (not JSON)
5. **NO product code** in init turn

---

## Task

```txt
Mode A (new) or Mode B (existing codebase) per init-project SKILL
1. Create docs/ phase docs (00–11) — not delivery folders
2. meridian_delivery.py bootstrap
3. 11_decisions.md stub + prepend-decision "Project started with Meridian"
4. validate_meridian.py
```

---

## Output

```txt
Init complete:
Phase docs: docs/00_scope.md …
Delivery: .meridian/meridian.db
Decision logged: yes
Next: approve 00_scope → Phase 2
```
