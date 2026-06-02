---
title: Arquitetura
status: draft
version: 1.0
updated: 2026-06-02
depends_on:
  [
    00_scope.md,
    01_tech_stack.md,
    02_security.md,
    03_user_types.md,
    05_principles.md,
    06_versions.md,
  ]
blocks: [08_database.md, 09_api_contracts.md, 10_environments.md]
---

# 07 — Arquitetura

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
    docs/                    # fonte de verdade DESTE app
    src/
```

O app **não** é fonte de verdade do protocolo. Ele monitora uma pasta que segue a mesma estrutura (`meridian.md`, `docs/`, `.agent/` opcional).

## Camadas

| Camada               | Responsabilidade                                |
| -------------------- | ----------------------------------------------- |
| Protocolo            | `meridian.md` + `.agent/MERIDIAN.md`            |
| Governança always-on | `.agent/rules/MERIDIAN.md`                      |
| Projeto monitorado   | `docs/00–11`, `docs/us/`, `board.json` derivado |
| App desktop          | Leitura, validação visual, status, bloqueios    |
| Futuro VSCode        | Escrita real em disco perto do editor           |

## App desktop (v0)

- **Stack:** Vite, React, TypeScript, Tailwind, shadcn/ui.
- **Estado v0:** dados simulados em `src/domain/meridian/data.ts`.
- **Validação:** invocar `validate_meridian.py` na pasta alvo (hoje manual).

## Pendências (v1)

- Abertura de pasta via File System Access API ou bridge nativa.
- Parser de Markdown + frontmatter para `docs/` e `docs/us/`.
- Sincronizar UI com `board.json` gerado das US.
- Exibir bloqueios do protocolo (docs não approved, US sem `Falta:`).
- Detectar kit `.agent/` e resumir agents/workflows disponíveis.

## Limites

- Browser não escreve em disco no v0.
- App não substitui roteamento de agents (`meridian-routing` continua no IDE).
