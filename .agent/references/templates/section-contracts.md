# Section contracts — delivery artifacts

> **Source of truth for structure.** Validators in Python (`meridian_section_contracts.py`) and TypeScript (`section-contracts.ts`) mirror this file. Agents must not add, rename, or reorder `##` / `###` outside these contracts.

---

## User story (`us-template.md`)

### Frontmatter

| Field | Create (`/create-us`) | Strict (has `ready`) |
| ----- | -------------------- | -------------------- |
| `id`, `title`, `epic`, `version`, `status`, `moscow`, `depends_on` | required | required |
| `ready` | `false` | required |
| `done_when`, `tests`, `tests_status` | required | required |

Legacy US without `ready` in frontmatter: structural warnings only for Context; core sections still enforced.

### `##` sections (fixed order)

| # | Section | Create | Refine | Close |
| - | ------- | ------ | ------ | ----- |
| 1 | Acceptance | required | tighten criteria | mark `[x]` |
| 2 | Context & constraints | required (minimal OK) | fill all `###` | unchanged |
| 3 | Technical implementation | placeholders | hints only | real record |
| 4 | Tests | Planned required | concrete steps | Planned `[x]` + Executed |
| 5 | Out of scope for this story | required | optional edit | optional |
| 6 | Notes | required | optional | optional |

### `###` under Context & constraints (strict US)

- Architecture refs  
- API / DB impact  
- Security notes  
- Related decisions  
- Implementation hints (preliminary)

### `###` under Technical implementation

- Files  
- Backend  
- Frontend  
- Scripts / Docs  

### `###` under Tests

- Planned  
- Executed  

---

## Epic (`epic-template.md`)

| `##` section | Required |
| ------------ | -------- |
| Capability | yes |
| Expected outcome | yes |
| Out of scope for this epic | yes (alias: `Out of this epic`) |
| Notes | recommended |

---

## Version (`version-template.md`)

| `##` section | Required |
| ------------ | -------- |
| Objective | yes (alias: `Goal`) |
| Done criteria | yes |
| Included in this version | yes |
| Explicitly out | yes |
| Go-live checklist | yes |

---

## Sprint (`sprint-template.md`)

Frontmatter is canonical (`id`, `version`, `title`, `status`, `done_when`, `stories`). Body table is optional; no fixed `##` sections required.

---

## Validation

```bash
python3 .agent/scripts/validate_meridian.py <project-folder>
```

- **ERROR** — breaks contract; fix before merge or `/complete-us`  
- **WARN** — legacy or recommended; fix with `/refine-us` before implement  

Monitor (Setup banner) uses the same rules in TypeScript when loading `docs/`.
