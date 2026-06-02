---
description: Close a Meridian user story after implementation — fill technical summary, acceptance and status.
---

# /complete-us — fechar user story

$ARGUMENTS

---

## Regras críticas

1. Use `board-keeper` + `@[skills/complete-user-story]`
2. **Gate:** implementação entregue; testes aplicáveis passaram; `depends_on` em `✅`
3. Template de implementação: `references/implementation-template.md`
4. **Não** marcar `✅` com placeholder em `## Implementação técnica`
5. Regenerar `board.json` ao final
6. `update-decisions-log` só se decisão cross-cutting

---

## Task

```txt
CONTEXT:
- User Request: $ARGUMENTS
- Mode: COMPLETE US

RULES:
1. board-keeper Phase 0 — verify US id and dependencies
2. Inspect git diff / files touched for evidence
3. Fill ## Implementação técnica (Arquivos + camadas)
4. Mark aceite [x]; update ## Testes (Planejado [x] + Executado); set tests_status: done
5. Set status ✅ (or 🔶 + Falta: if partial) — only ✅ if tests: none or tests_status: done
6. generate-board-json
7. update-decisions-log if protocol/architecture changed
```

---

## Saída

```txt
US completed:
File:
Status:
Implementation summary:
Files touched:
Tests run:
Board updated:
Decisions logged:
Open items:
```

---

## Exemplos

| Pedido | Resultado |
| ------ | --------- |
| `/complete-us US-0034` | US-0034 com implementação técnica + ✅ + board |
| `/complete-us` sem id | Perguntar qual US ou inferir da sessão de implementação |
| Implementação parcial | Status 🔶 + Falta: explícito; não forçar ✅ |
