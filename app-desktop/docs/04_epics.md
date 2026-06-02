---
title: Epics
status: approved
version: 2.0
updated: 2026-06-02
depends_on: [00_scope.md, 03_user_types.md]
blocks: [07_architecture.md]
---

# 04 — Epics

Epics são **capacidades de produto** — não módulos técnicos (`src/…`). Cada epic agrupa user stories em `docs/us/`.

## Onde ficam os épicos

Cada épico é um arquivo em **`docs/epics/`** (pasta flat, um arquivo por epic), no mesmo espírito de `docs/us/`:

```txt
docs/
  epics/
    EPIC-01.md
    EPIC-02.md
    …
  us/
    US-001.md
    …
```

Este documento (`04_epics.md`) é o **índice de fase**: confirma que o catálogo de épicos existe e está aprovado. Detalhes de cada epic ficam nos arquivos individuais.

## Catálogo

| ID      | Título                          | Status   | Versões |
| ------- | ------------------------------- | -------- | ------- |
| EPIC-01 | Estrutura do Projeto            | complete | v0      |
| EPIC-02 | Monitor de Configuração Inicial | complete | v0, v1  |
| EPIC-03 | Validações Meridian             | active   | v1      |
| EPIC-04 | Kanban e User Stories           | active   | v1, v2  |
| EPIC-05 | Ponte VSCode                    | paused   | v2      |
| EPIC-06 | Experiência do monitor          | complete | v1-S2   |

## Regras

- IDs permanentes: `EPIC-01`, `EPIC-02`, … (nunca reutilizar).
- User stories referenciam `epic: EPIC-XX` no frontmatter.
- User stories só podem ser criadas quando **`04_epics.md` e `06_versions.md` estão `approved`**.
- Epic não é módulo de código — é capacidade entregue ao usuário.
