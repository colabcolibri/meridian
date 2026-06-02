---
description: Review and deepen security documentation before architecture or implementation.
---

# /security-pass

## Goal

Make project security explicit and actionable.

## Agent

Use `security-steward` with `security-review`.

## Procedure

1. Read `00_scope.md`, `01_tech_stack.md`, `02_security.md` and `03_user_types.md`.
2. Identify assets, actors, secrets and attack surfaces.
3. Review `.gitignore`, `.env.example`, dependencies and lockfiles.
4. Map OWASP risks to context.
5. Add AI-agent safety boundaries.
6. Update `02_security.md`.
7. Register decisions.

## Output

```txt
Critical risks:
High risks:
Accepted risks:
Docs updated:
Next mitigation:
```
