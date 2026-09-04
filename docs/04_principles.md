---
title: Code Principles
status: approved
version: 1.0
updated: 2026-06-02
depends_on: [01_tech_stack.md, 02_security.md, 03_user_types.md]
blocks: [05_architecture.md]
---

# 04 — Code Principles

## DRY — where each type of logic lives

- Meridian flow data: modules in `src/domain/meridian`.
- Validation rules: pure functions in `src/domain/meridian/validators`.
- Reusable UI components: `src/components/ui`.
- Product components: `src/features`.
- Status, version, and document constants: single source in TypeScript.

## Single Responsibility

| Layer        | Single responsibility                                            |
| ------------ | ---------------------------------------------------------------- |
| Domain       | Model documents, dependencies, status, and Meridian validations. |
| Feature      | Compose UI and behavior for a product area.                      |
| Component UI | Generic, accessible rendering based on shadcn/ui.                |
| App          | Main layout, navigation, and feature composition.                |

## Definition of Done (Meridian)

Global “done” for any closed user story — in addition to that story’s Acceptance criteria:

- Acceptance criteria evidenced in SQLite US row (`intent_acceptance` checked `[x]` or justified `🔶` + Missing)
- Build/lint/test per this document and the US `tests` / `tests_status` fields
- `## Record` filled with real paths and `### Executed` (commands + results)
- `status: ✅` only via `/complete-us`
- One git commit per closed US (code + delivery change in scope), unless the manager batches intentionally
- Cross-cutting changes logged via `prepend-decision` (`/update-decisions-log`)

Per-story scope stays in US Intent — this section is the team-wide bar. See `.agent/references/scrum/scrum-meridian-map.md`.

## Mandatory conventions

- TypeScript for all application modules.
- React components in PascalCase.
- Utility functions in camelCase.
- Mocked or seeded data with explicit names.
- No Meridian rule should be hidden inside a visual component.
- shadcn/ui components must be added via the official shadcn installer, incrementally, as the interface actually needs them.
- Code must pass ESLint and Prettier before commit.
- Commits must pass the pre-commit hook with lint-staged.
- After `/complete-us` for a US, the manager commits **one git commit per closed US** (code + SQLite delivery update and decisions in scope). Meridian ✅ does not replace this step.
- Commit messages: conventional `type(scope): summary (US-XXXX)` (e.g. `feat(extension): … (US-0085)`). Agents may suggest the line in `### Executed`; they commit only when explicitly asked.
- The project uses `pnpm`; do not version npm or yarn lockfiles.

## Error handling

In the first version, errors will be represented as validations and visual alerts. Because there is no backend, there will be no API envelope.

## Visual pattern

- Operational interface, not a marketing page.
- Cards only for repeated units or well-defined panels.
- Badges for status.
- Tabs to switch views.
- Scroll area for long lists.
- Lucide icons for actions and visual signals.

### Meridian Desktop identity

Tokens in `app-visual-studio` extension UI (CSS variables / Tailwind per `09_design_system.md` when approved). A single source of flow states in the extension monitor setup styles.

| State (flow) | Semantic color     | Usage                                 |
| ------------ | ------------------ | ------------------------------------- |
| Ready        | `meridian-success` | Document approved and dependencies ok |
| In progress  | `meridian` (brand) | Can edit/review now                   |
| Not started  | neutral zinc       | Blocked by dependencies               |
| Attention    | `destructive`      | Protocol inconsistency                |

Phase progress in the accordion ring (`complete/total`). Cards in a compact grid (up to 4 columns): state icon, id, title, click opens reader. Color as tint on the card icon, without side bars or dedicated "read" button. Do not use loose `teal`/`emerald`; extend tokens if a new color is needed.
