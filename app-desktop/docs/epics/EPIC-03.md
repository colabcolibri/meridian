---
id: EPIC-03
title: Validações Meridian
status: complete
versions: [v1]
profiles: [Manager do Processo, Operador Local, Futuro Usuário VSCode]
outcome: "Violations do protocolo aparecem no app e em validate_meridian.py antes de marcar US como concluída."
---

# EPIC-03 — Validações Meridian

## Capacidade

Tornar regras do protocolo visíveis e auditáveis: dependências entre docs de fase, US `🔶` sem `Falta:`, referências de epic inexistentes, divergência board vs arquivos.

## Resultado esperado

Manager vê alertas acionáveis no monitor; desenvolvedor/agente roda `validate_meridian.py` e obtém lista clara de erros antes de commit.

## Fora deste epic

- UI de edição de docs (EPIC-05).
- Autofix de board ou docs (futuro).
