---
description: Create or review 05_architecture.md after required Meridian documents are approved.
---

# /architecture — architecture

$ARGUMENTS

---

## Critical rules

1. Use `architecture-guardian`
2. Prerequisites: scope, stack, security, users (draft minimum)
3. Align with `02_security` — load `security-review` if gaps
4. Material change → `/update-decisions-log` (read skill + run `date` before Write)
5. No product code in this workflow (unless explicit request in $ARGUMENTS)

---

## Task

```txt
CONTEXT:
- User Request: $ARGUMENTS
- Mode: ARCHITECTURE DOC

RULES:
1. architecture-guardian Phase 0 gate
2. Read 00, 01, 02, 03, 04, 06 before editing 07
3. Fill checklist in agent file
4. Cross-check 08/09 if they exist
5. Set status draft or review — not approved without human
```

---

## Output

```txt
05_architecture status:
Aligned with: [docs]
Drift detected:
Proposed changes:
Security follow-ups:
Ready for review: yes | no
```
