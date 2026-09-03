---
name: design-theme
description: Defines and audits coherent application themes (modes, semantic color) and typography hierarchy. Use with /design-theme, light/dark drift, random hex, mixed type sizes, font pairing, or token integrity.
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

# Design theme (Meridian)

> Cook **theme modes** and **type ramp** in `docs/09_design_system.md`. Screen journeys are `design-flow`. Stack bootstrap is `design-system`.

## Operator workflow

| Workflow | Purpose |
| -------- | ------- |
| `/design-theme` | Semantic tokens, light/dark/system, type hierarchy |

## Selective reading

| File | When to read |
| ---- | ------------ |
| `references/theme-checklist.md` | **Mandatory** — color/modes |
| `references/type-hierarchy-checklist.md` | **Mandatory** — type ramp |
| `docs/04_principles.md` | Mood (work tool vs marketing) |
| `docs/01_tech_stack.md` | Token file / CSS-in-JS / native theme |
| `docs/09_design_system.md` | Current Colors / Typography |
| Stack file `design-system/references/stacks/{id}.md` | Where tokens live in that stack |

## When to trigger

- `/design-theme`
- Feature CSS with hex / `rgb` that is not a documented exception
- Headings skip levels or body text uses four unrelated sizes
- Adding dark mode, high contrast, or a second brand theme
- `/design-pass bootstrap` left Colors/Typography as placeholders

## Procedure

1. Read `01`, `04`, `09`, stack file for token paths.
2. Walk `theme-checklist.md` then `type-hierarchy-checklist.md`.
3. Fill `09` § Colors, § Theme modes, § Typography / Type hierarchy. Semantic names, not a dump of hex.
4. Recommend `/design-review` after code exists. Do not edit primitives.
5. `prepend-decision` on mode model (host-inherited vs product theme) or family change.

## Forbidden

| Forbidden | Why |
| --------- | --- |
| Product theme files as this skill’s output | Doc first; code via gated US |
| Third palette inside one feature | One token set; variants are modes |
| Approving `09` | Human only |
| Inventing brand | `00_scope` |

## Output

```txt
Workflow: design-theme
Token source:
Modes:
Type ramp roles:
Integrity gaps:
09 status:
Next: /design-flow | /design-pass | /design-review | human review 09
```
