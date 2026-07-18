# Meridian kit scripts

> Python 3 **stdlib only** (no `pip install`). Entry points for humans, CI, extension, and agents.

## Layout (v11)

```txt
.agent/scripts/
  lib/              # shared Python modules
  migrate/          # v1 Markdown → SQLite (one-shot)
  test/             # smoke tests (root shims for CI)
  dev/              # local fixtures (meridian-teste)
  *.py              # runtime CLI + shims (stable paths for extension/CI)
  *.sh              # kit install / sync / package
```

## Runtime (use daily)

| Script | Purpose |
| ------ | ------- |
| `lib/meridian_db.py` | Library: connect, migrations, `upsert_*`, export, board snapshots |
| `lib/meridian_markdown_parse.py` | Library: frontmatter + section parsing |
| `lib/meridian_section_contracts.py` | Library: structural validation helpers |
| `lib/meridian_delivery_form.py` | Library: form ↔ markdown (extension) |
| `bootstrap_meridian_db.py` | Create/upgrade `.meridian/meridian.db` |
| `meridian_db_cli.py` | **Agent CLI:** counts, list, show, search, create-us/epic/version/sprint, update-us, set-ready, set-summary, implement-gate |
| `meridian_db_export.py` | JSON export for extension (`--format planning`; `--write-form`) |
| `validate_meridian.py` | Governance validator (default / `--sqlite-only` / `--md-only`) |
| `meridian_delivery_form.py` | Shim — re-exports `lib/meridian_delivery_form.py` for extension path checks |

## Shell (maintainers)

| Script | Purpose |
| ------ | ------- |
| `sync_cursor_kit.sh` | Regenerate `.cursor/`, `.claude/`, Codex adapters |
| `install-meridian-kit.sh` | Install `.agent/` into a target project |
| `package-kit.sh` | Build `meridian-kit-*.tar.gz` |

## CI / tests

Root shims delegate to `test/`:

| Script | Purpose |
| ------ | ------- |
| `test_meridian_db_schema.py` | Smoke test migrations |
| `test_story_dependencies.py` | FK + cycle checks for `story_dependencies` |
| `test_implement_gate.py` | `/implement-us` gate CLI |

## Migration lane (`migrate/`)

Run once per project when importing from branch `meridian-v1-old`:

| Script | Purpose |
| ------ | ------- |
| `migrate_md_to_sqlite.py` | Import delivery `.md` → DB |
| `verify_md_sqlite_parity.py` | Gate before purge |
| `purge_delivery_md.py` | Remove delivery `.md` after verify |
| `backfill_summaries.py` | Fill empty `summary` columns |
| `archive/migrate_us_v2_structure.py` | Pre-SQLite US section rewrite (archived) |

## Dev (`dev/`)

| Script | Purpose |
| ------ | ------- |
| `seed_meridian_teste_db.py` | Minimal delivery rows for `meridian-teste` smoke |

## Who calls what

| Consumer | Scripts |
| -------- | ------- |
| **Cursor / Claude agents** | `meridian_db_cli.py`, `validate_meridian.py` |
| **VS Code extension** | `validate_meridian.py`, `meridian_db_export.py`, `meridian_delivery_form.py` (path check) |
| **GitHub Actions** | `validate_meridian.py --sqlite-only`, `test_*.py` shims |
| **Pre-commit** | `validate_meridian.py` |

## Python requirement

**Yes — Python 3 is required** for validate, SQLite tooling, and extension board when using the DB. Stdlib only — no virtualenv. See `docs/08_environments.md`.
