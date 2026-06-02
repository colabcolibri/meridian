---
name: update-decisions-log
description: Prepends relevant project decisions to docs/decisions/YYYY-MM-DD.json (newest first in entries). Use when scope, stack, security, architecture, versions or acceptance criteria change.
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

# Update decisions log

## Selective reading

| File | When to read |
| ------- | ---------- |
| `references/decision-template.md` | When registering each new entry |
| `references/decision-schema.md` | When creating daily file or validating fields |

## When to register

Change in: scope, stack, security, users, epics, versions, architecture, database, API, environments, acceptance, agent governance.

## Procedure

1. Determine today's date (`YYYY-MM-DD`).
2. Open or create `docs/decisions/YYYY-MM-DD.json`.
3. Insert **at the beginning** of `entries` using `references/decision-template.md`.
4. Ensure `date` in JSON matches filename.
5. Old entries remain **below**, intact.
6. If `approved` doc was changed → `status: review` on that doc + mention in impact.
7. **Never** edit or reorder old entries.

## Archiving

Old days remain as immutable JSON files in `docs/decisions/`.
Do not compact or move old entries — history is append-only by prepend.

## Output

```txt
Decision logged:
File: docs/decisions/YYYY-MM-DD.json
Affected document:
Docs moved to review:
Follow-up:
```
