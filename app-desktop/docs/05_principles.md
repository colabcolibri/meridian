---
title: Princípios de Código
status: approved
version: 1.0
updated: 2026-06-02
depends_on: [01_tech_stack.md, 02_security.md, 03_user_types.md]
blocks: [07_architecture.md]
---

# 05 — Princípios de Código

## DRY — onde cada tipo de lógica vive

- Dados do fluxo Meridian: módulos em `src/domain/meridian`.
- Regras de validação: funções puras em `src/domain/meridian/validators`.
- Componentes de UI reutilizáveis: `src/components/ui`.
- Componentes de produto: `src/features`.
- Constantes de status, versões e documentos: fonte única em TypeScript.

## Single Responsibility

| Camada       | Responsabilidade única                                          |
| ------------ | --------------------------------------------------------------- |
| Domain       | Modelar documentos, dependências, status e validações Meridian. |
| Feature      | Compor UI e comportamento de uma área do produto.               |
| Component UI | Renderização genérica e acessível baseada em shadcn/ui.         |
| App          | Layout principal, navegação e composição das features.          |

## Convenções obrigatórias

- TypeScript para todos os módulos de aplicação.
- Componentes React em PascalCase.
- Funções utilitárias em camelCase.
- Dados mockados ou seedados com nomes explícitos.
- Nenhuma regra Meridian deve ficar escondida dentro de componente visual.
- Componentes shadcn/ui devem ser adicionados pelo instalador oficial do shadcn, de forma incremental, conforme necessidade real da interface.
- Código deve passar por ESLint e Prettier antes de commit.
- Commits devem passar pelo hook de pre-commit com lint-staged.
- O projeto usa `pnpm`; não versionar lockfiles de npm ou yarn.

## Tratamento de erros

Na primeira versão, erros serão representados como validações e alertas visuais. Como não há backend, não haverá envelope de API.

## Padrão visual

- Interface operacional, não página de marketing.
- Cards apenas para unidades repetidas ou painéis bem definidos.
- Badges para status.
- Tabs para alternar visões.
- Scroll area para listas longas.
- Ícones lucide para ações e sinais visuais.
