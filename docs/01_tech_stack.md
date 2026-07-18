---
title: Tech Stack
status: approved
version: 1.1
updated: 2026-06-04
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

## VS Code extension (`app-visual-studio/` — v4)

| Piece           | Choice                                                   |
| --------------- | -------------------------------------------------------- |
| Runtime         | VS Code / Cursor Extension Host                          |
| Language        | TypeScript (strict)                                      |
| Bundle          | esbuild → `dist/extension.js` (CJS, `vscode` external)   |
| Packaging       | `@vscode/vsce` when publishing (out of v4-S1)            |
| Backend         | **None** — commands spawn `python3` on `.agent/scripts/` |
| UI in extension | Webviews (Board, Epics, Versions, Sprints) + status bar + Output |

**Rationale:** Editor-native commands plus in-IDE planning views; kit Python scripts on `.agent/scripts/` for validation and SQLite delivery.

**Discarded for v4+:**

- Separate browser monitor duplicating the extension board — removed (v10); use **Meridian Harness** only.
- Shared npm package with unrelated apps — separate build graphs.

## Backend

There is no remote backend.

The extension reads/writes local `docs/` and `.meridian/meridian.db` via kit Python scripts on disk.

## Database

**Delivery:** SQLite at `.meridian/meridian.db` — see `06_database.md`. Phase docs (`00`–`11`) remain Markdown.

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
