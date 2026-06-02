# Section contracts — delivery artifacts

> **Source of truth for structure.** Validators mirror this file. **Writing quality** is in `writing-guide.md`.

---

## User story (`us-template.md`)

### Frontmatter

| Field | Create (`/create-us`) | Strict (has `ready`) |
| ----- | -------------------- | -------------------- |
| `id`, `title`, `epic`, `version`, `status`, `moscow`, `depends_on` | required | required |
| `ready` | `false` | required |
| `done_when`, `tests`, `tests_status` | required | required |

### `##` sections (fixed order)

| # | Section | Create | Refine | Close |
| - | ------- | ------ | ------ | ----- |
| 1 | Acceptance | required | tighten | mark `[x]` |
| 2 | Context & constraints | Why/Where/Approach prose | deepen + real § refs | unchanged |
| 3 | Technical implementation | placeholders | unchanged | real record |
| 4 | Tests | Planned draft | concrete steps | `[x]` + Executed |
| 5 | Out of scope for this story | required | optional | optional |
| 6 | Notes | optional | optional | optional |

### `###` under Context & constraints (canonical)

1. Why this story  
2. Where it fits  
3. Approach  
4. Architecture refs  
5. API / DB impact  
6. Security notes  
7. Related decisions  

**Legacy (warn, migrate on refine):** `Implementation hints (preliminary)` → rename to `Approach`.

### `###` under Technical implementation

Files · Backend · Frontend · Scripts / Docs

### `###` under Tests

Planned · Executed

---

## Epic (`epic-template.md`)

| `##` section | Required |
| ------------ | -------- |
| Capability | yes — prose (see writing-guide) |
| Expected outcome | yes — prose |
| Out of scope for this epic | yes |
| Notes | recommended |

---

## Version (`version-template.md`)

| `##` section | Required |
| ------------ | -------- |
| Objective | yes (alias: `Goal`) — prose |
| Done criteria | yes — prose |
| Included in this version | yes |
| Explicitly out | yes |
| Go-live checklist | yes |

---

## Validation

```bash
python3 .agent/scripts/validate_meridian.py <project-folder>
```

Monitor uses the same structural rules in TypeScript.
