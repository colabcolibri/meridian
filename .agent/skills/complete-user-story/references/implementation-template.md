# Template — Technical implementation (fill in on completion)

> **US creation:** placeholder or preliminary plan optional.  
> **Closure (`✅`):** replace with real record of what was delivered.

## Placeholder on creation (status `❌`)

```md
## Technical implementation

### Files

_(fill in when implementation is complete)_

### Backend

_(fill in when applicable)_

### Frontend

_(fill in when applicable)_

### Scripts / Docs

_(fill in when applicable)_
```

## Record on completion (status `✅`)

```md
## Technical implementation

### Files

- `src/features/monitor/VersionFilterBar.tsx` — shared filter bar
- `src/context/MonitorVersionFilterContext.tsx` — version state across tabs
- `src/features/monitor/MonitorDashboard.tsx` — provider wiring

### Backend

- _n/a_

### Frontend

- Shared React context across Delivery and Board tabs.
- Selected version persists when switching tabs.
- Default: `active` version; fallback last version with US in folder.

### Scripts / Docs

- _n/a_
```

## Rules

| Rule | Detail |
| ----- | ------- |
| Paths | Relative to app root or repo; include folder |
| One line per file | What changed in that file |
| Empty layers | `_n/a_` — do not omit heading |
| Plan vs delivery | On completion, remove bullets describing unimplemented intent |
| Global decisions | Register in `docs/decisions/YYYY-MM-DD.json`; local US record stays here |
| Git | Optional commit/PR in `## Notes`; US is the readable index |

## Anti-patterns (block `✅`)

- `_(fill in when applicable)_` still present
- Only "No functional change" without listing files when there was a change
- Acceptance `[x]` without match in Technical implementation or Tests
- Generic list without paths ("monitor components updated")
