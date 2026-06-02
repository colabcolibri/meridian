# Template completo de epic

```md
---
id: EPIC-XX
title: Nome curto da capacidade
status: active
versions: [v1]
profiles: [Perfil documentado em 03_user_types.md]
outcome: "Frase objetiva: quando este epic está entregue no nível produto."
---

# EPIC-XX — Nome curto da capacidade

## Capacidade

O que o usuário passa a conseguir fazer ou o que o produto passa a oferecer.
Descreva em linguagem de produto, não de pasta ou classe em `src/`.

## Resultado esperado

Parágrafo que expande o `outcome` do frontmatter — como o manager sabe que vale marcar o epic como `complete`.

## Fora deste epic

- O que pertence a outro epic ou versão
- O que é detalhe de implementação (isso vai em US)

## Notas

- Links, decisões em `docs/decisions/`, riscos
```

## Status do epic

| Valor | Significado |
| ----- | ----------- |
| `active` | Capacidade em entrega; US podem ser criadas |
| `complete` | Outcome atingido; só US de encerramento ou bugfix |
| `paused` | Deliberadamente congelado (ex.: v2 distante) |

## Relação com user stories

- Epic = **o quê** e **por quê** (capacidade de produto).
- US = **fatia executável** com aceite verificável.
- Na US use apenas: `epic: EPIC-XX` — referência por ID, sem colar texto do epic.

## Depois de criar

1. Validar com `python .agent/scripts/validate_meridian.py <project-root>`.
2. Só criar US quando `05_architecture.md` estiver `approved` e epic/version existirem nas pastas.
3. US novas → skill `create-user-story`.
