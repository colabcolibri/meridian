# Contributing to Meridian

Thank you for considering a contribution. This repository is **experimental** — APIs, UX, and conventions may change while the protocol matures.

By contributing, you agree that your contributions will be licensed under the [PolyForm Noncommercial License 1.0.0](LICENSE).

## Before you start

1. Read [`README.md`](README.md) and [`.agent/MERIDIAN.md`](.agent/MERIDIAN.md) to understand the project and protocol.
2. Read [`.agent/MERIDIAN.md`](.agent/MERIDIAN.md) if you will change agent behavior.
3. Confirm your change respects the core rule: **`docs/` of the target project is the source of truth** (in this kit, `app-desktop/docs/`).

## Where to edit

| What you want to change | Where to edit |
| ----------------------- | ------------- |
| Agents, skills, workflows, rules | **`.agent/`** (canonical source) |
| Cursor / Claude Code adapters (local symlinks) | Run `./.agent/scripts/sync_cursor_kit.sh` — **do not** commit `.cursor/` or `.claude/` |
| Desktop app (UI, parser, validations) | `app-desktop/src/` |
| App product documentation | `app-desktop/docs/` |
| Architecture decisions | Prepend in `app-desktop/docs/decisions/YYYY-MM-DD.json` (skill `update-decisions-log`) |

## Local environment

### Kit + validation

```bash
python3 .agent/scripts/validate_meridian.py app-desktop
python3 .agent/scripts/validate_meridian.py app-desktop --json   # CI
```

### Desktop app

```bash
cd app-desktop
pnpm install
pnpm dev        # http://localhost:5173
pnpm lint
pnpm test
pnpm build
```

### Cursor or Claude Code (optional)

After clone or when adding a new item under `.agent/`:

```bash
chmod +x .agent/scripts/sync_cursor_kit.sh
./.agent/scripts/sync_cursor_kit.sh
```

Builds `.cursor/` and `.claude/` locally. See [`.agent/IDE_ADAPTERS.md`](.agent/IDE_ADAPTERS.md).

## Contribution flow

1. Open an issue describing the problem or proposal (optional but recommended for large changes).
2. Create a branch from `main`.
3. Make focused changes — avoid mixing broad refactors with features or fixes.
4. Run validation and tests before the PR.
5. Open a pull request with:
   - **What** changed
   - **Why** (problem or goal)
   - **How to test**
   - Screenshots if there is a visual change

## Conventions

- **Commits:** clear messages in Portuguese or English (be consistent within the PR).
- **Documentation:** precedes product code when the change alters protocol or governance.
- **User stories:** only after `05_architecture.md` `approved` and epic/version in folders (see `.agent/MERIDIAN.md`).
- **Decisions:** scope, stack, or architecture changes → prepend in `docs/decisions/YYYY-MM-DD.json`.
- **`.cursor/`:** never commit — it is in `.gitignore`.

## What we do not accept (for now)

- Secrets, tokens, or `.env` with real values.
- Commits of `node_modules/`, `dist/`, or builds.
- Changes that break “documentation before code” without a recorded justification.
- Autonomous automation features without human review (out of Meridian scope).

## Questions

Open an issue with the `question` tag or describe context in the PR.
