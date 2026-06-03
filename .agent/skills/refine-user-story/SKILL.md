---
name: refine-user-story
description: Refines a Meridian user story for implementation — deepens Approach, architecture refs and tests. Use between /create-us and coding, or /refine-us US-XXXX.
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

# Refine user story (Meridian)

## Selective reading

| File | When to read |
| ------- | ---------- |
| `.agent/references/templates/writing-guide.md` | Refine example — Approach depth, tests |
| `references/refine-checklist.md` | **Mandatory** — ready gate |
| `references/us-template.md` | Full structure |
| Target US + `depends_on` US | What already exists |
| `docs/05_architecture.md` | Sections cited in Architecture refs |

## When to trigger

- After `/create-us`, before implementation.
- Approach or Architecture refs still thin.
- Workflow `/refine-us US-XXXX`.

**Do not** mark `✅` — use `complete-user-story` after code.

## Procedure

1. Read `writing-guide.md`, checklist, target US, architecture sections.
2. **Deepen `### Why` / `### Where`** only if create left gaps — do not bloat; fix clarity.
3. **Optionally add or expand `### Approach`** — bullets explain what, where in codebase, constraint.
   - what changes,
   - where in codebase (paths ok **inside** explanatory bullet),
   - constraint or non-goal.
4. Set **Architecture refs** to exact `§ heading` from `05_architecture.md`.
5. Fill API/DB/Security/Decisions with short phrases when not `_n/a_`.
6. Replace generic **Tests / Planned** with numbered steps or exact commands.
7. Tighten **Acceptance** if vague (keep `[ ]`).
8. Set `ready: true` only when checklist passes.
9. `generate-board-json`; `update-decisions-log` if scope changed.

## Approach — refine quality bar

Minimum 2 bullets. Each bullet ≥ one full sentence. Example pattern:

`- [Action verb] [component/path] so that [reason linked to acceptance or Where it fits].`

## Output

```txt
US refined:
File:
Ready for implementation: yes | no
Approach explanatory: yes | no
Architecture § exact: yes | no
Tests concrete: yes | no
Board updated:
Blockers:
Next: implement US-XXXX | /refine-us again
```
