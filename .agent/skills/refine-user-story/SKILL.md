---
name: refine-user-story
description: Refines a Meridian user story for implementation — fills Context & constraints, concrete tests and hints. Use between /create-us and coding, or /refine-us US-XXXX.
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

# Refine user story (Meridian)

## Selective reading

| File | When to read |
| ------- | ---------- |
| `.agent/references/templates/INDEX.md` | Before refine — confirm protocol |
| `.agent/references/templates/us-template.md` | Full US structure |
| `.agent/references/templates/section-contracts.md` | Fixed `##` / `###` — do not rename or omit |
| `references/refine-checklist.md` | **Mandatory** — readiness criteria before implement |
| Target epic `docs/epics/EPIC-XX.md` | Scope boundaries (read, do not copy) |
| Paths in `05_architecture.md` cited by US | Before filling Architecture refs |

## When to trigger

- After `/create-us`, before implementation.
- US exists but Context or Tests/Planned are placeholders.
- Workflow `/refine-us US-XXXX`.
- `process-manager` blocked implement → delegate refine here.

**Do not** mark `✅` — use `complete-user-story` after code.

## Preconditions

| Check | Requirement |
| ----- | ----------- |
| US exists | `docs/us/US-XXXX.md` |
| Gate | `05_architecture.md` = `approved` |
| Epic | `epic:` matches file in `docs/epics/` |
| Status | Not `✅` (closed US → no refine) |

## Procedure

1. Read INDEX + **full** `us-template.md` + `refine-checklist.md`.
2. Read target US, linked epic, and architecture sections needed for Context.
3. Fill or expand **`## Context & constraints`**:
   - real Architecture refs (doc path + § heading);
   - API/DB impact (`_n/a_` only when truly none);
   - security notes when relevant;
   - related decisions if any;
   - **Implementation hints** — likely file paths + 2–3 bullet approach.
4. Replace generic **Tests / Planned** with concrete commands and steps (no "add when known").
5. Tighten **Acceptance** if criteria are vague (still `[ ]` — not done until `/complete-us`).
6. Set frontmatter `ready: true` only when **all** items in `refine-checklist.md` pass.
7. Keep `status: ❌` (or `🔶` if partial doc work with `Missing:`).
8. Invoke `generate-board-json` if frontmatter changed.
9. `update-decisions-log` only if acceptance model or scope changed.

## Validations before `ready: true`

See `references/refine-checklist.md` — all required items must pass.

Structural contract: every `##` and `###` from `us-template.md` / `section-contracts.md` must be present (validator: `validate_meridian.py` + monitor).

## Output

```txt
US refined:
File:
Ready for implementation: yes | no
Context filled: yes | partial
Tests concrete: yes | no
Board updated: yes | no
Blockers for implement:
Next: implement US-XXXX | /refine-us again after manager input
```
