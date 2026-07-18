# Phase doc template — `04_principles.md`

**Agent:** `technical-writer`  
**Read at:** `/refine-us`, `/implement-us` — agents apply DRY + SRP from here.  
**Depth bar:** DRY bullets name **real paths**; layer table has ≥3 rows.

## Frontmatter

```yaml
---
title: Code Principles
status: draft
version: 1.0
updated: YYYY-MM-DD
depends_on: [01_tech_stack.md, 02_security.md, 03_user_types.md]
blocks: [05_architecture.md]
---
```

## Sections

| `##` heading | Prompt | Pass when |
| ------------ | ------ | --------- |
| **DRY — where each type of logic lives** | 4–8 bullets: domain rules, validation, UI, constants, scripts | Each bullet has folder or package path |
| **Single responsibility** | Table: Layer \| Responsibility | Aligns with `05` layers |
| **SOLID (optional)** | Map OCP/LSP/ISP/DIP to this stack in 1 line each | Skip section if not applicable; SRP required via layer table |
| **Definition of Done** | Team-wide bar to close any US | References acceptance, tests, Record, commit policy |
| **Mandatory conventions** | Lint, naming, package manager, commit format | Tooling from `01_tech_stack` |
| **Error handling** | How errors surface (API envelope, UI toast, logs) | `_n/a_` only with reason |

## Mode B

Infer layer paths from repo structure; mark uncertain rows `(review)`.

## Anti-patterns

- “Follow best practices” without paths
- Duplicating full architecture in principles
