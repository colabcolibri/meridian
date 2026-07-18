# Template — Record (fill in on completion)

> **v11 delivery:** the `## Record` block lives **inside** `user_stories.body_markdown` in SQLite. On `/complete-us`, update via `meridian_delivery.py update-us` or `--write-form` — not a separate `.md` file.
>
> **US creation:** placeholders under `## Record`.  
> **Closure (`✅`):** replace with real record of what was delivered.

## Placeholder on creation (status `❌`)

```md
## Record

### Files

_(fill on close)_

### Backend

_(fill on close or _n/a_)_

### Frontend

_(fill on close or _n/a_)_

### Scripts / Docs

_(fill on close or _n/a_)_

### Executed

_(pending until close)_
```

## Record on completion (status `✅`)

```md
## Record

### Files

- `app-visual-studio/src/webviews/board/VersionFilterBar.tsx` — shared filter bar
- `app-visual-studio/src/context/VersionFilterContext.tsx` — version state across webviews
- `app-visual-studio/src/webviews/board/BoardView.tsx` — provider wiring

### Backend

- _n/a_

### Frontend

- Shared React context across Board and Epics webviews.
- Selected version persists when switching views.
- Default: `active` version; fallback last version with US in sprint scope.

### Scripts / Docs

- _n/a_

### Executed

- `pnpm build` — passed
- manual — filter persists across tabs
- **suggested commit:** `feat(extension): short summary (US-XXXX)` _(or `feat(kit):` / product scope)_
- **git commit:** `abc1234` — feat(extension): short summary (US-XXXX) _(add after manager commits; omit until then)_
```

## Rules

| Rule | Detail |
| ----- | ------- |
| Paths | Relative to app root or repo; include folder |
| One line per file | What changed in that file |
| Empty layers | `_n/a_` — do not omit heading |
| Plan vs delivery | On completion, remove bullets describing unimplemented intent |
| Global decisions | Register in `docs/decisions/YYYY-MM-DD.json`; local US record stays here |
| Git | US ✅ = row updated in SQLite; **commit is human after** `/complete-us` — see `commit-after-us-close.md`. On close: **suggested commit** in `### Executed`. After commit: optional **git commit** line with SHA + subject |

**Persist:** `meridian_delivery.py update-us US-XXXX --from-file` or `meridian_db_export.py --write-form` — see skill `complete-user-story` § CLI.

## Anti-patterns (block `✅`)

- `_(fill on close)_` still present
- Only "No functional change" without listing files when there was a change
- Acceptance `[x]` without match in Record or Executed
- Generic list without paths ("monitor components updated")
