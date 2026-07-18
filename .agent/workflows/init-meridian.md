---
description: Initialize a project using the Meridian protocol and minimum governance. Works for new projects and existing codebases migrating to Meridian.
---

# /init-meridian — initialize project

$ARGUMENTS

---

## Critical rules

1. **NO PRODUCT CODE** — only `docs/` structure and governance
2. Use agent `scrum-master`, skill `init-project`
3. **Mandatory read:** `init-interview-guide.md` + `doc-templates.md` + `phase-docs/*.md` (Mode A)
4. Register initial decision in `docs/decisions/YYYY-MM-DD.json`
5. Never mark phase docs `approved` — only `draft`
6. **Interview required** when context is thin — see `init-interview-guide.md`

---

## Mode detection

| Situation | Mode |
| --------- | ---- |
| No codebase yet, starting fresh | **Mode A** — new project |
| Code exists, no `docs/` | **Mode B** — existing codebase |
| `docs/` exists but incomplete | Repair — fill gaps only |
| Fuzzy product idea | Recommend **`/discover`** before Mode A |

---

## What creates all phase docs

| Mode | Who fills `00`–`08` |
| ---- | ------------------- |
| **A** | `/init-meridian` — agent writes full drafts from interview + `phase-docs/` |
| **B** | `/init-meridian` — structure + bootstrap → **`/document-project`** fills bodies |

---

## Task

```txt
CONTEXT:
- User Request: $ARGUMENTS
- Mode: INIT ONLY (no product code)

RULES:
1. Read init-interview-guide — run interview if needed
2. Detect Mode A or B
3. Run init-project skill
4. Mode A: populate ALL phase docs per depth bar (not headings only)
5. Mode B: bootstrap + point to /document-project
6. validate_meridian.py --sqlite-only
7. REPORT paths + assumptions
```

---

## Deliverables

| Item | Location |
| ---- | ----- |
| Docs structure | `docs/` + `decisions/` |
| Phase docs | `00`–`08`, `11` (+ optional `09`) |
| Decision log | `docs/decisions/YYYY-MM-DD.json` |
| Delivery DB | `.meridian/meridian.db` |
| Delivery profile | `.meridian/delivery.json` |

---

## Expected output

```txt
Meridian initialized:
Mode: …
Interview: …
Created: …
Next: …
```

---

## After

**New project (Mode A):**

```txt
1. Review docs/00_scope.md — approve or adjust
2. Approve 01 → 02 → 03 → 04 in order
3. /audit-docs (optional) — gap report
4. /architecture — deepen 05
5. Approve 05_architecture
6. /create-epic → /create-version → /plan-sprint → US workflow
```

**Existing codebase (Mode B):**

```txt
1. /document-project — inventory + phase docs from code
2. Review docs/inventory/as-is.md
3. /audit-docs — consistency pass
4. Approve phase docs → /architecture → backlog for forward work only
```

**Optional anytime:** `/discover` for product brief · `/audit-docs` when docs drift
