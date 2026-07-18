---
id: EPIC-14
title: SQLite data layer (Meridian 2.0)
status: complete
versions: [v9]
profiles: [Process Manager, Future VSCode User]
outcome: "Delivery artifacts live in SQLite; phase docs stay Markdown; full v1 history migrated; kit and monitor read/write the database."
---

# EPIC-14 — SQLite data layer (Meridian 2.0)

## Capability

Today every epic, version, sprint, user story, and decision entry is a separate Markdown or JSON file under `docs/`. That works for Git diffs and agent editing, but it scales poorly: hundreds of files, fragile frontmatter parsing, slow validation, and no single query surface for the monitor or extension. Agents must glob and parse file by file; board.json is a derived snapshot that can drift from disk.

Meridian 2.0 moves **delivery artifacts** — epics, versions, sprints, user stories, decision log entries, and board state — into a local **SQLite** database (`.meridian/meridian.db` per product). **Phase documents** (`00_scope.md` through `11_decisions.md`, discovery brief, architecture detail folder) remain Markdown: they are the stable project contract agents read at init and gates. Kit scripts, skills, workflows, validator, board generator, VS Code extension, and app-desktop monitor gain a shared repository layer over SQLite. A one-shot **migration script** imports the entire dogfood history from existing `.md` and `docs/decisions/*.json` so nothing is lost when `main` becomes the new Meridian and the current tree is archived as `meridian-v1-old`.

## Expected outcome

A Process Manager opens a Meridian project, sees epics/US/sprints in the monitor loaded from SQLite, runs `/create-us` and the story is persisted in the database (not a new `docs/us/US-XXXX.md`), runs validate and board sync against the DB, and can still read approved phase docs as Markdown. Running the migration script on dogfood reproduces all 100+ US, every sprint, version, epic, and decision entry with integrity checks. The repository has a documented cutover: current `main` preserved on `meridian-v1-old`, new Meridian development continues on `main` with the DB-first protocol.

## Out of scope for this epic

- Cloud sync, multi-user, or remote API (v8 vision gate — stays local SQLite only).
- Replacing phase docs (`00`–`11`) with database rows — those stay `.md` by design.
- Real-time collaborative editing or CRDT merge.
- PostgreSQL or server-hosted database — SQLite file per product only.
- Auto-deleting legacy `.md` delivery files after migration (separate manager decision; migration may leave read-only archive).

## Notes

- Activates `06_database.md` from `draft` to `approved` as part of v9-S1 (US-0113).
- Depends on `05_architecture.md` amendment for storage split and `.meridian/` layout.
- EPIC-10 (shared workspace) remains paused; SQLite is local-first and compatible with future sync stories.
- Repo lineage (US-0114) is procedural — branch/tag strategy, not product runtime.
