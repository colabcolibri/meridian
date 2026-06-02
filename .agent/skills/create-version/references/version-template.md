# Template de versão (release)

```md
---
id: vX
title: Nome curto do release
status: planned
outcome: "Quando este release está entregue no nível produto."
---

# vX — Nome curto do release

## Objetivo

Frase clara do que este release entrega ao usuário/manager.

## Critério de Done

Condição objetiva para marcar a versão como `complete`.

## Incluído nesta versão

- Capacidades e US previstas (referência por ID, não copiar texto de epics)

## Explicitamente fora

- O que fica para versões futuras

## Checklist go-live

### Produto

- [ ] …

## Sprints

- `vX-S1` — (criar em docs/sprints/ com create-sprint)
```

## Status

| Valor | Significado |
| ----- | ----------- |
| `planned` | Definida, ainda sem entrega |
| `active` | Release em andamento |
| `complete` | Outcome atingido |

## Relação com US e epics

- US usa `version: vX` no frontmatter — referência por ID.
- Epic usa `versions: [vX]` — em quais releases a capacidade participa.
- Detalhe da versão fica **só** neste arquivo.
