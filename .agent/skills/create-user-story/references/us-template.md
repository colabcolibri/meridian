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
ready: false
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

## Context & constraints

> **Required on creation.** Anchors implementation to documented system — does not duplicate epic text. Read these refs before coding.

### Architecture refs

- `docs/05_architecture.md` — § [section name or heading]

### API / DB impact

- _n/a_ | endpoint or contract from `07_api_contracts.md` | migration/table from `06_database.md`

### Security notes

- _n/a_ | rule from `02_security.md` § …

### Related decisions

- _n/a_ | `docs/decisions/YYYY-MM-DD.json` — entry title

### Implementation hints (preliminary)

- Likely files: `path/to/…`
- Approach in 2–3 bullets (plan, not final record — replaced on `/complete-us`)

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

- [ ] **automated** — command + scope (no "add when known")
- [ ] **manual** — numbered steps and expected result

### Executed

_(pending)_

## Out of scope for this story

- What this US explicitly does NOT cover
- **Do not** repeat description, `outcome` or epic scope — use only `epic: EPIC-XX` in frontmatter

## Notes

- Links, decisions, external dependencies
```

## Section contract

Full rules: `.agent/references/templates/section-contracts.md`. Validator: `validate_meridian.py` + monitor `section-contracts.ts`.

| Phase | Required structure |
| ----- | ------------------ |
| `/create-us` | All `##` from template; `ready: false`; Context may start minimal |
| `/refine-us` | All `###` under Context + concrete Tests/Planned; `ready: true` |
| `/complete-us` | All `###` under Technical implementation filled with real paths |

Do not rename, omit, or reorder template sections.

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

## Ready (frontmatter)

| Value | Meaning |
| ----- | ------- |
| `false` | Default on `/create-us` — do not implement yet |
| `true` | Set by `/refine-us` when refine-checklist passes — implement allowed |

## Closure

After implementation → skill `complete-user-story` or workflow `/complete-us` (do not mark `✅` on creation).
