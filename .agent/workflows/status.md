---
description: Report current Meridian project health, blockers and next actions.
---

# /status — project health

$ARGUMENTS

---

## Critical rules

1. **Read-only** — do not change docs without explicit request in `$ARGUMENTS`
2. Use `process-manager`
3. Read `docs/README.md` and frontmatter of `00`–`11`
4. Optional: `python .agent/scripts/validate_meridian.py <root>`

---

## Task

```txt
CONTEXT:
- User Request: $ARGUMENTS
- Mode: STATUS REPORT

PROCEDURE:
1. Read .agent/MERIDIAN.md
2. Read docs/README.md
3. For each phase doc 00–08 and 11: record status from frontmatter
4. Count US by status from docs/us/ or board.json
5. List blockers (missing deps, invalid US, immature docs)
6. Recommend next human decision
```

---

## Output

```txt
Current phase:
Docs:
  00_scope: [status]
  ...
US summary: ❌ n | 🔶 n | ✅ n
Board in sync: yes | no
Ready:
Blocked:
Next action (human):
Next action (agent):
Validation warnings:
```
