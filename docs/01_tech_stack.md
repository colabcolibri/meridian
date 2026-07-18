---
title: Tech Stack
status: approved
version: 1.1
updated: 2026-06-04
depends_on: [00_scope.md]
blocks: [02_security.md, 04_principles.md, 08_environments.md]
---

# 01 — Tech Stack

## Frontend (extension webviews — `app-visual-studio/`)

- Framework: React
- Language: TypeScript
- Bundler: Vite (webview bundles only)
- Styling: Tailwind CSS
- Components: shadcn/ui
- Icons: lucide-react

**Rationale:** React + Vite inside the extension host for Board/Epics/Versions/Sprints webviews. Not a standalone browser app (monitor removed v10).

**Discarded alternatives:**

- Next.js: unnecessary for embedded webviews.
- Vue/Svelte: valid, but React pairs with shadcn/ui in the extension codebase.
- Plain CSS: less consistent for dense planning UI.

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

- Extension dev: `cd app-visual-studio && pnpm install && pnpm compile` (or `pnpm watch`)
- Extension package: `@vscode/vsce` when publishing
- Deploy: marketplace VSIX; harness kit via tarball / git clone

## DX

- Strict TypeScript in `app-visual-studio/`.
- ESLint per extension template.
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
