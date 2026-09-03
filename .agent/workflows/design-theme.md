---
description: Define or audit theme modes and typography hierarchy in docs/09_design_system.md — tokens, light/dark, type ramp.
---

# /design-theme — theme and type contract

$ARGUMENTS

---

## Critical rules

1. Use `design-system-owner` + `@[skills/design-theme]`
2. Read `theme-checklist.md` and `type-hierarchy-checklist.md` before Write on `09`
3. **Doc only** — no product theme files
4. Human sets `status: approved` on `09`
5. Block if `05_architecture.md` is not at least `review` → `scrum-master`

---

## Modes (`$ARGUMENTS`)

| Argument | Mode | Action |
| -------- | ---- | ------ |
| _(empty)_ | **full** | Colors + Theme modes + type ramp |
| `bootstrap` | **bootstrap** | After stack id exists — fill tokens and ramp (pairs with `/design-pass bootstrap`) |
| `audit` | **audit** | Report-only vs current `09` + spot-check feature CSS for hex / size drift |
| `US-XXXX` | **us-scope** | Tokens/type cited by that US Acceptance |

---

## Task

```txt
CONTEXT:
- User Request: $ARGUMENTS
- Mode: DESIGN THEME

RULES:
1. If no 09 or no stack id → /design-pass bootstrap first
2. Walk theme-checklist.md then type-hierarchy-checklist.md
3. Fill § Colors, § Theme modes, § Typography; name the token file
4. audit mode: do not Write unless manager asked to patch 09
5. prepend-decision on mode model or family change
```

---

## Output

```txt
Mode: full | bootstrap | audit | us-scope
Token source:
Modes:
Type roles:
Integrity gaps:
Next: /design-flow | /design-review | /refine-us US-XXXX | human review 09
```

---

## When to run

- Dark mode, host theme, or a second brand theme
- Random hex or a zoo of font sizes in UI
