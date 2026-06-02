# Meridian Desktop Docs

Esta pasta é a fonte de verdade do desenvolvimento do Meridian Desktop.

## Repositório (kit Meridian)

| Arquivo                                                            | Papel                                  |
| ------------------------------------------------------------------ | -------------------------------------- |
| [`../../README.md`](../../README.md)                               | Onboarding do repositório (Git/GitHub) |
| [`../../meridian.md`](../../meridian.md)                           | Protocolo e produto Meridian           |
| [`../../.agent/MERIDIAN.md`](../../.agent/MERIDIAN.md)             | Protocolo master para agentes          |
| [`../../.agent/rules/MERIDIAN.md`](../../.agent/rules/MERIDIAN.md) | Regras globais (`trigger: always_on`)  |
| [`../../.agent/ARCHITECTURE.md`](../../.agent/ARCHITECTURE.md)     | Mapa de agents, skills e workflows     |

Este app (`app-desktop/`) é uma camada visual que monitora uma pasta de projeto Meridian; não substitui `docs/` do projeto monitorado.

## Documentos de fase (este app)

| Documento                                  | Status   | Propósito                                    |
| ------------------------------------------ | -------- | -------------------------------------------- |
| [00_scope.md](00_scope.md)                 | approved | Escopo do app desktop e limites              |
| [01_tech_stack.md](01_tech_stack.md)       | approved | React, TypeScript, Vite, Tailwind, shadcn/ui |
| [02_security.md](02_security.md)           | approved | Segurança da versão local                    |
| [03_user_types.md](03_user_types.md)       | approved | Perfis de uso                                |
| [04_epics.md](04_epics.md)                 | approved | Capacidades do produto                       |
| [05_principles.md](05_principles.md)       | approved | Princípios de implementação                  |
| [06_versions.md](06_versions.md)           | approved | v0, v1, sprints                              |
| [07_architecture.md](07_architecture.md)   | draft    | Arquitetura do app                           |
| [08_database.md](08_database.md)           | pending  | Fora do escopo inicial                       |
| [09_api_contracts.md](09_api_contracts.md) | pending  | Fora do escopo inicial                       |
| [10_environments.md](10_environments.md)   | approved | Comandos locais e Git hooks                  |
| [11_decisions.md](11_decisions.md)         | approved | Log append-only                              |

## Artefatos de execução

- User stories: [`us/`](us/)
- Board derivado: [`kanban/board.json`](kanban/board.json)

Versão atual: **v0 — Foundation**.

Próximo milestone: abertura real de pasta Meridian, parser de frontmatter e validações alinhadas ao script `validate_meridian.py`.
