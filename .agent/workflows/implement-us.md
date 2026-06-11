---
description: Gate and implement a user story — only after ready true and Plan filled.
---

# /implement-us — implement user story

$ARGUMENTS

---

## Critical rules

1. Use `process-manager` + `@[skills/implement-user-story]`
2. **Mandatory read:** `implement-gate-checklist.md` + target US **before** product code
3. **Hard block:** `ready: true` required — if false → stop; recommend `/refine-us`
4. Read every **Architecture refs** section before Write on code
5. One US per session — cite `docs/us/US-XXXX.md` explicitly
6. Do **not** mark `✅` or run `/complete-us` in the same turn unless manager only asked to close
7. Partial delivery → `🔶` + `Missing:` in Acceptance; no forced close

---

## Task

```txt
CONTEXT:
- User Request: $ARGUMENTS
- Mode: IMPLEMENT US

RULES:
1. Resolve US id from $ARGUMENTS or ask
2. Run implement gate checklist (architecture, ready, Plan, depends_on, status)
3. If blocked → output blocker; NO product code
4. If passed → read Architecture refs → implement Acceptance + Planned
5. validate_meridian.py optional after US edits (not before gate)
6. Remind manager: review diff → /complete-us → /sync-board → commit (human)
```

---

## Output

```txt
Implement gate: passed | blocked
US:
Blockers:
Architecture refs read:
Files touched:
Tests run:
Next: /complete-us US-XXXX (after manager review)
```

---

## vs `/refine-us`

| `/refine-us` | `/implement-us` |
| --- | --- |
| Docs only; sets `ready: true` | Gate + product code |
| Deepens Plan | Requires Plan already concrete |
| Never writes app code | Writes code after gate passes |

Typical flow: `/create-us` → `/refine-us` → **`/implement-us`** → `/complete-us`.
