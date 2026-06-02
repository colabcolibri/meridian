# Template completo de user story

```md
---
id: US-XXXX
title: Título curto
epic: EPIC-XX
version: vX
status: ❌
moscow: Must
depends_on: []
done_when: "Condição objetiva e mensurável."
---

# US-XXXX — Título curto

**Como** [tipo de usuário documentado em 03_user_types.md],
**quero** [ação],
**para que** [benefício].

## Aceite

- [ ] Critério verificável 1
- [ ] Critério verificável 2
- [ ] 🔶 Parcial — Falta: descrição do que falta

## Implementação técnica

### Backend

_(preencher quando aplicável)_

### Frontend

_(preencher quando aplicável)_

## Testes

- Teste manual ou automatizado com resultado esperado

## Fora de escopo desta story

- O que esta US explicitamente NÃO cobre
- **Não** repita descrição, `outcome` ou escopo do epic — use só `epic: EPIC-XX` no frontmatter

## Notas

- Links, decisões, dependências externas
```

## Status permitidos

| Símbolo | Significado |
| ------- | ----------- |
| ❌ | Não iniciado |
| 🔶 | Parcial (exige `Falta:` no aceite) |
| ✅ | Concluído (exige evidência) |

## MoSCoW

`Must` | `Should` | `Could` | `Won't`
