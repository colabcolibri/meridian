---
description: Create a Meridian user story after checking epics, versions and dependencies.
---

# /create-us — criar user story

$ARGUMENTS

---

## Regras críticas

1. Use `board-keeper` + `@[skills/create-user-story]`
2. **Gate:** `05_architecture` = `approved`; epic referenciado deve existir em `docs/epics/` (senão → `/create-epic` primeiro)
3. Template: `references/us-template.md`
4. Regenerar `board.json` ao final
5. Não marcar `✅` na criação — nasce `❌`
6. Fechamento pós-implementação → `/complete-us` + skill `complete-user-story`

---

## Task

```txt
CONTEXT:
- User Request: $ARGUMENTS
- Mode: CREATE US

RULES:
1. board-keeper Phase 0 — verify prerequisites
2. If blocked, report smallest doc to fix
3. Assign next `US-XXXX` id (4 dígitos, zero à esquerda)
4. Fill template with measurable done_when
5. generate-board-json
6. update-decisions-log if acceptance model changes
```

---

## Saída

```txt
US created:
File:
Epic:
Version:
Depends on:
Board updated:
Open questions:
```

---

## Exemplos

| Pedido | Resultado |
| ------ | --------- |
| `/create-us login do manager` | US-00N com epic/version explícitos |
| `/create-us` sem epic | Perguntar epic + versão antes de salvar |
