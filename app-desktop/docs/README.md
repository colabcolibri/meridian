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

## Documentos de fase (eixo sistema)

| Documento                                  | Status   | Propósito                                       |
| ------------------------------------------ | -------- | ----------------------------------------------- |
| [00_scope.md](00_scope.md)                 | approved | Escopo do app desktop e limites                 |
| [01_tech_stack.md](01_tech_stack.md)       | approved | React, TypeScript, Vite, Tailwind, shadcn/ui    |
| [02_security.md](02_security.md)           | approved | Segurança da versão local                       |
| [03_user_types.md](03_user_types.md)       | approved | Perfis de uso                                   |
| [04_principles.md](04_principles.md)       | approved | Princípios de implementação                     |
| [05_architecture.md](05_architecture.md)   | approved | Arquitetura do app (parser, pasta docs)         |
| [06_database.md](06_database.md)           | draft    | Fora do escopo inicial                          |
| [07_api_contracts.md](07_api_contracts.md) | draft    | Fora do escopo inicial                          |
| [08_environments.md](08_environments.md)   | approved | Comandos locais e Git hooks                     |
| [11_decisions.md](11_decisions.md)         | approved | Stub — regras do log (entradas em `decisions/`) |

## Artefatos de entrega (pastas — fonte de verdade)

| Artefato        | Caminho                                  | Papel                                          |
| --------------- | ---------------------------------------- | ---------------------------------------------- |
| Épicos          | [`epics/`](epics/)                       | Um arquivo por EPIC-XX (capacidade de produto) |
| Releases        | [`versions/`](versions/)                 | Um arquivo por vX (go-live)                    |
| Sprints         | [`sprints/`](sprints/)                   | Fatias vX-SY dentro de cada release            |
| User stories    | [`us/`](us/)                             | Backlog (uma US = um arquivo)                  |
| Log de decisões | [`decisions/`](decisions/)               | Um JSON por dia (`YYYY-MM-DD.json`)            |
| Board derivado  | [`kanban/board.json`](kanban/board.json) | Kanban gerado das US — não editar à mão        |

Épicos, versões e sprints vivem **somente** nas pastas acima — sem índice markdown paralelo.

## Versão e sprint atuais

| Sprint              | Status    | US                                  |
| ------------------- | --------- | ----------------------------------- |
| v0-S1 Fundação      | ✅        | US-0001–007                         |
| v0-S2 Monitor shell | ✅        | US-0008                             |
| v1-S1 Leitura real  | ✅        | US-0009 → US-0017, US-0016          |
| v1-S2 UX do monitor | ✅        | US-0018 → US-0022 (EPIC-06)         |
| v1-S6 Decisões JSON | ✅        | US-0039, US-0040                    |
| **v2**              | planejado | VSCode / escrita em disco (EPIC-05) |

## Ordem de trabalho

| Fase                | Onde                              | Eixo    |
| ------------------- | --------------------------------- | ------- |
| 0 — Fundação        | 11, 00–03                         | Sistema |
| 1 — Princípios      | 04                                | Sistema |
| 2 — Arquitetura     | 05                                | Sistema |
| 3 — Detalhe técnico | 06–08                             | Sistema |
| Backlog             | `epics/`, `versions/`, `sprints/` | Entrega |
| Execução            | `us/`, `board.json`               | Entrega |

Gate de US: `05_architecture` approved + epic/version referenciados existem em `docs/epics/` e `docs/versions/`.

## Como agents devem trabalhar

Ver também: [fluxo diário com IA](../../.agent/references/daily-ai-workflow.md) e `/daily-with-ai` no Cursor.

### Loop diário (manager + IA)

1. **Orientar** — `/status`; app (Configuração + Quadro); escolher US Must desbloqueada.
2. **Contextualizar** — cite a US no chat (`US-XXXX` ou `docs/us/US-XXXX.md`).
3. **Implementar** — agente executa; revisar diff; parcial → `🔶` + `Falta:` no aceite.
4. **Fechar** — `/complete-us US-XXXX` (implementação técnica + aceite + `✅`); `/sync-board`.
5. **Revisar** — conferir aba Quadro no app.

### Detalhe por artefato

1. Escolher US em `docs/sprints/` ou `docs/versions/` (próximo marco: v2 em `versions/v2.md`).
2. Implementar citando `US-XXXX` no contexto.
3. Preencher `## Implementação técnica` ao concluir (skill `complete-user-story`).
4. Atualizar frontmatter da US (`🔶` + `Falta:` ou `✅` com evidência).
5. Regenerar `board.json` (skill `generate-board-json` ou `/sync-board`).
6. Decisões relevantes → prepend em `docs/decisions/YYYY-MM-DD.json` (skill `update-decisions-log`).

## Dogfooding no app

```bash
cd app-desktop && pnpm dev
```

No monitor: **Abrir pasta docs** → selecionar `app-desktop/docs/`.
