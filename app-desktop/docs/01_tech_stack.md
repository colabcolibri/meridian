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
- Language: TypeScript
- Bundler: Vite
- Styling: Tailwind CSS
- Components: shadcn/ui
- Icons: lucide-react

**Rationale:** React with Vite delivers a lightweight, fast base that is simple to run locally with `pnpm`. shadcn/ui offers professional, customizable components compatible with Tailwind, without locking the project into a closed library.

**Discarded alternatives:**

- Next.js: powerful, but unnecessary for the first local version.
- Vue/Svelte: valid, but React pairs better with shadcn/ui and the ecosystem expected for the future extension.
- Plain CSS: less consistent for an operational interface with many states.

## Backend

There will be no backend in the first Vite version.

Initial persistence will be local and aimed at experience prototyping. Real file writes will be handled in the VSCode/desktop stage.

## Database

There will be no database in the first version.

Initial data will live in TypeScript modules. Preferences and simulations may use `localStorage`.

## Infrastructure

- Local run: `pnpm dev`
- Local build: `pnpm build`
- Local preview: `pnpm preview`
- Deploy: out of initial scope

## DX

- Strict TypeScript when feasible.
- ESLint per Vite template.
- Prettier as the default formatter.
- Husky for local Git hooks.
- lint-staged to format and lint only staged files.
- `.editorconfig` and `.vscode/settings.json` for format on save.
- `pnpm-lock.yaml` as the only versioned lockfile.
- Componentization by interface domain.
- Meridian flow data centralized in reusable modules.

## Visual decision

The UI should behave as a work tool, not a landing page. Priorities:

- Clear navigation.
- Moderate information density.
- Consistent visual states.
- shadcn/ui components for cards, badges, tabs, scroll areas, inputs, sheets, and separators when it makes sense.
