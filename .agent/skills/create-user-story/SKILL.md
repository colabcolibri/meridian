---
name: create-user-story
description: Creates a valid Meridian user story after epics and versions are approved. Use when adding work to docs/us and keeping acceptance criteria concrete.
---

# Skill — Criar User Story Meridian

Use esta skill quando o usuário pedir para criar uma nova user story.

## Pré-condições

Antes de criar uma US, confirme:

- `04_epics.md` está `approved`;
- `06_versions.md` está `approved`;
- o epic existe;
- a versão existe;
- os perfis citados existem em `03_user_types.md`;
- dependências citadas existem ou serão criadas antes.

Se alguma pré-condição falhar, não crie a US como válida.
Explique o bloqueio e proponha o menor documento necessário para avançar.

## Entradas esperadas

- Capacidade desejada.
- Perfil de usuário.
- Epic.
- Versão.
- Prioridade MoSCoW.
- Dependências conhecidas.
- Critério objetivo de conclusão.

Se o usuário pedir uma feature vaga, transforme em pergunta de produto:

- Quem usa?
- Qual ação quer fazer?
- Para qual benefício?
- Como saberemos que terminou?

## ID

1. Leia `docs/us/`.
2. Encontre o maior ID `US-XXX`.
3. O próximo ID é `max + 1`.
4. Não reutilize IDs removidos.

## Template

```md
---
id: US-XXX
title: Título curto
epic: EPIC-XX
version: vX
status: ❌
moscow: Must | Should | Could | Won't
depends_on: []
done_when: "Condição objetiva e mensurável."
---

# US-XXX — Título curto

**Como** [tipo de usuário],
**quero** [ação],
**para que** [benefício].

## Aceite

- Condição objetiva e verificável

## Implementação técnica

### Backend

### Frontend

## Testes

## Fora de escopo desta story

## Notas
```

## Regras

- `done_when` deve ser curto e mensurável.
- `🔶` exige `Falta:` no aceite.
- `✅` exige evidência de aceite.
- Se depende de outra US, não pode sair de `❌` antes das dependências ficarem `✅`.
- Atualize `board.json` depois de criar a US.

## Validações antes de salvar

- ID é novo.
- Epic existe.
- Versão existe.
- Perfil de usuário existe.
- `done_when` não está vazio.
- Fora de escopo está preenchido quando houver risco de ambiguidade.
- Testes ou validações manuais estão declarados.

## Formato de resposta

```txt
US created:
File:
Epic:
Version:
Depends on:
Board updated:
Open questions:
```
