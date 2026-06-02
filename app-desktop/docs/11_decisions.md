---
title: Decision Log
status: approved
version: 2.1
updated: 2026-06-02
depends_on: []
blocks: []
---

# 11 — Decision Log

Decisions live in **`docs/decisions/YYYY-MM-DD.json`** — one JSON file per calendar day.

## Format

```json
{
  "date": "2026-06-02",
  "entries": [
    {
      "time": "17:30",
      "title": "Objective title",
      "affected_document": "path/to/doc.md",
      "what_changed": "factual description",
      "why_changed": "context and motivation",
      "impact": "affected docs; mark review",
      "responsible": "role or person"
    }
  ]
}
```

- `date` must match the file name
- `entries`: most recent at the **start** of the array (prepend on the same day)
- New day → new file `YYYY-MM-DD.json`

## Where to view

**Decisions** tab in this app — list by date with structured detail for each entry.
