# Test strategy checklist

> Use with `/test-pass`. Mandatory before Write on `10_test_strategy.md`.

## Preconditions

- [ ] `01_tech_stack.md` drafted
- [ ] `04_principles.md` mentions quality expectations
- [ ] `08_environments.md` names CI when tests run in pipeline

## Pyramid

- [ ] Unit vs integration vs E2E ratio documented
- [ ] What must be unit-tested vs e2e-only stated explicitly
- [ ] Flaky test policy (retry, quarantine) noted if applicable

## Runners

- [ ] Primary unit runner named (Vitest, Jest, pytest, etc.)
- [ ] E2E runner named when UI/API e2e in scope (Playwright, Cypress, etc.)
- [ ] Test stack id from `test-stack-catalog.md` recorded in `10`

## Layout

- [ ] Test folder convention documented (`__tests__`, `tests/`, colocated)
- [ ] Naming convention for files (`*.test.ts`, `test_*.py`)
- [ ] Fixtures/mocks location if non-obvious

## Coverage

- [ ] Coverage tool named if used (c8, istanbul, coverage.py)
- [ ] Minimum threshold or "no gate" decision explicit
- [ ] Exclusions documented (generated code, vendor)

## US alignment

- [ ] Must US with `tests: required` should cite `10_test_strategy` in Plan
- [ ] Manual vs automated steps distinguished in refine

## Gate

- [ ] Human approves `status: approved` on `10` before strict validator nudges
