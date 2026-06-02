---
description: Create or review 07_architecture.md after required Meridian documents are approved.
---

# /architecture

## Goal

Create architecture that reflects approved scope, stack, security, users, principles
and versions.

## Agent

Use `architecture-guardian`.

## Preconditions

- `00_scope.md` approved.
- `01_tech_stack.md` approved.
- `02_security.md` approved or explicitly accepted as incomplete risk.
- `03_user_types.md` approved.
- `05_principles.md` approved.
- `06_versions.md` approved.

## Procedure

1. Read prerequisite docs.
2. Identify current version target.
3. Define application boundaries.
4. Define data flow.
5. Define frontend structure.
6. Define backend/bridge boundaries, if any.
7. Define state, cache, parsing and validation strategy.
8. List integration points.
9. Record architectural decisions.
10. Update `07_architecture.md`.

## Output

```txt
Architecture updated:
Decisions:
Risks:
Blocked by:
Next document:
```
