# Meridian Desktop Docs

Esta pasta é a **fonte de verdade** do desenvolvimento do Meridian Desktop. No dogfooding, abra **esta pasta** (`app-desktop/docs/`) no monitor — não a raiz do repositório nem só `app-desktop/`.

## Repositório (kit Meridian)

| Arquivo                                                            | Papel                                  |
| ------------------------------------------------------------------ | -------------------------------------- |
| [`../../README.md`](../../README.md)                               | Onboarding do repositório (Git/GitHub) |
| [`../../meridian.md`](../../meridian.md)                           | Protocolo e produto Meridian           |
| [`../../.agent/MERIDIAN.md`](../../.agent/MERIDIAN.md)             | Protocolo master para agentes          |
| [`../../.agent/rules/MERIDIAN.md`](../../.agent/rules/MERIDIAN.md) | Regras globais (`trigger: always_on`)  |
| [`../../.agent/ARCHITECTURE.md`](../../.agent/ARCHITECTURE.md)     | Mapa de agents, skills e workflows     |

## Documentos de fase (este app)

| Documento                                  | Status   | Propósito                                    |
| ------------------------------------------ | -------- | -------------------------------------------- |
| [00_scope.md](00_scope.md)                 | approved | Escopo do app desktop e limites              |
| [01_tech_stack.md](01_tech_stack.md)       | approved | React, TypeScript, Vite, Tailwind, shadcn/ui |
| [02_security.md](02_security.md)           | approved | Segurança da versão local                    |
| [03_user_types.md](03_user_types.md)       | approved | Perfis de uso                                |
| [04_epics.md](04_epics.md)                 | approved | Índice de épicos (detalhes em `epics/`)      |
| [05_principles.md](05_principles.md)       | approved | Princípios de implementação                  |
| [06_versions.md](06_versions.md)           | approved | Versões, sprints e tabela de US              |
| [07_architecture.md](07_architecture.md)   | approved | Arquitetura do app (parser, pasta docs)      |
| [08_database.md](08_database.md)           | draft    | Fora do escopo inicial                       |
| [09_api_contracts.md](09_api_contracts.md) | draft    | Fora do escopo inicial                       |
| [10_environments.md](10_environments.md)   | approved | Comandos locais e Git hooks                  |
| [11_decisions.md](11_decisions.md)         | approved | Log append-only                              |

## Artefatos de execução

| Artefato       | Caminho                                  | Papel                                          |
| -------------- | ---------------------------------------- | ---------------------------------------------- |
| Épicos         | [`epics/`](epics/)                       | Um arquivo por EPIC-XX (capacidade de produto) |
| User stories   | [`us/`](us/)                             | Backlog (uma US = um arquivo)                  |
| Board derivado | [`kanban/board.json`](kanban/board.json) | Kanban gerado das US — não editar à mão        |

## Versão e sprint atuais

| Sprint              | Status    | US                                  |
| ------------------- | --------- | ----------------------------------- |
| v0-S1 Fundação      | ✅        | US-001–007                          |
| v0-S2 Monitor shell | ✅        | US-008                              |
| v1-S1 Leitura real  | ✅        | US-009 → US-017, US-016             |
| v1-S2 UX do monitor | ✅        | US-018 → US-022 (EPIC-06)           |
| **v2**              | planejado | VSCode / escrita em disco (EPIC-05) |

## Como agents devem trabalhar

1. Escolher US em `06_versions.md` (próximo marco: v2 quando definido).
2. Implementar citando `US-XXX` no contexto.
3. Atualizar frontmatter da US (`🔶` + `Falta:` ou `✅` com evidência).
4. Regenerar `board.json` (skill `generate-board-json` ou script).
5. Decisões relevantes → append em `11_decisions.md`.

## Dogfooding no app

```bash
cd app-desktop && pnpm dev
```

No monitor: **Abrir pasta docs** → selecionar `app-desktop/docs/`.
