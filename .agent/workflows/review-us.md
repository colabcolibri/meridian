---
description: Audit a user story (report-only) or attest DoR (ready true). Story-checker only.
---

# /review-us — review user story

$ARGUMENTS

---

## Critical rules

1. Use `story-checker` + `@[skills/us-review]`
2. **Default report-only** — do not upsert unless DoR attest is requested or clearly implied (“ready for implement”, “pode implementar”)
3. **`ready: true` only here** — never `/refine-us`
4. Failing checklist → bounce `/refine-us` (`story-maker`); do not set ready
5. **NO product code**
6. **Mandatory read:** `review-checklist.md` + target US `show --full`

---

## Task

```txt
CONTEXT:
- User Request: $ARGUMENTS
- Mode: REVIEW US (story-checker)

RULES:
1. Resolve US id
2. Score review-checklist (and refine-checklist if attesting)
3. Report-only unless manager wants DoR attest
4. Attest → set-ready true iff pass
5. Do not cook Plan (delegate story-maker)
```

---

## vs `/refine-us`

| `/review-us` | `/refine-us` |
| --- | --- |
| Attest or report | Cook Plan / Approach |
| May set ready | Must not set ready |
| `story-checker` | `story-maker` |

Typical flow: `/create-us` → `/refine-us` → `/review-us` (ready) → `/implement-us`.
