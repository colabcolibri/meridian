# Meridian kit scripts

> Python 3 **stdlib only** (no `pip install`). Entry points for humans, CI, extension, and agents.

## Runtime (use daily)

| Script | Purpose |
| ------ | ------- |
| `meridian_db.py` | Library: connect, migrations, `upsert_*`, export, board write |
| `meridian_markdown_parse.py` | Library: frontmatter + US section parsing |
| `meridian_section_contracts.py` | Library: structural validation helpers |
| `bootstrap_meridian_db.py` | Create/upgrade `.meridian/meridian.db` (`bootstrap`) |
| `meridian_db_cli.py` | **Agent CLI:** counts, list, show, search, create-us, update-us, set-ready, set-summary, **implement-gate** |
| `meridian_db_export.py` | JSON export for extension (`--format planning`; `--entity us --id US-XXXX` for one markdown body) |
| `validate_meridian.py` | Governance validator (default / `--sqlite-only` / `--md-only`) |
| `backfill_summaries.py` | Fill empty `summary` columns |

## Shell (maintainers)

| Script | Purpose |
| ------ | ------- |
| `sync_cursor_kit.sh` | Regenerate `.cursor/`, `.claude/`, Codex adapters |
| `install-meridian-kit.sh` | Install `.agent/` into a target project |
| `package-kit.sh` | Build `meridian-kit-*.tar.gz` |

## CI / tests

| Script | Purpose |
| ------ | ------- |
| `test_meridian_db_schema.py` | Smoke test migrations |
| `test_story_dependencies.py` | FK + cycle checks for `story_dependencies` |
| `test_implement_gate.py` | `/implement-us` gate CLI |
| `meridian_implement_gate.py` | Library: `check_implement_gate()` |

## Migration lane (v1 Markdown → v10 SQLite)

Run once per project when importing from branch `meridian-v1-old` or legacy tree:

| Script | Purpose |
| ------ | ------- |
| `migrate_md_to_sqlite.py` | Import `docs/us`, epics, versions, sprints, decisions → DB |
| `verify_md_sqlite_parity.py` | Gate: compare `.md` vs DB before purge |
| `purge_delivery_md.py` | Remove delivery `.md`/`.json` after verify (`--require-verify`) |

After cutover these are rarely needed unless restoring from git history.

## Archived

See `archive/` — one-off migrations superseded by SQLite-only v10.

## Who calls what

| Consumer | Scripts |
| -------- | ------- |
| **Cursor / Claude agents** | `meridian_db_cli.py`, `validate_meridian.py` |
| **VS Code extension** | `validate_meridian.py`, `meridian_db_export.py` (spawns `python3`) |
| **GitHub Actions** | `validate_meridian.py --sqlite-only`, `test_meridian_db_schema.py` |
| **Pre-commit** | `validate_meridian.py` |

## Python requirement

**Yes — Python 3 is required** for validate, SQLite tooling, and extension board/deliverables when using the DB. The kit deliberately uses stdlib-only Python so no virtualenv is needed. Chat-only agent use without validate/board is possible but not the supported workflow. See `docs/08_environments.md` § Python dependency.
