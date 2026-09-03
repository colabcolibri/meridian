---
title: API Contracts
status: approved
version: 1.1
updated: 2026-09-03
depends_on: [03_user_types.md, 05_architecture.md, 06_database.md]
blocks: []
---

# 07 — API Contracts

## Current state

There is **no remote API**. Delivery stays in `.meridian/meridian.db`.

The kit HTML monitor exposes **loopback GET** only (`127.0.0.1`, ephemeral port). Same planning payload as `meridian_db_export.py --format planning` (`docs/06_database.md` § Extension and export). The monitor snapshot may add `column` per user story; that field is **not** part of the extension export schema.

| Method | Path | Role |
| ------ | ---- | ---- |
| GET | `/api/health` | `packageRoot`, pid, port |
| GET | `/api/snapshot` | planning + decisions + `column`; JSON error if db missing |
| GET | `/api/entity` | `export_entity_markdown` (`type` + `id`) |
| GET | `/api/docs` | list of phase/architecture markdown under `docs/` |
| GET | `/api/doc` | one file under `docs/` (resolved path, no `..`) |
| GET | `/api/events` | SSE `planning-changed` when db/wal/shm mtime changes |
| GET | `/` and static | files from `.agent/board-ui/` |

Non-GET → 405. No upsert, no POST body, no auth (loopback).

## Pending

- Optional palette command in the extension to spawn the same script (US-0204).
- No cloud or multi-user contract.
