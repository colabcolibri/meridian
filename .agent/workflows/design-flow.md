---
description: Design or audit screen flows and responsive surface IA in docs/09_design_system.md — journeys, states, web vs app.
---

# /design-flow — screen flow contract

$ARGUMENTS

---

## Critical rules

1. Use `design-system-owner` + `@[skills/design-flow]`
2. Read `screen-flow-checklist.md` before Write on `09`
3. More than one surface (web / app / extension) → also `surface-patterns.md`
4. **Doc only** — no product code
5. Human sets `status: approved` on `09`
6. Block if `05_architecture.md` is not at least `review` → `scrum-master`

---

## Modes (`$ARGUMENTS`)

| Argument | Mode | Action |
| -------- | ---- | ------ |
| _(empty)_ | **full** | Inventory jobs → update § Screen flows |
| `web` / `app` / `extension` | **surface** | One surface vs `surface-patterns.md` |
| `US-XXXX` | **us-scope** | Map that US to a flow row; gaps in Plan |

---

## Task

```txt
CONTEXT:
- User Request: $ARGUMENTS
- Mode: DESIGN FLOW

RULES:
1. If no 09 → copy stub from phase-docs/09-design-system.md (or run /design-pass bootstrap first)
2. Walk screen-flow-checklist.md
3. Fill § Screen flows + mermaid; align § Responsive behavior with surface-patterns.md
4. Recommend /design-theme if Colors/Typography are still placeholders
5. Recommend /refine-us when Must UI US has no flow row
```

---

## Output

```txt
Mode: full | surface | us-scope
Surfaces:
Flows updated:
Gaps (doc):
Gaps (US):
Next: /design-theme | /design-pass | /refine-us US-XXXX | human review 09
```

---

## When to run

- Before implementing a new route, sheet, or mobile layout
- When screens feel unstructured or desktop-cloned onto phone
