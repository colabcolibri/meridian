---
name: update-decisions-log
description: Prepends relevant project decisions to docs/decisions/YYYY-MM-DD.json (newest first in entries). Use when scope, stack, security, architecture, versions or acceptance criteria change.
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

# Update decisions log

## Selective reading

| Arquivo | Quando ler |
| ------- | ---------- |
| `references/decision-template.md` | Ao registrar cada nova entrada |
| `references/decision-schema.md` | Ao criar arquivo do dia ou validar campos |

## Quando registrar

Mudança em: escopo, stack, segurança, usuários, epics, versões, arquitetura, banco, API, ambientes, aceite, governança de agents.

## Procedimento

1. Determinar a data de hoje (`YYYY-MM-DD`).
2. Abrir ou criar `docs/decisions/YYYY-MM-DD.json`.
3. Inserir **no início** de `entries` usando `references/decision-template.md`.
4. Garantir que `date` no JSON coincide com o nome do arquivo.
5. Entradas antigas permanecem **abaixo**, intactas.
6. Se doc `approved` foi alterado → `status: review` nesse doc + mencionar no impacto.
7. **Nunca** editar ou reordenar entradas antigas.

## Arquivamento

Dias antigos permanecem como arquivos JSON imutáveis em `docs/decisions/`.
Não compactar nem mover entradas antigas — o histórico é append-only por prepend.

## Saída

```txt
Decision logged:
File: docs/decisions/YYYY-MM-DD.json
Affected document:
Docs moved to review:
Follow-up:
```
