---
title: Tech Stack
status: approved
version: 1.0
updated: 2026-06-02
depends_on: [00_scope.md]
blocks: [02_security.md, 04_principles.md, 08_environments.md]
---

# 01 — Tech Stack

## Frontend

- Framework: React
- Linguagem: TypeScript
- Bundler: Vite
- Estilização: Tailwind CSS
- Componentes: shadcn/ui
- Ícones: lucide-react

**Justificativa:** React com Vite entrega uma base leve, rápida e simples de rodar localmente com `pnpm`. shadcn/ui oferece componentes profissionais, customizáveis e compatíveis com Tailwind, sem prender o projeto a uma biblioteca fechada.

**Alternativas descartadas:**

- Next.js: poderoso, mas desnecessário para a primeira versão local.
- Vue/Svelte: válidos, mas React combina melhor com shadcn/ui e com o ecossistema esperado para a futura extensão.
- CSS puro: menos consistente para uma interface operacional com muitos estados.

## Backend

Não haverá backend na primeira versão Vite.

A persistência inicial será local e voltada para prototipação da experiência. A escrita real em arquivos será tratada na etapa VSCode/desktop.

## Banco de dados

Não haverá banco de dados na primeira versão.

Dados iniciais ficarão em módulos TypeScript. Preferências e simulações poderão usar `localStorage`.

## Infra

- Execução local: `pnpm dev`
- Build local: `pnpm build`
- Preview local: `pnpm preview`
- Deploy: fora do escopo inicial

## DX

- TypeScript estrito quando viável.
- ESLint conforme template Vite.
- Prettier como formatador padrão.
- Husky para hooks locais de Git.
- lint-staged para formatar e aplicar lint apenas em arquivos staged.
- `.editorconfig` e `.vscode/settings.json` para format on save.
- `pnpm-lock.yaml` como único lockfile versionado.
- Componentização por domínio da interface.
- Dados do fluxo Meridian centralizados em módulos reutilizáveis.

## Decisão visual

A UI deve se comportar como ferramenta de trabalho, não como landing page. Prioridades:

- Navegação clara.
- Densidade moderada de informação.
- Estados visuais consistentes.
- Componentes shadcn/ui para cards, badges, tabs, scroll areas, inputs, sheets e separadores quando fizer sentido.
