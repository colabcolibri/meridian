---
title: Arquitetura
status: approved
version: 1.1
updated: 2026-06-02
depends_on:
  [00_scope.md, 01_tech_stack.md, 02_security.md, 03_user_types.md, 04_principles.md]
blocks: [06_database.md, 07_api_contracts.md, 08_environments.md]
---

# 05 — Arquitetura

## Objetivo

Documentar a arquitetura do Meridian Desktop e como ele se relaciona com o kit Meridian na raiz do repositório.

## Contexto do repositório

```txt
meridian/                    # repositório do kit + app
  README.md                  # onboarding Git
  meridian.md                # protocolo/produto
  .agent/                    # kit operacional para agentes
    rules/MERIDIAN.md        # P0 — always_on
    MERIDIAN.md              # protocolo master
    agents/                  # 7 personas
    skills/                  # progressive disclosure + references/
    workflows/               # slash commands
    scripts/validate_meridian.py
  app-desktop/               # este app (Vite)
    docs/                    # fonte de verdade DESTE app (pasta monitorada no dogfooding)
      00_scope.md … 11_decisions.md
      decisions/YYYY-MM-DD.json
      us/
      epics/
      versions/
      sprints/
      kanban/board.json      # derivado das US
    src/
```

O app **não** é fonte de verdade do protocolo. Ele monitora a pasta **`docs/`** do projeto Meridian (a mesma que agentes editam no Cursor).

## Camadas

| Camada               | Responsabilidade                                                                                               |
| -------------------- | -------------------------------------------------------------------------------------------------------------- |
| Protocolo            | `meridian.md` + `.agent/MERIDIAN.md`                                                                           |
| Governança always-on | `.agent/rules/MERIDIAN.md`                                                                                     |
| Projeto monitorado   | docs de fase 00–08 e 11, `docs/decisions/`, `docs/epics/`, `docs/versions/`, `docs/us/`, `board.json` derivado |
| App desktop          | Leitura, validação visual, status, bloqueios                                                                   |
| Futuro VSCode        | Escrita real em disco perto do editor                                                                          |

## App desktop (v1)

- **Stack:** Vite, React, TypeScript, Tailwind, shadcn/ui, `yaml` (frontmatter).
- **Pasta aberta:** File System Access API → usuário escolhe **`docs/`** (ex.: `app-desktop/docs/`). O handle é a raiz; docs de fase na raiz; subpastas `decisions/`, `us/`, `epics/`, `versions/`, `sprints/`, `kanban/`.
- **Carregamento:** `project-loader.ts` lê fases, `decisions/*.json`, `epics/`, `versions/`, `sprints/`, `us/` e `kanban/board.json`.
- **Validação TS:** `protocol-validators.ts` (regras P0 na UI).
- **Validação Python (dev):** `vite-meridian-validate.ts` → `POST /api/meridian/validate` executa `validate_meridian.py` com raiz **`app-desktop/`** (projeto completo com subpasta `docs/`). Build estático não executa Python.

## Visões do monitor (v1)

| Aba          | Fonte (relativa à pasta `docs/` aberta)      |
| ------------ | -------------------------------------------- |
| Configuração | docs 00–08 e 11 parseados + leitor inline    |
| Decisões     | `decisions/*.json` — log estruturado por dia |
| Entregas     | `versions/`, `sprints/`, `epics/`            |
| Quadro       | `us/*.md` + diff com `kanban/board.json`     |

## Pendências (v2)

- Escrita em disco / extensão VSCode.
- Validar pasta arbitrária via Python sem bridge do dev server (ex.: Tauri).

## Limites

- Browser não **escreve** em disco no v1 (somente leitura).
- App não substitui roteamento de agents (`meridian-routing` continua no IDE).
