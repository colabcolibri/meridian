# Commit after US close (Meridian)

> Git snapshot **after** documentation closure — not a substitute for `/complete-us`.

## Position in the flow

```txt
/refine-us → /implement-us → /complete-us → commit (human) → next US
```

| Step | Meridian `status: ✅` | Git |
| ---- | --------------------- | --- |
| `/complete-us` | Yes — Record filled in SQLite | Diff read for evidence only |
| **Commit (human)** | Unchanged | One commit per closed US |

US closure and repository snapshot are **two done signals**. A story can be ✅ in `.meridian/meridian.db` while the working tree is still dirty until the manager commits.

## Who commits

| Actor | Rule |
| ----- | ---- |
| **Human manager** | Default — after reviewing diff and Record |
| **Agent** | Only when the manager explicitly asks (e.g. “commita com esta mensagem”) |

Agents must **not** run `git commit` in the same turn that sets `status: ✅` unless explicitly requested.

## When to commit

- **After** `/complete-us` for that US.
- **Before** starting the next US in the same repo (keeps `git diff` scoped to one slice).
- **Not** during partial work (`🔶`) — no “delivery” commit until close.
- **Not** before `/complete-us` — Record must match what you commit.

## Scope (one US = one commit)

Include every file that US delivery justified:

- Product code touched by the slice
- Kit/protocol changes if the US required them
- `docs/decisions/YYYY-MM-DD.json` only if that US logged a decision

Do **not** commit `.meridian/meridian.db` (gitignored). Team shares delivery via migrations/bootstrap scripts, not the local DB file.

Do **not** mix two US ids in one commit unless the manager explicitly batches.

## Message format

```txt
<type>(<scope>): <short summary> (US-XXXX)
```

| Part | Typical value |
| ---- | ------------- |
| `type` | `feat` · `fix` · `docs` |
| `scope` | package or area name |
| US id | `(US-0085)` in subject or first line of body |

## Preconditions (before `git commit`)

- Lint/build from the US **Planned** / **Executed** passed (project `04_principles.md` + pre-commit hook).
- `git diff` — only files for this US (use `git add -p` if needed).
- `validate_meridian.py . --sqlite-only` clean when phase docs or kit changed.

## Agent on `/complete-us`

After filling `## Record` / `### Executed`, add one line:

```md
- **suggested commit:** `feat(scope): short summary (US-XXXX)`
```

Suggestion only — manager executes commit.

## Link the real commit to the US (optional, recommended)

After the manager runs `git commit`, add under the same `### Executed` via `update-us`:

```md
- **git commit:** `abc1234` — feat(scope): short summary (US-XXXX)
```

| Line | When | Required? |
| ---- | ---- | --------- |
| **suggested commit** | On `/complete-us` | Yes — agent writes it |
| **git commit** | After human (or explicit agent) commit | No — fill when the repo has the SHA |

## Anti-patterns

- ✅ in US without ever committing (audit gap vs git history)
- Commit before Record is filled
- Agent auto-commit on `/complete-us` without explicit request
- One commit at sprint end with many US ids (breaks per-US traceability)
- Committing `meridian.db` to git
