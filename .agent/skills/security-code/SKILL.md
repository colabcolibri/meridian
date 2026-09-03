---
name: security-code
description: Audits implemented code against docs/02_security.md and US acceptance. Use with /security-review. Report only — no product code.
allowed-tools: Read, Glob, Grep, Bash
---

# Security code (Meridian)

> Attest the **increment** against the standard in `02`. Do not rewrite `02` here (`security-doc`). Do not run a pentest exploit.

## Operator workflow

| Workflow | Purpose |
| -------- | ------- |
| `/security-review` | Audit code vs `02` + US (no code) |

## Selective reading

| File | When to read |
| ---- | ------------ |
| `references/implementation-security-checklist.md` | **Mandatory** |
| `docs/02_security.md` | Contract |
| Target US | `meridian_delivery.py show US-XXXX --full` when scoped |

## When to trigger

- `/security-review`
- Before `/complete-us` on Must US with security acceptance
- Suspected leak, missing authz, injection surface in **code**

## Procedure

1. Require `02` at least `draft`.
2. Walk `implementation-security-checklist.md` (including offensive extras / STRIDE when asked).
3. Report only. Route: doc → `/security-pass`; plan → `/refine-us`; code → `/implement-us`; lockfile → `/dependency-audit`.
4. `technical-architect` may **consult** this skill; must not run `/security-review` as owner or set `ready`/`✅`.

## Output

```txt
Security code review:
US:
Critical findings:
Route: /security-pass | /refine-us | /implement-us | /dependency-audit
```
