---
title: Environments
status: approved
version: 1.4
updated: 2026-09-03
depends_on: [01_tech_stack.md, 05_architecture.md]
blocks: []
---

# 08 — Environments

## How to run locally

### Prerequisites

- **Python 3** on `PATH` — required for kit scripts and extension (see § Python dependency).
- **Node.js 18+** and **pnpm** — only if working on `app-visual-studio/` extension.

### Kit + dogfood (repository root)

```bash
python3 .agent/scripts/meridian_delivery.py bootstrap
python3 .agent/scripts/validate_meridian.py . --sqlite-only
python3 .agent/scripts/meridian_delivery.py counts
python3 .agent/board
```

`python3 .agent/board` is the human shortcut (same as `python3 .agent/scripts/meridian_board_serve.py`). On macOS/Linux you can also run `./.agent/board`. It binds `127.0.0.1` on an ephemeral port, prints the URL, opens the default browser, and **exits when you Ctrl+C**. It is not started by the Cursor extension `activate` hook. Requires `.meridian/meridian.db` (run bootstrap first). No pnpm.

Canonical bootstrap is **`meridian_delivery.py bootstrap`** (also `bootstrap_meridian_db.py` shim). Read commands (`show`, `list`, `counts`, …) auto-bootstrap when `.meridian/meridian.db` is missing on a valid Meridian product folder.

Fresh clone without `.meridian/meridian.db`: bootstrap creates empty schema + `delivery.json`. Import legacy delivery from branch `meridian-v1-old` via **`/migrate-delivery`** or `migrate_md_to_sqlite.py` (see `docs/06_database.md` § Migration).

### Validate Meridian governance

```bash
python3 .agent/scripts/validate_meridian.py <package-root>
python3 .agent/scripts/validate_meridian.py <package-root> --sqlite-only
python3 .agent/scripts/validate_meridian.py <package-root> --json   # CI
```

## Python dependency

| Who | Needs Python? | Why |
| --- | ------------- | --- |
| **Kit / agents (Cursor, Claude, Codex)** | **Yes** | `meridian_delivery.py`, `validate_meridian.py`, `meridian_db_export.py`, `meridian_board_serve.py` — stdlib only, no `pip` |
| **VS Code extension** | **Yes** | Validate command + Board/Deliverables read SQLite via `python3 .agent/scripts/meridian_db_export.py` |
| **Kit HTML board (browser)** | **Yes** | Same `python3`; no Node |
| **Chat-only (no validate, no board)** | No | Not a supported workflow — docs would drift without validator |
| **Phase docs only** | No | Editing `docs/00_scope.md` etc. is plain Markdown |

Python is an intentional choice: single stdlib runtime for migrations, validation, and SQLite access without shipping a second compiled binary. **macOS/Linux** usually have `python3`; **Windows** install from [python.org](https://www.python.org/) or Microsoft Store and ensure `python3` or `py -3` is on PATH.

Alternative (not planned v10): rewrite `meridian_db` in Node for the extension, or bundle a frozen Python — would duplicate logic today.

Script inventory: `.agent/scripts/README.md`.

## VS Code extension (`app-visual-studio/`)

### Prerequisites

- Node.js 18+, pnpm.
- Python 3 on `PATH` (for commands that shell out to `.agent/scripts/` from v4-S2 onward).
- VS Code or Cursor with Extension Development Host.

### Setup and compile

```bash
cd app-visual-studio
pnpm install
pnpm compile
```

`npm.autoDetect` is **off** in this folder — `package.json` is an extension manifest, not a plain npm app.

### Debug (F5)

| Workspace opened            | Launch config |
| --------------------------- | ------------- |
| Monorepo root (`meridian/`) | Extension `.vscode/launch.json` → **Run Extension** (opens repo root) |

After F5, open **Meridian: Open Board** — data loads from SQLite when `.meridian/meridian.db` exists.

### Extension scripts

| Script                    | Purpose                                      |
| ------------------------- | -------------------------------------------- |
| `pnpm compile`            | esbuild bundle to `dist/extension.js`        |
| `pnpm typecheck`          | `tsc --noEmit` (strict)                      |
| `pnpm lint`               | ESLint on `src/` and `test/`                 |
| `pnpm watch` / `pnpm dev` | Watch mode                                   |
| `pnpm test`               | Compile + unit tests for workspace detection |

Packaging for Marketplace (`vsce package`) → v4-S4 / US-0052.

## Environment variables

v10 extension and kit do not require environment variables.

| Variable | Description                | Required | Example |
| -------- | -------------------------- | -------: | ------- |
| —        | No variable required in v0 |       No | —       |

## Protected files

- `.env`
- `.env.*`
- `node_modules/`
- `dist/`
- local caches and logs

`.env.example` should be versioned as a configuration contract.

## Available environments

| Environment | Purpose                    | Branch | Automatic deploy |
| ----------- | -------------------------- | ------ | ---------------- |
| local       | Kit + extension + SQLite   | any    | no               |

## Differences between environments

There are no remote environments in v0 yet.

## CI/CD

**Quality profile:** `qualitySiege: full` — declared in `.meridian/projects.json` (project `meridian`). Resolve: `python3 .agent/scripts/meridian_delivery.py quality-profile`. Kit reference: `.agent/references/agentic-quality-model.md`.

Workflow map: `.github/workflows/README.md`.

| Workflow | Trigger | Scope | Status |
| -------- | ------- | ----- | ------ |
| `ci.yml` → `validate-meridian` | push/PR `main` | Bootstrap → `validate_meridian.py --sqlite-only --strict-kit-md` → `run_kit_tests.py` | required |
| `ci.yml` → `extension` | push/PR `main` | `pnpm audit --prod` → typecheck → lint → compile → test → coverage (advisory) | required |
| `codeql.yml` | push/PR `main` | `javascript-typescript`, `python` | required |
| `dependabot.yml` | schedule | npm @ `app-visual-studio/`, GitHub Actions | required |
| `pr-review.yml` | PR opened | Checklist comment (independent review nudge) | optional |

### `ci.yml` job detail

| Job | Steps |
| --- | ----- |
| `validate-meridian` | Bootstrap SQLite → validator → kit Python suite |
| `extension` | `pnpm install --frozen-lockfile` → prod audit → typecheck → lint → compile → test → coverage advisory (`continue-on-error`) |

Local parity:

```bash
python3 .agent/scripts/meridian_delivery.py bootstrap
python3 .agent/scripts/validate_meridian.py . --sqlite-only --strict-kit-md
python3 .agent/scripts/run_kit_tests.py
cd app-visual-studio && pnpm audit --prod --audit-level=high
cd app-visual-studio && pnpm typecheck && pnpm lint && pnpm compile && pnpm test
```

Test strategy details: `docs/10_test_strategy.md`.

## Git hooks

Husky `.husky/pre-commit` runs governance validation only (fast):

```bash
python3 .agent/scripts/meridian_delivery.py bootstrap
python3 .agent/scripts/validate_meridian.py . --sqlite-only --strict-kit-md
```

Pre-commit does **not** run the full test suite — CI enforces tests on PR. Match CI flags when editing the hook.
