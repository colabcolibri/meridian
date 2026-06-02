---
description: Initialize a project using the Meridian protocol and minimum governance.
---

# /init-meridian — inicializar projeto

$ARGUMENTS

---

## Regras críticas

1. **SEM CÓDIGO DE PRODUTO** — apenas estrutura `docs/` e governança
2. Use o agent `process-manager`, não modo plan genérico do IDE
3. Siga `@[skills/init-project]` e fases do `process-manager`
4. Máximo 3 perguntas se intenção do projeto estiver vaga
5. Registre decisão inicial em `docs/decisions/YYYY-MM-DD.json`

---

## Task

Use `process-manager` com este contexto:

```txt
CONTEXT:
- User Request: $ARGUMENTS
- Mode: INIT ONLY (no product code)
- Target: project root (confirm with user if ambiguous)

RULES:
1. Read .agent/MERIDIAN.md or meridian.md
2. Run init-project skill procedure
3. Create docs/ tree per skill
4. 00_scope.md = draft
5. `11_decisions.md` stub + primeira entrada JSON em `docs/decisions/`
6. board.json = []
7. Validate .gitignore baseline
8. REPORT exact paths created
```

---

## Entregáveis

| Item | Local |
| ---- | ----- |
| Estrutura docs | `docs/` + subpastas |
| Escopo inicial | `docs/00_scope.md` |
| Log de decisões | `docs/decisions/YYYY-MM-DD.json` + stub `11_decisions.md` |
| Board vazio | `docs/kanban/board.json` |

---

## Saída esperada

```txt
Meridian initialized:
Created:
Pending:
Blocked:
Assumptions:
Next human decision:
```

---

## Depois

Informe ao usuário:

```txt
Próximos passos:
1. Revisar docs/00_scope.md
2. Preencher 01_tech_stack, 02_security, 03_user_types, 04_principles
3. Aprovar 05_architecture (+ 08–10 se aplicável)
4. Planejar entrega: /create-version, /create-epic — planejar epics/versions/sprints nas pastas
5. /create-us (gate: 04 + 06 approved) → implementar → /complete-us → /sync-board
```
