---
description: Review or deepen docs/09_design_system.md and align UI user stories with design tokens and components.
---

# /design-pass — design system pass

$ARGUMENTS

---

## Critical rules

1. Use `design-system-owner` + `@[skills/design-system]`
2. Read `design-system-checklist.md` before Write on `09_design_system.md`
3. If argument is `US-XXXX` — load US via `meridian_db_cli.py show US-XXXX --full`; suggest Plan Architecture refs to `09_design_system.md`
4. Do not implement product code in this workflow
5. Human sets `status: approved` on `09_design_system.md`

---

## Task

```txt
CONTEXT:
- User Request: $ARGUMENTS
- Mode: DESIGN PASS

RULES:
1. If no 09_design_system.md → create stub from doc-templates / init-project refs
2. Run checklist; fill gaps
3. If US id provided → map Acceptance UI criteria to 09 sections
4. Recommend /refine-us if US Plan missing design refs for Must UI
```

---

## Output

```txt
09_design_system status:
Sections updated:
US follow-ups:
Next: human review → approved | /refine-us US-XXXX
```
