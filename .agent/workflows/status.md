---
description: Report current Meridian project health, blockers and next actions.
---

# /status — saúde do projeto

$ARGUMENTS

---

## Regras críticas

1. **Somente leitura** — não altere docs sem pedido explícito no `$ARGUMENTS`
2. Use `process-manager`
3. Leia `docs/README.md` e frontmatter de `00`–`11`
4. Opcional: `python .agent/scripts/validate_meridian.py <root>`

---

## Task

```txt
CONTEXT:
- User Request: $ARGUMENTS
- Mode: STATUS REPORT

PROCEDURE:
1. Read meridian.md or .agent/MERIDIAN.md
2. Read docs/README.md
3. For each phase doc 00-11: record status from frontmatter
4. Count US by status from docs/us/ or board.json
5. List blockers (missing deps, invalid US, immature docs)
6. Recommend next human decision
```

---

## Saída

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
