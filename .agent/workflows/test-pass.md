---
description: Create or update docs/10_test_strategy.md — pyramid, runners, coverage, US alignment.
---

# /test-pass — test strategy contract

$ARGUMENTS

---

## Critical rules

1. Use `quality-owner` + `@[skills/test-strategy]`
2. Read `test-strategy-checklist.md` before Write on `10_test_strategy.md`
3. **Doc only** — test code → `/implement-us`
4. Human sets `status: approved` on `10_test_strategy.md`
5. Skip when product has no automated tests in scope (CLI-only backends)

---

## Modes (`$ARGUMENTS`)

| Argument | Mode | Action |
| -------- | ---- | ------ |
| _(empty)_ | **full** | Checklist pass on entire `10` |
| `bootstrap` | **bootstrap** | Read `01_tech_stack.md` → pick test stack id → fill pyramid + runners |
| `US-XXXX` | **us-align** | Load US `--full`; map Acceptance tests → strategy sections |

---

## Task

```txt
CONTEXT:
- User Request: $ARGUMENTS
- Mode: TEST PASS

RULES:
1. If no 10_test_strategy.md → copy § Document stub from `.agent/references/templates/phase-docs/10-test-strategy.md`
2. Run mode procedure (full | bootstrap | us-align)
3. Walk test-strategy-checklist.md
4. Recommend /refine-us if Must US Plan missing test strategy refs
5. prepend-decision on material runner or coverage policy changes
```

---

## Output

```txt
Mode: full | bootstrap | us-align
Test stack id:
10_test_strategy status:
Sections updated:
US follow-ups:
Next: human review → approved | /test-review | /refine-us US-XXXX
```
