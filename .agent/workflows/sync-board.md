---
description: Regenerate docs/kanban/board.json from Meridian user stories.
---

# /sync-board — sincronizar board

$ARGUMENTS

---

## Regras críticas

1. Use `board-keeper` + `@[skills/generate-board-json]`
2. Fonte de verdade: `docs/us/*.md` apenas
3. Não preservar entradas órfãs no JSON
4. Reportar US inválidas sem exportar
5. Opcional: `validate_meridian.py`

---

## Task

```txt
CONTEXT:
- User Request: $ARGUMENTS
- Mode: SYNC BOARD

RULES:
1. Glob docs/us/US-*.md
2. Validate per board-schema reference
3. Write docs/kanban/board.json sorted by id
4. List invalid stories and warnings
```

---

## Saída

```txt
Stories read:
Stories exported:
Invalid stories:
Board path:
Warnings:
```
