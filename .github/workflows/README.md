# GitHub Actions — Meridian product repository

Workflows in this folder implement CI for the **Meridian monorepo** as its own product: kit (`.agent/`) plus VS Code extension (`app-visual-studio/`).

## Stack → workflows

| Workflow | Languages / scope | Matches `01_tech_stack` |
| -------- | ----------------- | ------------------------ |
| `ci.yml` | Validator + extension `typecheck`, `lint`, `compile`, `test` | Kit Python + extension TS |
| `codeql.yml` | `javascript-typescript`, `python` | Extension + kit scripts |
| `dependabot.yml` | npm @ `app-visual-studio/` | Extension lockfile |
| `pr-review.yml` | PR checklist comment | Process |

## Other Meridian products

Other repos using the kit define CI from their own phase docs:

1. `docs/01_tech_stack.md` — languages and lockfiles  
2. `docs/10_test_strategy.md` — test runners (`/test-pass bootstrap`)  
3. `docs/08_environments.md` — CI/CD table (`/security-pass bootstrap` + `ci-gates-catalog.md`)

Kit reference: `.agent/agents/quality-owner/references/test-strategy/ci-gates-catalog.md`
