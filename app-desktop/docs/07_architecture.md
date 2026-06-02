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

Documentar a arquitetura do Meridian Desktop.

## Contexto atual

O app está em `app-desktop/` e usa Vite, React, TypeScript, Tailwind CSS e shadcn/ui.

Ele é uma camada visual para monitorar uma pasta Meridian. A fonte de verdade continua
sendo a pasta do projeto monitorado, não o app.

## Pendências

- Definir estratégia de abertura de pasta.
- Definir parser de Markdown/frontmatter.
- Definir modelo de estado de projeto monitorado.
- Definir validações locais.
- Definir limites entre app desktop e futura extensão Visual Studio/VSCode.
