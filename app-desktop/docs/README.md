# Meridian Desktop Docs

Esta pasta é a fonte de verdade do desenvolvimento do Meridian Desktop.

A explicação do projeto fica em `../../meridian.md`.
O protocolo operacional para agentes fica em `../../.agent/MERIDIAN.md`.
Este app é uma camada visual que monitora uma pasta de projeto que usa Meridian.

| Documento                                  |   Status | Propósito                                                 |
| ------------------------------------------ | -------: | --------------------------------------------------------- |
| [00_scope.md](00_scope.md)                 | approved | Define o escopo do app desktop e seus limites.            |
| [01_tech_stack.md](01_tech_stack.md)       | approved | Registra React, TypeScript, Vite, Tailwind e shadcn/ui.   |
| [02_security.md](02_security.md)           | approved | Define riscos e limites de segurança para a versão local. |
| [03_user_types.md](03_user_types.md)       | approved | Define os perfis iniciais de uso.                         |
| [04_epics.md](04_epics.md)                 | approved | Agrupa capacidades do produto.                            |
| [05_principles.md](05_principles.md)       | approved | Define princípios de implementação.                       |
| [06_versions.md](06_versions.md)           | approved | Define v0, v1 e sprints.                                  |
| [07_architecture.md](07_architecture.md)   |  pending | Definirá arquitetura do app.                              |
| [08_database.md](08_database.md)           |  pending | Fora do escopo inicial sem banco.                         |
| [09_api_contracts.md](09_api_contracts.md) |  pending | Fora do escopo inicial sem API.                           |
| [10_environments.md](10_environments.md)   | approved | Define comandos locais, Git hooks e arquivos protegidos.  |
| [11_decisions.md](11_decisions.md)         | approved | Log append-only de decisões.                              |

Versão atual planejada: `v0 — Foundation`.

Próximo milestone: app Vite local com tela de abertura/monitoramento de pasta Meridian, `board.json` canônico e base visual shadcn/ui.
