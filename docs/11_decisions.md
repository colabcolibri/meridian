---
title: Decision Log
status: approved
version: 3.0
updated: 2026-07-18
depends_on: []
blocks: []
---

# 11 — Decision log

Decisions live in **SQLite**: `.meridian/meridian.db` → table `decisions`.

`docs/11_decisions.md` is the human index (this file). The canonical store is the database, not JSON files under `docs/decisions/`.

## Entry shape

Each row stores `decision_date`, `entry_index` (0 = newest that day), and `payload_json`:

```json
{
  "time": "17:30",
  "title": "Objective title",
  "affected_document": "path/to/doc.md",
  "what_changed": "factual description",
  "why_changed": "context and motivation",
  "impact": "affected docs; mark review",
  "responsible": "role or person"
}
```

- `time` = real clock when logged (`date +"%H:%M"`). Do not round or invent.
- New entries are **prepended** (`entry_index` 0) for the calendar day.
- Never edit or delete old rows.

## Write

```bash
python3 .agent/scripts/meridian_delivery.py prepend-decision \
  --date "$(date +"%Y-%m-%d")" \
  --time "$(date +"%H:%M")" \
  --title "..." \
  --affected-document "docs/05_architecture.md" \
  --what-changed "..." \
  --why-changed "..." \
  --impact "..." \
  --responsible "..."
```

Workflow: `/update-decisions-log` · skill: `update-decisions-log`

## Read

```bash
python3 .agent/scripts/meridian_delivery.py list decisions
python3 .agent/scripts/meridian_delivery.py show-decisions --date YYYY-MM-DD
```

**Decisions** tab in the Meridian app — list by date with structured detail.

## Link from user stories

When a US change depends on a logged decision, Plan **Related decisions** cites the log (do not duplicate the full entry): `YYYY-MM-DD — title`. Write via `prepend-decision` first, then `update-us` on the story.
