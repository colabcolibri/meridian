---
description: Gate and implement a user story — only after ready true and Plan filled.
---

# /implement-us — implement user story

$ARGUMENTS

---

## Critical rules

1. Use `developer` + `@[skills/implement-user-story]`
2. **Mandatory read:** `implement-gate-checklist.md` + `code-quality-at-us-time.md` + target US **before** product code
3. **Run gate CLI first:** `python3 .agent/scripts/meridian_db_cli.py implement-gate US-XXXX` (exit 0 = pass)
4. **Mandatory read:** `docs/04_principles.md` (DRY, SRP) before Write on code
5. **Hard block:** `ready: true` required — if false → stop; recommend `/refine-us`
6. Load US from SQLite: `meridian_db_cli.py show US-XXXX --full` (not `docs/us/`)
7. Read every **Architecture refs** section before Write on code
8. One US per session — cite `US-XXXX` explicitly
9. Do **not** mark `✅` or run `/complete-us` in the same turn unless manager only asked to close
10. Partial delivery → `🔶` + `Missing:` in Acceptance; no forced close

---

## Task

```txt
CONTEXT:
- User Request: $ARGUMENTS
- Mode: IMPLEMENT US

RULES:
1. Resolve US id from $ARGUMENTS or ask
2. Run: python3 .agent/scripts/meridian_db_cli.py implement-gate US-XXXX
3. If exit != 0 → output blockers; NO product code
4. If passed → meridian_db_cli show US-XXXX --full; read Architecture refs + 04_principles
5. Implement Acceptance + Planned (DRY + SRP)
6. Board UI refreshes automatically on DB upsert
7. Remind manager: review diff → /complete-us → commit (human)
```

---

## Output

```txt
Implement gate: passed | blocked
US:
Blockers:
Architecture refs read:
DRY / SRP applied:
Files touched:
Tests run:
Next: /complete-us US-XXXX (after manager review)
```

---

## vs `/refine-us`

| `/refine-us` | `/implement-us` |
| --- | --- |
| Docs only; sets `ready: true` | Gate CLI + product code |
| Deepens Plan | Requires Plan already concrete |
| Never writes app code | Writes code after gate passes |

Typical flow: `/create-us` → `/refine-us` → **`/implement-us`** → `/complete-us`.
