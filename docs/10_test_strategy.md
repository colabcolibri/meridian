---
title: Test strategy
status: approved
version: 1.0
updated: 2026-07-28
depends_on: [01_tech_stack.md, 04_principles.md, 08_environments.md]
blocks: []
---

# 10 — Test strategy

## Overview

This repository is the Meridian **product** (kit + VS Code extension). It runs two test stacks in one monorepo:

- **TypeScript** — `node:test` + `tsx` in `app-visual-studio/`
- **Python** — stdlib scripts in `.agent/scripts/test/`

- **Test stack id:** `ts-node-test-py-stdlib`
- **Quality profile:** `qualitySiege: full` (`.meridian/projects.json`) — gates capped per `.agent/references/agentic-quality-model.md`
- **CI:** `.github/workflows/` — mapped in `.github/workflows/README.md` and `docs/08_environments.md` § CI/CD
- **Other Meridian products:** pick stack id from `test-stack-catalog.md` and CI from `ci-gates-catalog.md` via `/test-pass bootstrap` and `/security-pass bootstrap`

## Pyramid

| Level | Scope | Target % of tests | Notes |
| ----- | ----- | ----------------- | ----- |
| Unit | Pure TS helpers, kit validators, CLI parsing | ~70% | Default layer for new logic |
| Integration | SQLite bootstrap, temp workspace, kit install | ~25% | Uses temp dirs; no remote services |
| Contract | Planning export JSON shape (v15-S2) | ~5% | US-0175 |
| E2E | Extension host / webview flows | 0% (v15) | Deferred — harness cost |

**Rule:** Do not push critical paths to e2e-only coverage. Prefer contract tests for stable CLI/export boundaries.

## Runners

| Layer | Tool | Config path |
| ----- | ---- | ----------- |
| Unit (extension) | Node.js `node:test` + `tsx` | `app-visual-studio/package.json` → `pnpm test` |
| Typecheck (extension) | TypeScript `tsc --noEmit` | `app-visual-studio/tsconfig.json` |
| Lint (extension) | ESLint 9 flat config | `app-visual-studio/eslint.config.mjs` |
| Build (extension) | esbuild | `app-visual-studio/esbuild.mjs` |
| Unit / integration (kit) | Python scripts + unittest classes | `.agent/scripts/test/test_*.py` |
| Kit test aggregator | `run_kit_tests.py` | `.agent/scripts/run_kit_tests.py` |
| Governance | `validate_meridian.py` | `.agent/scripts/validate_meridian.py` |

### Commands (local)

```bash
# Kit — full Python suite
python3 .agent/scripts/run_kit_tests.py
python3 .agent/scripts/validate_meridian.py . --sqlite-only --strict-kit-md

# Extension
cd app-visual-studio
pnpm typecheck
pnpm compile
pnpm lint
pnpm test
```

## Layout

```txt
app-visual-studio/
  src/**/*.ts          # extension source (typechecked)
  test/**/*.test.ts    # node:test suites (tsx loader)

.agent/scripts/
  test/test_*.py       # kit tests (stdlib)
  run_kit_tests.py     # CI/local aggregator
  test_*.py            # legacy shims (delegate to test/)
```

Naming: `*.test.ts` for extension; `test_*.py` for kit.

## Coverage

- **Tool (extension):** `c8` via `pnpm test:coverage` (advisory in CI, `continue-on-error: true`)
- **Tool (kit):** advisory only in v15; no coverage.py gate yet
- **Threshold:** **advisory only** in v15 — no blocking merge on percentage
- **Mutation pilot:** `pnpm test:mutation` (Stryker) on `resolve-meridian-projects.ts`, `graph-runtime/render.ts` — baseline recorded when US-0177 closes
- **Exclusions:** `dist/`, `node_modules/`, `coverage/`, bundled kit in VSIX

## US conventions

- Must US with `tests: required` cite this doc in Plan § Architecture refs
- **Planned** steps name exact commands; **Executed** in Record lists evidence before `/complete-us`
- Tests anchor on acceptance criteria and contracts — avoid mirroring implementation internals
- `tests_status: done` before `status: ✅`

## Manual testing

| When | Checklist |
| ---- | --------- |
| Extension UI change | F5 → Extension Development Host → exercise affected command/view |
| Kit workflow change | Run affected slash workflow on dogfood repo; `validate_meridian.py` clean |
| CI change | Open PR; confirm all jobs green |

Pre-commit runs governance validator only (not full test suite) — see `08_environments.md` § Git hooks.
