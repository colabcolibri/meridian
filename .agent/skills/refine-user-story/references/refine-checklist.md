# Refine checklist — US ready for implementation

Use after `/create-us`, before any product code. Mark `ready: true` in frontmatter only when **every** required row passes.

---

## Required sections

| # | Check | Pass when |
| - | ----- | --------- |
| 1 | `## Context & constraints` exists | Section present in US body |
| 2 | Architecture refs | At least one real path + § heading from `docs/05_architecture.md` (not `§ [section name]` placeholder) |
| 3 | API / DB impact | Explicit `_n/a_` **or** named endpoint/table/migration |
| 4 | Implementation hints | At least one likely file path + 2+ bullets describing approach |
| 5 | Acceptance | Each item is verifiable (observable outcome, not intent) |
| 6 | Tests / Planned | No "add when implementation scope is known"; each item has command or numbered steps |
| 7 | `done_when` | Single measurable sentence in frontmatter |
| 8 | Epic link | `epic: EPIC-XX` exists; epic file read for boundaries — no duplicated epic text |

---

## Placeholder patterns (fail until replaced)

Treat as **not ready** if Context or Tests contain only:

- `_(fill in`
- `_(pending)_`
- `§ [section name`
- `add when implementation scope is known`
- `verify acceptance criteria end-to-end` without numbered steps
- `Likely files: path/to/…` without real paths under the project

---

## Frontmatter

```yaml
ready: false   # default on /create-us
ready: true    # set by /refine-us when checklist passes
```

| Field | Rule |
| ----- | ---- |
| `ready: true` | Implementation allowed (`process-manager` gate) |
| `ready: false` or absent | Block implement; run `/refine-us` |
| `status: ✅` | Ignore `ready` — story closed |

Legacy US without `ready` field: validator warns; agent blocks implement until `/refine-us`.

---

## What refine does **not** do

- Does not fill `## Technical implementation` with delivery record (that's `/complete-us`)
- Does not mark acceptance `[x]` or `status: ✅`
- Does not write product code
