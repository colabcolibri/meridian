---
description: Plan a Meridian version or sprint without writing implementation code.
---

# /plan-sprint — planejar versão/sprint

$ARGUMENTS

---

## Regras críticas

1. **SEM CÓDIGO** — apenas `06_versions.md`, sprints e US (se já aprovado criar US)
2. Use `sprint-planner`
3. Exige `04_epics.md` approved
4. Novas US só se `06_versions` approved
5. Ao alterar US → `/sync-board`

---

## Task

```txt
CONTEXT:
- User Request: $ARGUMENTS
- Mode: PLANNING ONLY

RULES:
1. sprint-planner Phase 0 context check
2. Update 06_versions.md and docs/sprints/ as needed
3. MoSCoW per US
4. Explicit dependency order
5. Log decisions if scope/version changes
6. NO app/API/DB implementation files
```

---

## Entregáveis

| Item | Local |
| ---- | ----- |
| Versão planejada | `docs/06_versions.md` |
| Sprint doc | `docs/sprints/` (se aplicável) |
| US novas | `docs/us/` (somente se pré-condições OK) |

---

## Saída

```txt
Version:
Sprint:
US in scope:
Dependency order:
Blocked US:
Board synced: yes | no
Human approval needed:
```

---

## Depois

```txt
Próximo: revisar 06_versions com manager → /create-us para stories → /sync-board
```
