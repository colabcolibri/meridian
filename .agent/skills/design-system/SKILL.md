---
name: design-system
description: Reviews and maintains Meridian design system doc 09_design_system.md — tokens, components, responsive breakpoints, a11y. Use with /design-pass.
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

# Design system (Meridian)

## Selective reading

| File | When to read |
| ---- | ------------ |
| `references/design-system-checklist.md` | Full pass on `09_design_system.md` |
| Target US (`show --full`) | When `/design-pass` cites a US |

## When to trigger

- Create or deepen `docs/09_design_system.md`
- `/design-pass` on a US with UI Acceptance
- Before refining Must US with visual criteria (after `09` at least `draft`)

## Procedure

1. Read `00_scope`, `03_user_types`, `04_principles`, `05_architecture` (frontend sections).
2. Walk `references/design-system-checklist.md`.
3. Update `09_design_system.md` with tokens, components, breakpoints, a11y baseline.
4. For US review: list which sections the Plan should cite in Architecture refs.
5. Log material changes via `update-decisions-log`.

## Output

```txt
09_design_system status:
Checklist gaps:
US Plan refs suggested:
Ready for review: yes | no
```
