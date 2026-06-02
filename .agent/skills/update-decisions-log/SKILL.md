---
name: update-decisions-log
description: Appends relevant project decisions to docs/11_decisions.md. Use when scope, stack, security, architecture, versions or acceptance criteria change.
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

# Update decisions log

## Selective reading

| Arquivo | Quando ler |
| ------- | ---------- |
| `references/decision-template.md` | Ao append de cada nova entrada |

## Quando registrar

Mudança em: escopo, stack, segurança, usuários, epics, versões, arquitetura, banco, API, ambientes, aceite, governança de agents.

## Procedimento

1. Abrir `docs/11_decisions.md`.
2. Append no final usando `references/decision-template.md`.
3. Se doc `approved` foi alterado → `status: review` nesse doc + mencionar no impacto.
4. **Nunca** editar entradas antigas.

## Arquivamento (> ~200 linhas)

1. Mover entradas antigas para `11_decisions_YYYY.md`
2. Manter arquivo atual enxuto
3. Registrar arquivamento como nova decisão

## Saída

```txt
Decision logged:
Affected document:
Docs moved to review:
Follow-up:
```
