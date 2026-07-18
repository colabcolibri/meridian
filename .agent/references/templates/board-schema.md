# Kanban card shape (SQLite / `board_snapshots`)

> **v11:** `docs/kanban/board.json` removed. The extension board reads `meridian_db_export.py --format planning`. Optional audit rows live in `board_snapshots.payload_json`.

## Card fields (per `user_stories` row)

| Field | Column / source |
| ----- | ---------------- |
| `id` | `US-XXXX` |
| `title` | `title` |
| `epic` | `epic_id` |
| `version` | `version_id` |
| `status` | `status` |
| `moscow` | `moscow` |
| `depends_on` | `story_dependencies` |
| `done_when` | `done_when` |
| `tests` | `tests` |
| `tests_status` | `tests_status` |
| `ready` | `ready` (bool) |

## Validations

- Unique ID, format `US-XXXX` (4 digits)
- Epic and version FK exist in SQLite
- Each `depends_on` references existing US PK
- `ready: true` required before `/implement-us` (gate CLI)
- `status: ✅` with `tests: required` requires `tests_status: done`

## Legacy

Pre-v11 projects may still have `docs/kanban/board.json` on disk — ignore when `.meridian/meridian.db` exists.
