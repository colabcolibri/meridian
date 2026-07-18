# Phase doc template — `09_design_system.md` (UI products)

**Agent:** `design-system-owner` via `/design-pass`, `/design-showcase`, `/design-review`  
**Create at init:** stub when `01_tech_stack.md` indicates UI surfaces; skip CLI-only backends.

## Frontmatter

```yaml
---
title: Design System
status: draft
version: 1.0
updated: YYYY-MM-DD
depends_on: [01_tech_stack.md, 04_principles.md, 05_architecture.md]
blocks: []
---
```

Optional YAML token block (DESIGN.md-compatible) may follow frontmatter in the same file:

```yaml
---
# design tokens (optional machine-readable block — second --- pair or appendix)
colors:
  primary: "#..."
typography:
  body-md:
    fontSize: 16px
---
```

## Sections (fixed order — align with DESIGN.md)

| `##` heading | Prompt | Pass when |
| ------------ | ------ | --------- |
| **Overview** | Mood, density, audience, primary UI stack id | Matches `00_scope` + `ui-stack-catalog.md` row |
| **Colors** | Semantic palette + roles | Theme file path documented |
| **Typography** | Families, scale, usage rules | Linked to stack theme |
| **Layout** | Spacing scale, containers, grid | Breakpoints referenced |
| **Elevation and depth** | Shadows or flat hierarchy rules | Or "tonal layers only" |
| **Shapes** | Radius, borders | Token names |
| **Components** | Stack id, primitive path (read-only), composed path, `App*` inventory | Composition pattern documented |
| **Do's and don'ts** | Guardrails incl. never edit installed primitives | Agent-readable |
| **Responsive behavior** | mobile / tablet / desktop | No horizontal overflow rule |
| **Accessibility baseline** | Focus, contrast, keyboard, touch targets | WCAG target level |
| **Showcase catalog** | Routes (`/design`, …) or "planned US" | Links to living reference |

Read `design-system` skill checklist before `approved`.
