---
title: Epics
status: approved
version: 1.1
updated: 2026-06-02
depends_on: [00_scope.md, 03_user_types.md]
blocks: [07_architecture.md]
---

# 04 — Epics

Epics são **capacidades de produto** para quem gerencia o processo com agentes — não módulos técnicos (`src/…`). Cada epic agrupa user stories em `docs/us/`.

## EPIC-01 — Estrutura do Projeto

- **Descrição:** fundação do repositório e do app Vite: separação protocolo (`meridian.md`, `.agent/`) vs `app-desktop/`, qualidade local (Git, lint) e kit operacional para agentes.
- **Versões:** v0
- **Perfis envolvidos:** Manager do Processo, Operador Local
- **Status:** complete

## EPIC-02 — Monitor de Configuração Inicial

- **Descrição:** aba **Configuração inicial**: progresso dos `docs/00–11`, um estado legível por etapa, **leitura inline de cada `.md`** (frontmatter + conteúdo) e sincronização com a pasta monitorada (v1).
- **Versões:** v0 (shell + mock), v1 (leitura real + ler .md inline)
- **Perfis envolvidos:** Manager do Processo, Operador Local
- **Status:** complete

## EPIC-03 — Validações Meridian

- **Descrição:** regras do protocolo visíveis no app e via `validate_meridian.py`: dependências entre docs, US `🔶` sem `Falta:`, inconsistências (ex.: doc `approved` com predecessores abertos).
- **Versões:** v1
- **Perfis envolvidos:** Manager do Processo, Operador Local, Futuro Usuário VSCode
- **Status:** active

## EPIC-04 — Kanban e User Stories

- **Descrição:** aba **Kanban**: colunas por status de US (`❌` `🔶` `✅` `🧊`), filtro por epic, sincronização com `docs/us/*.md` e `docs/kanban/board.json` derivado; aba **Épicos** lê `04_epics.md`.
- **Versões:** v1 (leitura), v2 (criação/edição no editor)
- **Perfis envolvidos:** Manager do Processo, Operador Local, Futuro Usuário VSCode
- **Status:** active

## EPIC-05 — Ponte VSCode

- **Descrição:** extensão no editor para escrita real em Markdown, geração de board e operação da pasta no workspace.
- **Versões:** v2
- **Perfis envolvidos:** Futuro Usuário VSCode
- **Status:** paused

## EPIC-06 — Experiência do monitor

- **Descrição:** interface clara para o manager: onboarding para abrir `docs/`, linguagem não técnica, hierarquia visual (uma ação principal por tela), kanban legível e ferramentas avançadas recolhidas.
- **Versões:** v1-S2 (polish pós-MVP)
- **Perfis envolvidos:** Manager do Processo, Operador Local
- **Status:** complete
