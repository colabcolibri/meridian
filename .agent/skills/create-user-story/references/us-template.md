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
tests: required
tests_status: pending
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

> Na **criação**: placeholder abaixo. Ao **concluir** (`✅`): skill `complete-user-story` — substituir pelo registro real (arquivos + camadas).

### Arquivos

_(preencher ao concluir a implementação)_

### Backend

_(preencher quando aplicável)_

### Frontend

_(preencher quando aplicável)_

### Scripts / Docs

_(preencher quando aplicável)_

## Testes

> Na **criação**: preencher **Planejado**. Ao **fechar** (`complete-user-story`): marcar `[x]` e registrar em **Executado**; atualizar `tests_status: done`.

### Planejado

- [ ] **automated** — `pnpm test` — descrever escopo
- [ ] **manual** — passos e resultado esperado

### Executado

_(pendente)_

## Fora de escopo desta story

- O que esta US explicitamente NÃO cobre
- **Não** repita descrição, `outcome` ou escopo do epic — use só `epic: EPIC-XX` no frontmatter

## Notas

- Links, decisões, dependências externas
```

## Status permitidos (frontmatter)

| Símbolo | Significado |
| ------- | ----------- |
| ❌ | Não iniciado |
| 🔶 | Parcial (exige `Falta:` no aceite) |
| ✅ | Concluído (aceite + implementação + testes quando `tests: required`) |

## Campos de teste

| Campo | Valores | Regra |
| ----- | ------- | ----- |
| `tests` | `required` / `none` | Default `required` |
| `tests_status` | `pending` / `done` / `n/a` | `n/a` só com `tests: none`; `done` antes de `status: ✅` |

No **quadro do monitor**, coluna `🧪` = `tests_status: pending` — não grave emoji no YAML.

## MoSCoW

`Must` | `Should` | `Could` | `Won't`

## Fechamento

Após implementação → skill `complete-user-story` ou workflow `/complete-us` (não marcar `✅` na criação).
