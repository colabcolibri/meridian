---
name: security-doc
description: Creates and deepens docs/02_security.md — bootstrap, full pass, US alignment. Use with /security-pass. Does not audit product code.
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

# Security doc (Meridian)

> Cook the security **standard** in `02_security.md`. Code attest is `security-code` (`/security-review`).

## Operator workflow

| Workflow | Purpose |
| -------- | ------- |
| `/security-pass` | Create/update `02` — full, `bootstrap`, or `US-XXXX` |

## Selective reading

| File | When to read |
| ---- | ------------ |
| `.agent/references/templates/phase-docs/02-security.md` | **Init** — stub for `docs/02_security.md` |
| `references/security-doc-checklist.md` | **Mandatory** — structure of `02` |
| `references/security-bootstrap.md` | **Mandatory** — `/security-pass bootstrap` (`02`) |
| `references/ci-gates-bootstrap.md` | **Mandatory** — bootstrap CI rows in `08` |
| `references/checklists.md` | `/security-pass full` or deep `02` |

## When to trigger

- `/security-pass`
- Create or deepen `02_security.md` before architecture `approved`
- Threat model / secrets / OWASP **in the document** (not a code audit)

## Procedure

1. Read `00_scope.md`, `01_tech_stack.md`, `03_user_types.md`.
2. Run `meridian_delivery.py quality-profile` — cap CI recommendations to the declared tier.
3. Full pass: every section in `checklists.md`; bootstrap: `security-bootstrap.md` + `ci-gates-bootstrap.md`.
4. Log material decisions via `update-decisions-log`.
5. Do not mark `02` `approved` (human). Do not write product code.

## Output

```txt
Security doc:
02_security status:
Critical gaps:
Decisions logged:
Blocked until:
Next: /privacy-pass | /security-review | /architecture
```
