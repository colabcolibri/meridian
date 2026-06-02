---
description: Initialize a project using the Meridian protocol and minimum governance.
---

# /init-meridian — initialize project

$ARGUMENTS

---

## Critical rules

1. **NO PRODUCT CODE** — only `docs/` structure and governance
2. Use agent `process-manager`, not generic IDE plan mode
3. Follow `@[skills/init-project]` and `process-manager` phases
4. Maximum 3 questions if project intent is vague
5. Register initial decision in `docs/decisions/YYYY-MM-DD.json`

---

## Task

Use `process-manager` with this context:

```txt
CONTEXT:
- User Request: $ARGUMENTS
- Mode: INIT ONLY (no product code)
- Target: project root (confirm with user if ambiguous)

RULES:
1. Read .agent/MERIDIAN.md
2. Run init-project skill procedure
3. Create docs/ tree per skill
4. 00_scope.md = draft
5. `11_decisions.md` stub + first JSON entry in `docs/decisions/`
6. board.json = []
7. Validate .gitignore baseline
8. REPORT exact paths created
```

---

## Deliverables

| Item | Location |
| ---- | ----- |
| Docs structure | `docs/` + subfolders |
| Initial scope | `docs/00_scope.md` |
| Decision log | `docs/decisions/YYYY-MM-DD.json` + stub `11_decisions.md` |
| Empty board | `docs/kanban/board.json` |

---

## Expected output

```txt
Meridian initialized:
Created:
Pending:
Blocked:
Assumptions:
Next human decision:
```

---

## After

Tell the user:

```txt
Next steps:
1. Review docs/00_scope.md
2. Fill in 01_tech_stack, 02_security, 03_user_types, 04_principles
3. Approve 05_architecture (+ 08–10 if applicable)
4. Plan delivery: /create-version, /create-epic — plan epics/versions/sprints in folders
5. /create-us (gate: 04 + 06 approved) → implement → /complete-us → /sync-board
```
