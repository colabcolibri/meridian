---
title: Design System
status: draft
version: 1.0
updated: YYYY-MM-DD
depends_on: [01_tech_stack.md, 04_principles.md, 05_architecture.md]
blocks: []
---

# 09 — Design system

## Overview

_UI product — fill via `/design-pass bootstrap` after `01_tech_stack.md` is drafted._

- **Surfaces:** _(web app | extension webviews | mobile — from scope)_
- **Primary UI stack:** _(id from `ui-stack-catalog.md`, e.g. `ts-shadcn`)_
- **Mood:** _(link `04_principles.md` — work tool vs marketing)_

## Colors

_Semantic tokens — document theme file path, not only hex._

| Token | Role | Theme key / CSS var |
| ----- | ---- | ------------------- |
| primary | Main actions | |
| background | Page canvas | |
| foreground | Body text | |
| muted | Secondary text | |
| destructive | Danger actions | |
| border | Dividers | |

## Typography

| Level | Use | Stack key |
| ----- | --- | --------- |
| display / h1 | Page titles | |
| body | Default copy | |
| label | Metadata, captions | |

## Layout

- **Spacing scale:** _(e.g. 4px base / Tailwind default)_
- **Container max-width:** _
- **Grid:** _

## Elevation and depth

_(shadows or tonal layers — stack-specific)_

## Shapes

- **Border radius:** _(sm / md / lg tokens)_

## Components

- **Primitives (read-only):** _(e.g. `components/ui/` — never edit for product)_
- **Composed templates:** _(e.g. `components/app/` — `AppDialog`, …)_
- **Composition:** config-driven props (`title`, `description`, `body`, `footer`, `variant`, `size`)

### Inventory (composed)

| Template | Purpose | Showcase route |
| -------- | ------- | -------------- |
| AppDialog | Modal flows | `/design/components#dialog` |
| _add rows via `/design-showcase`_ | | |

## Do's and don'ts

- Do use semantic tokens and composed `App*` templates.
- Do cite this doc in UI US Plan Architecture refs.
- Don't edit installed primitive files (shadcn `ui/*`, MUI package, etc.).
- Don't hardcode hex in feature code.

## Responsive behavior

| Breakpoint | Width | Notes |
| ---------- | ----- | ----- |
| mobile | | |
| tablet | | |
| desktop | | |

Content areas must not cause horizontal overflow (`overflow-x`).

## Accessibility baseline

- Focus visible on interactive elements
- Contrast: WCAG AA minimum for text
- Touch targets: 44×44px minimum on mobile
- Form fields: visible labels and error text

## Showcase catalog

| Route | Contents | Status |
| ----- | -------- | ------ |
| `/design` | Overview + nav | planned |
| `/design/tokens` | Colors, type, spacing | planned |
| `/design/components` | Composed templates + states | planned |

_Plan routes via `/design-showcase`; implement via gated `/implement-us`._

## Gate

Human sets `status: approved` before Must US with visual Acceptance ship.
