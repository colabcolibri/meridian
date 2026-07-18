# Phase doc template — `09_design_system.md` (optional)

**Agent:** `design-system-owner` via `/design-pass`  
**Create at init:** stub only if UI product; skip for CLI-only backends.

## Frontmatter

```yaml
---
title: Design System
status: draft
version: 1.0
updated: YYYY-MM-DD
depends_on: [04_principles.md, 05_architecture.md]
blocks: []
---
```

## Sections

| `##` heading | Prompt | Pass when |
| ------------ | ------ | --------- |
| **Objective** | UI scope (web, extension, mobile) | |
| **Tokens** | Colors, spacing, typography source | CSS vars / Tailwind theme path |
| **Components** | Base library (shadcn, MUI, custom) | Install/import rule |
| **Accessibility baseline** | Focus, contrast, keyboard | Or link WCAG target |
| **Responsive breakpoints** | Mobile / tablet / desktop | Numbers or “see Tailwind defaults” |

Read `design-system` skill checklist before `approved`.
