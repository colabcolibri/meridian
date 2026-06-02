---
name: create-user-story
description: Creates a valid Meridian user story after epics and versions are approved. Use when adding work to docs/us and keeping acceptance criteria concrete.
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

# Create user story (Meridian)

## Selective reading

| File | When to read |
| ------- | ---------- |
| `.agent/references/templates/INDEX.md` | Before any US create — confirm agent protocol |
| `references/us-template.md` | **Mandatory** before drafting `docs/us/US-XXXX.md` — read full template, then Write |

## Preconditions (hard gate)

| Doc | Required status |
| --- | -------------- |
| `05_architecture.md` | `approved` |
| epic/version in folders | exist |
| Referenced epic | file `docs/epics/EPIC-XX.md` exists |
| Referenced version | file `docs/versions/vX.md` exists |
| Profile in `03_user_types.md` | exists |

The US **references** the epic via `epic: EPIC-XX`. Do not copy description, `outcome` or epic scope into the US — canonical epic source is `docs/epics/`.

If epic does not exist → use skill `create-epic` before saving US.

If check fails → **do not** save valid US; report blocker and smallest doc needed.

## Phase 0 — clarification

Vague request → product questions:

1. Who uses it?
2. What action?
3. What benefit?
4. How to know it is done (`done_when`)?
5. Which architecture / API / DB sections apply?
6. What is explicitly out of scope for this slice?

## Procedure

1. Read `.agent/references/templates/INDEX.md` and **full** `references/us-template.md` (or mirrored `.agent/references/templates/us-template.md`).
2. List `docs/us/US-*.md` → next ID = highest number + 1, formatted as `US-XXXX` (4 digits, zero-padded).
3. Fill template — every section required; `## Context & constraints` must not be empty placeholders only.
4. Validate measurable `done_when`; `🔶` requires `Missing:` in acceptance; set `ready: false`.
5. Save `docs/us/US-XXXX.md`.
6. Invoke `generate-board-json` or regenerate `board.json`.
7. If relevant change → `update-decisions-log`.

**Closure:** after implementation, use skill `complete-user-story` (workflow `/complete-us`) — do not mark `✅` in this skill.

## Validations before saving

- New ID, format `US-XXXX` (4 digits); filename = `{id}.md`
- **Structure:** every `##` / `###` from `us-template.md` present (see `section-contracts.md`)
- `ready: false` on creation
- Dependencies exist and are `✅` before marking dependent as `✅`
- Out of scope filled if ambiguity risk exists

## Output

```txt
US created:
File:
Epic:
Version:
Depends on:
Board updated:
Open questions:
```
