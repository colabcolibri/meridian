---
name: design-system
description: Maintains and audits Meridian docs/09_design_system.md — design tokens, shared components, responsive breakpoints, and accessibility baseline. Use when creating or reviewing 09_design_system, running /design-pass, or when Acceptance criteria mention UI, layout, tokens, or visual design.
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

# Design system (Meridian)

> **Escopo:** phase doc `docs/09_design_system.md`. US com UI: carregar corpo via `meridian_db_cli.py show US-XXXX --full` — não `docs/us/`.

> Authoring pattern: `.agent/skills/doc.md` (selective reading + `references/`). Discovery via `description` triggers above.

## Selective reading

| File | When to read |
| ---- | ------------ |
| `references/design-system-checklist.md` | **Mandatory** — full pass on `09_design_system.md` |
| Target US (`meridian_db_cli.py show US-XXXX --full`) | `/design-pass` with US id or UI Must stories |

## When to trigger

- Create or deepen `docs/09_design_system.md`
- Workflow `/design-pass` (optional US id in `$ARGUMENTS`)
- Before `/refine-us` on Must US with visual Acceptance (after `09` at least `draft`)

## Procedure

```txt
Task progress:
- [ ] Read 00_scope, 03_user_types, 04_principles, 05_architecture (frontend)
- [ ] Walk design-system-checklist.md
- [ ] Update 09_design_system.md (tokens, components, breakpoints, a11y)
- [ ] If US cited: list Plan Architecture refs to cite
- [ ] Log material changes via update-decisions-log
```

1. **Context** — read phase docs listed above; block if `05_architecture` not at least `review` (report to `scrum-master`).
2. **Checklist** — fill gaps in `09_design_system.md`; human sets `status: approved`.
3. **US alignment** — for UI stories, output which `09` sections belong in Plan Architecture refs; recommend `/refine-us` if missing on Must US.
4. **Decisions** — prepend `docs/decisions/` when tokens or a11y rules change materially.

## Output

```txt
09_design_system status: draft | review | ready for approved
Sections updated:
Checklist gaps:
US Plan refs suggested:
Ready for review: yes | no
Next: human approved | /refine-us US-XXXX | /design-pass
```

## Anti-patterns

- Product code in this skill (use `developer` + `/implement-us`)
- Approving `09_design_system` without human
- Inventing brand outside `00_scope`
