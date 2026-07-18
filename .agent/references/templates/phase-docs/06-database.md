# Phase doc template — `06_database.md`

**Agent:** `technical-writer`  
**Depth bar:** if no DB, one paragraph explaining persistence model.

## Frontmatter

```yaml
---
title: Database
status: draft
version: 1.0
updated: YYYY-MM-DD
depends_on: [05_architecture.md]
blocks: [07_api_contracts.md]
---
```

## Sections

| `##` heading | Prompt | Pass when |
| ------------ | ------ | --------- |
| **Persistence model** | SQL, NoSQL, files, SQLite local, none | Matches implementation |
| **Schema overview** | ER diagram or table list | Link to `docs/architecture/` if large |
| **Migrations** | Tooling, naming (`YYYYMMDDHHMMSS`), location | Path to migration folder |
| **Data ownership** | Which layer may write DB | Aligns with `04_principles` |
| **Backup / restore** | Or `_n/a_` for local dev-only | Stated explicitly |

## Anti-patterns

- Empty doc when `.meridian/meridian.db` or Postgres exists
- Schema only in code with no doc pointer
