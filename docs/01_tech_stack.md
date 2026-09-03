---
title: Tech Stack
status: approved
version: 1.2
updated: 2026-09-03
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

**Rationale:** React + Vite inside the extension host for Board/Epics/Versions/Sprints webviews. The kit HTML monitor is a **separate** surface (no React, no Vite).

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

- Recreating `app-desktop/` (Vite/React/pnpm) as a second product — removed v10. v19 kit HTML is not that stack.
- Shared npm package with unrelated apps — separate build graphs.

## Kit HTML monitor (`.agent/board-ui/` — v19)

| Piece | Choice |
| ----- | ------ |
| Markup | Static HTML + CSS + JS modules in the kit (no bundler, no pnpm) |
| Serve | Python 3 **stdlib** `http.server` via `python3 .agent/board` (`meridian_board_serve.py`) |
| Bind | `127.0.0.1`, ephemeral port (`bind(..., 0)`), foreground; Ctrl+C stops the process |
| Data | Same `export_planning_json` / `export_decisions_json` as the extension; GET only |
| Markdown | Vendored parser + sanitizer in `board-ui/vendor/` (no CDN required) |

**Rationale:** Codex and git clones need a board without the VSIX. Python is already required for delivery.

## Backend

There is no remote backend.

The extension and the kit HTML monitor read local `docs/` and `.meridian/meridian.db` via kit Python scripts on disk. Only the CLI/workflows upsert delivery.

## Database

**Delivery:** SQLite at `.meridian/meridian.db` — see `06_database.md`. Phase docs (`00`–`11`) remain Markdown.

## Infrastructure

- Extension dev: `cd app-visual-studio && pnpm install && pnpm compile` (or `pnpm watch`)
- Extension package: `@vscode/vsce` when publishing
- Deploy: marketplace VSIX; harness kit via tarball / git clone

## DX

- Strict TypeScript in `app-visual-studio/` (`pnpm typecheck`).
- ESLint flat config in `app-visual-studio/` (`pnpm lint`).
- Prettier as the default formatter.
- Husky pre-commit: bootstrap SQLite + `validate_meridian.py --sqlite-only --strict-kit-md` (mirrors CI governance gate).
- lint-staged — planned follow-up (not wired in v15-S1); use `pnpm lint` before push when touching extension code.
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
