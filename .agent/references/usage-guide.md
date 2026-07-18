# Usage guide — recipes

> **If you know what you want to do, open this file.** Situation → steps.  
> **Not this file:** layering (workflow/agent/skill) → [how-to-use.md](./how-to-use.md). Concepts → [start-here.md](./start-here.md). Command index → [agents-help.md](./agents-help.md).

Run **`/status`** anytime for blockers and suggested next action.

---

## Where are you?

| Situation | Section |
| --------- | ------- |
| No `docs/` yet (greenfield) | [New project](#new-project) |
| Code exists, no `docs/` | [Brownfield](#brownfield) |
| `docs/` thin or outdated | [Audit docs](#audit-docs) |
| Phase docs incomplete | [Phase documents](#phase-documents) |
| `05` approved, no backlog | [Backlog](#backlog) |
| Ready to code a US | [Implement](#implement) |
| Done coding, not closed | [Close US](#close-us) |
| Several `docs/` trees | [Monorepo](#multiple-meridian-projects) |

---

## New project

```txt
/discover          optional — fuzzy idea
/init-meridian      interview + docs/ 00–08 + bootstrap
/audit-docs        optional — before you approve
```

Approve `00` → `01` → `02` → `03` → `04` → `/architecture` → approve `05` → [Backlog](#backlog).

---

## Brownfield

```txt
/init-meridian       docs/ tree + bootstrap only
/document-project    inventory + phase docs from code (no US/epics for legacy)
/audit-docs          optional
```

Review `docs/inventory/as-is.md` and phase docs. Approve docs. Forward backlog only (`/create-epic` … `/create-us`) — **no retroactive ✅** for shipped work. Optional `v0` version for baseline; archive inventory after `05` approved.

---

## Audit docs

```txt
/audit-docs          report only
/audit-docs apply    draft fixes (still not approved)
```

Works for Meridian-started and brownfield projects. Anytime docs feel thin or drifted from code.

---

## Phase documents

Order:

```txt
00_scope → 01 → 02 → 03 → 04 → 05 (gate) → 06 → 07 → 08
```

Per document:

1. `/status` — what is next
2. One doc per conversation
3. Specialized passes: `/security-pass` (`02`), `/architecture` (`05`), `/design-pass` (`09`)
4. You set `review` then **`approved`** — agent never approves

**Backlog blocked?** Almost always `05_architecture` not `approved`.

Decisions: **`/update-decisions-log`** — prepend JSON; never edit old entries.

---

## Backlog

**Gate:** `05_architecture.md` = `approved`.

```txt
/create-epic → /create-version → /plan-sprint (optional) → /create-us
```

After create: `/review-us` (optional) → **`/refine-us`** → `ready: true` → `/implement-us`.

Bugs = US with fix acceptance. Spikes = US + timebox + decision log. See [scrum-meridian-map.md](./scrum-meridian-map.md).

---

## Implement

1. Pick US with `ready: true` and satisfied `depends_on`
2. **`/implement-us US-XXXX`** — one US per session
3. Review diff and tests
4. Partial → `🔶` + `Missing:` in acceptance; not `/complete-us` yet

---

## Close US

**`/complete-us US-XXXX`** when:

- `depends_on` satisfied
- Acceptance evidenced
- Tests run if `tests: required`

Then **you commit** — one commit per closed US. See [commit-after-us-close.md](./commit-after-us-close.md).

---

## Daily loop

**`/daily-with-ai`** — guided session.

Manual: `/status` → one focus → `/complete-us` → commit.

---

## Multiple Meridian projects

Several folders named **`docs`** with Meridian fingerprint:

- Optional `.meridian/projects.json` at kit root
- Extension toolbar **Project** row — switch active `docs/`
- `/status` lists projects before US work
- Validate: `python3 .agent/scripts/validate_meridian.py <package-folder> --sqlite-only`

Template: `projects-manifest-template.md`.

---

## Validate

```bash
python3 .agent/scripts/validate_meridian.py <project-folder> --sqlite-only
```

Or extension: **Meridian: Validate Project**.

---

## Anti-patterns

- Implement without `ready: true`
- `✅` in chat without `/complete-us`
- US before `05` approved
- Mix doc work + implement in one thread
- `approved` without reading the doc

Full command list: [agents-help.md](./agents-help.md).
