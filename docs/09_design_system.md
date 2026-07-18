---
title: Design System
status: review
version: 1.0
updated: 2026-07-18
depends_on: [01_tech_stack.md, 04_principles.md, 05_architecture.md]
blocks: []
---

# 09 — Design system (Meridian Harness)

## Overview

- **Surfaces:** VS Code / Cursor extension webviews — Board, Epics, Versions, Sprints, Deliverables, kit help panels.
- **Primary UI stack:** `ts-shadcn` per `01_tech_stack.md` for new React UI; **runtime theme** inherits VS Code semantic colors in existing webviews.
- **Mood:** Work tool — moderate density, clear hierarchy, no marketing chrome (aligned with `04_principles.md` § Visual decision).

## Colors

Extension webviews map to VS Code theme tokens (do not hardcode hex in webview CSS).

| Token (semantic) | Role | VS Code variable |
| ---------------- | ---- | ---------------- |
| background | Page / editor canvas | `--vscode-editor-background` |
| foreground | Primary text | `--vscode-foreground` |
| surface | Sidebars, blocks | `--vscode-sideBar-background` |
| border | Dividers, cards | `--vscode-panel-border` |
| primary action | Buttons, active chips | `--vscode-button-background` / `--vscode-button-foreground` |
| link | IDs, navigation | `--vscode-textLink-foreground` |
| muted | Meta, descriptions | `--vscode-descriptionForeground` |
| focus | Focus ring | `--vscode-focusBorder` |
| success | Done progress | `--vscode-testing-iconPassed` |

**Theme files:** `app-visual-studio/src/webview-common.ts`, `markdown-content-styles.ts`, per-panel `*-webview-html.ts`.

## Typography

| Level | Use | Implementation |
| ----- | --- | -------------- |
| body | Default UI | `var(--vscode-font-family)`, `var(--vscode-font-size)` |
| h1 / h2 | Section titles in markdown viewers | `.content h1`, `.content h2` in `markdown-content-styles.ts` |
| meta | IDs, counts, chips | 10–11px, `descriptionForeground` |
| code | Inline / blocks | `var(--vscode-editor-font-family)`, `textCodeBlock-background` |

## Layout

- **Spacing:** 4px rhythm (8, 12, 16, 20, 24px margins in webview-common).
- **Container:** Full webview width; `overflow-x: auto` on tables (`.table-wrap`).
- **Toolbar:** Project context strip + filters — single row, wrap on narrow widths.

## Elevation and depth

Flat — hierarchy via background contrast (`sideBar-background` vs `editor-background`) and 1px borders, not drop shadows.

## Shapes

- **Border radius:** 4px chips/inputs; 8px cards, tables, code blocks.

## Components

- **Primitives (read-only):** VS Code webview API + shared classes in `webview-common.ts` — extend via new classes, do not fork VS Code.
- **Future shadcn primitives:** `app-visual-studio/src/components/ui/` when added via CLI — **read-only** after install.
- **Composed templates (target):** `app-visual-studio/src/components/app/` — `AppDialog`, `AppPageHeader`, `AppKanbanCard`, etc.
- **Composition:** config-driven props (`title`, `description`, `body`, `footer`, `variant`).

### Inventory (current → target)

| Surface | Location | Showcase |
| ------- | -------- | -------- |
| Kanban card | `board-webview-html.ts` | planned |
| Planning toolbar | `webview-project-context.ts` + common CSS | planned |
| Markdown viewer | `delivery-viewer-html.ts` + `markdown-content-styles.ts` | planned |
| Accordion block | `webview-common.ts` `.block` | planned |

## Do's and don'ts

- Do use `--vscode-*` variables for colors in webviews.
- Do extract repeated webview markup into composed templates when touching UI US.
- Do run `/design-review` before closing Must UI US.
- Don't hardcode light/dark colors — respect editor theme.
- Don't edit shadcn `ui/*` primitives for product copy or layout.
- Don't increase horizontal overflow on mobile-width webviews.

## Responsive behavior

| Context | Rule |
| ------- | ---- |
| Narrow webview | Toolbar chips wrap; tables scroll inside `.table-wrap` |
| Touch | Chip/button hit area ≥ 28px height (prefer 32px for new controls) |

## Accessibility baseline

- Focus visible via `--vscode-focusBorder` on interactive elements.
- Contrast: inherit VS Code theme (AA assumed for built-in themes).
- Keyboard: webview buttons and links reachable; no keyboard traps in accordions.
- Status badges: not color-only — include text/symbol (❌/🔶/✅).

## Showcase catalog

| Route / artifact | Contents | Status |
| ---------------- | -------- | ------ |
| `media/design-catalog.html` (planned) | Token swatches + component states | planned — US via `/design-showcase` |
| Kit `09` (this file) | Contract for agents | active |

## Gate

Manager sets `status: approved` after reviewing this doc and first `/design-review` pass on Board webview.
