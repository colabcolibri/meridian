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
| UI in extension | Status bar + Output channel; **no** React kanban in v4   |

**Rationale:** Keep the extension thin: editor-native commands and file I/O only. Kanban, epic bars, and version progress stay in the Vite monitor where they already exist (v1–v3).

**Discarded for v4:**

- Embedded webview duplicating `app-desktop` Board — scope creep; use monitor side-by-side.
- Shared npm package with `app-desktop` — separate build graphs.

## Backend

There is no remote backend in the monitor or the extension.

The monitor uses local file access only. The extension writes under `docs/` and invokes kit Python scripts on disk.

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
