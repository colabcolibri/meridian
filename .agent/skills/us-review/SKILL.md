---
name: us-review
description: Audits a Meridian user story against DoR. Report-only or attest ready true. Use with /review-us US-XXXX. Does not cook Plan (story-maker).
allowed-tools: Read, Glob, Grep, Bash
---

# Review user story (Meridian)

Load US from SQLite (`show --full`). You are `story-checker`.

## Modes

| Mode | When | `ready` |
| ---- | ---- | ------- |
| **Report-only** | Manager asked for an audit, or checklist fails | **Do not** change |
| **DoR attest** | Checklist passes **and** manager wants the US implementable | `set-ready true` — **only** this skill/workflow may do that |

Bounce to `story-maker` `/refine-us` when Plan is too thin to attest.

## Selective reading

| File | When to read |
| ------- | ---------- |
| `references/review-checklist.md` | **Mandatory** |
| `references/refine-checklist.md` | When attesting DoR (same bar as former refine-ready) |
| Target US | `meridian_delivery.py show US-XXXX --full` |

## Delivery commands

```bash
python3 .agent/scripts/meridian_delivery.py show US-0115 --full
python3 .agent/scripts/validate_meridian.py .
# DoR attest only:
python3 .agent/scripts/meridian_delivery.py set-ready US-0115 --ready true
```

## Procedure

1. Read checklists + US `--full`.
2. Score review-checklist. If attesting, also confirm refine-checklist rows for Approach, arch refs, sprint, tests.
3. Report-only → no upsert. Attest → `set-ready true` only if every required row passes.
4. Recommend `/refine-us` (maker), `/implement-us`, or `/complete-us`.

## Output

```txt
US review:
ID: US-XXXX
Mode: report-only | DoR attest
Validator:
ready: true | false | unchanged
Recommendation: /refine-us | /implement-us | /complete-us
```
