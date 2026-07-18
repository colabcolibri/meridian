# Discovery folder — `docs/discovery/`

Use with `/discover` and agent `product-owner`. PO lane — before scope is approved and before backlog exists.

---

## Roles in Meridian

| Role | Lane | Primary artifacts | Commands |
| ---- | ---- | ----------------- | -------- |
| **PO** | What to build, for whom, why | `docs/discovery/product-brief.md` | `/discover` |
| **PM** | Governance, phases, delivery plan | `docs/` phase docs, versions, sprints | `/init-meridian`, `/status`, `/plan-sprint` |
| **Dev** | Executable slices | `docs/us/*.md` | `/refine-us`, `/implement-us`, `/complete-us` |

Discovery is **exploratory**. `00_scope.md` is the **contract** agents execute against once approved.

---

## Canonical file

| Path | Role |
| ---- | ---- |
| `docs/discovery/product-brief.md` | Product brief — problem, users, value, in/out candidates, epic candidates, open questions |

Optional later: `docs/discovery/interviews/` or `docs/discovery/research/` — only when manager needs separate notes; index from the brief.

---

## Recommended flow

```txt
/discover                    → product-brief.md (PO)
/init-meridian               → full docs/ tree (PM) — reads brief if present
00_scope + 03_user_types     → promote from brief; scope-architect challenges
Phase 2 → 05 approved        → backlog (/create-epic …)
/refine-us → /implement-us   → dev lane
```

**Greenfield:** `/discover` before `/init-meridian` when the idea is still fuzzy.

**Existing codebase:** `/init-meridian` Mode B (inventory) then `/discover` to align product intent with as-is.

---

## Gate rules

- Discovery does **not** replace `00_scope.md` approval.
- No epics, versions, or US from `/discover` alone.
- No product code in `/discover`.

---

## Handoffs

| Agent / command | When |
| --------------- | ---- |
| `scope-architect` | Brief `ready for scope` — tighten boundaries in `00_scope.md` |
| `process-manager` | `/init-meridian` — structure and decision log |
| `documentation-strategist` | Phase docs after scope direction exists |

Material product pivot → `/update-decisions-log` (`date` before Write).
