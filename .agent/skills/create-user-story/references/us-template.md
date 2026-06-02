# Full user story template

```md
---
id: US-XXXX
title: Short title
epic: EPIC-XX
version: vX
status: ❌
moscow: Must
depends_on: []
done_when: "Objective and measurable condition."
tests: required
tests_status: pending
---

# US-XXXX — Short title

**As** [user type documented in 03_user_types.md],
**I want** [action],
**so that** [benefit].

## Acceptance

- [ ] Verifiable criterion 1
- [ ] Verifiable criterion 2
- [ ] 🔶 Partial — Missing: description of what is missing

## Technical implementation

> On **creation**: placeholder below. On **completion** (`✅`): skill `complete-user-story` — replace with real record (files + layers).

### Files

_(fill in when implementation is complete)_

### Backend

_(fill in when applicable)_

### Frontend

_(fill in when applicable)_

### Scripts / Docs

_(fill in when applicable)_

## Tests

> On **creation**: fill **Planned**. On **close** (`complete-user-story`): mark `[x]` and record in **Executed**; update `tests_status: done`.

### Planned

- [ ] **automated** — `pnpm test` — describe scope
- [ ] **manual** — steps and expected result

### Executed

_(pending)_

## Out of scope for this story

- What this US explicitly does NOT cover
- **Do not** repeat description, `outcome` or epic scope — use only `epic: EPIC-XX` in frontmatter

## Notes

- Links, decisions, external dependencies
```

## Allowed statuses (frontmatter)

| Symbol | Meaning |
| ------- | ----------- |
| ❌ | Not started |
| 🔶 | Partial (requires `Missing:` in acceptance) |
| ✅ | Complete (acceptance + implementation + tests when `tests: required`) |

## Test fields

| Field | Values | Rule |
| ----- | ------- | ----- |
| `tests` | `required` / `none` | Default `required` |
| `tests_status` | `pending` / `done` / `n/a` | `n/a` only with `tests: none`; `done` before `status: ✅` |

On the **monitor board**, column `🧪` = `tests_status: pending` — do not write emoji in YAML.

## MoSCoW

`Must` | `Should` | `Could` | `Won't`

## Closure

After implementation → skill `complete-user-story` or workflow `/complete-us` (do not mark `✅` on creation).
