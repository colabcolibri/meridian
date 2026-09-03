---
name: design-flow
description: Designs and audits screen flows, information architecture, and responsive surface patterns for web, native, and extension UIs. Use with /design-flow, poorly laid-out screens, journeys, navigation maps, empty/error states, or before Must UI US.
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

# Design flow (Meridian)

> Cook the **journey contract** in `docs/09_design_system.md` (§ Screen flows). Tokens and type scale are `design-theme`. Component inventory is `design-system`.

## Operator workflow

| Workflow | Purpose |
| -------- | ------- |
| `/design-flow` | Map jobs → screens → states; web vs app vs extension |

## Selective reading

| File | When to read |
| ---- | ------------ |
| `references/screen-flow-checklist.md` | **Mandatory** — every pass |
| `references/surface-patterns.md` | **Mandatory** — more than one surface, or mobile/web mix |
| `docs/03_user_types.md` | Jobs and who uses which surface |
| `docs/00_scope.md` | In/out surfaces |
| `docs/09_design_system.md` | Existing contract |
| Target US (`show US-XXXX --full`) | `US-XXXX` mode |

## When to trigger

- `/design-flow`
- Screens feel dumped, crowded, or copied from desktop onto mobile
- New epic with more than one UI surface
- Before `/refine-us` on Must UI that introduces a route or sheet

## Procedure

1. Read `00_scope`, `03_user_types`, `05_architecture` frontend boundaries, current `09`.
2. Walk `screen-flow-checklist.md`. If web **and** app (or extension), also `surface-patterns.md`.
3. Update `09` § Screen flows (tables + mermaid). Do not invent brand outside `00`.
4. Gaps that need code → recommend US (`story-maker`); do not implement.
5. `prepend-decision` only if navigation model or primary surface changes.

## Forbidden

| Forbidden | Why |
| --------- | --- |
| Product code / CSS | `/design-showcase` then `/implement-us` |
| Pixel mock as the contract | Flow + states are the contract; visuals follow `design-theme` |
| One IA for all viewports | `surface-patterns.md` |
| Approving `09` | Human only |

## Output

```txt
Workflow: design-flow
Surfaces:
Primary flows:
Gaps (doc):
Gaps (US):
09 status:
Next: /design-theme | /design-pass | /refine-us US-XXXX | human review 09
```
