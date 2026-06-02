---
description: Create a Meridian epic file in docs/epics.
---

# /create-epic — create epic

$ARGUMENTS

---

## Critical rules

1. Use `documentation-strategist` + `@[skills/create-epic]`
2. **Gate:** `05_architecture.md` `approved`; `03_user_types.md` `approved` for epic profiles
3. **Mandatory read:** `.agent/references/templates/INDEX.md` + `epic-template.md` + `section-contracts.md` **before** Write
4. Epic = **product capability**, not a module in `src/`
5. Save `docs/epics/EPIC-XX.md` (source of truth)
6. **Do not** create user story — US comes later with `/create-us` (requires `05_architecture` approved)
7. Run `validate_meridian.py` when possible

---

## Task

```txt
CONTEXT:
- User Request: $ARGUMENTS
- Mode: CREATE EPIC

RULES:
1. documentation-strategist Phase 0 — verify scope + user types
2. If blocked, report smallest doc to fix
3. List docs/epics/EPIC-*.md → next ID = max + 1 (EPIC-07, EPIC-08…)
4. Fill epic-template.md: outcome (product), Capability, Out of scope for this epic
5. Validate profiles against 03_user_types.md
6. Save docs/epics/EPIC-XX.md (filename = id)
7. Save epic file in docs/epics/
8. update-decisions-log if catalog or product boundaries change
9. validate_meridian.py <project-root>
```

---

## Output

```txt
Epic created:
File: docs/epics/EPIC-XX.md
Outcome:
Versions:
Profiles:
epic file saved: yes | no
Validation: passed | warnings | blocked
Open questions:
Next step: /create-us (after 05_architecture approved)
```

---

## Examples

| Request | Result |
| ------ | --------- |
| `/create-epic export PDF report` | EPIC-07 with product outcome + profiles |
| `/create-epic` without clear capability | Ask: who uses it, what it delivers, what stays out |
| `/create-us` without existing epic | Block US → `/create-epic` first |
