# Changelog

All notable changes to the **Meridian** VS Code extension (`meridian-vscode`).

Format based on [Keep a Changelog](https://keepachangelog.com/).

## [2.1.2] - 2026-09-04

### Changed

- **Upgrade Harness backup:** replaces `.agent.backup-<timestamp>/` at repo root with `agent-backup/harness-<timestamp>.zip` (folder fallback if zip is unavailable). Keeps the 5 most recent backups and adds `agent-backup/` to `.gitignore`.

## [2.1.1] - 2026-09-04

### Fixed

- **Validator:** `validate_meridian.py` adds `.agent/scripts/lib` to `sys.path` before importing `meridian_us_close_quality` — fixes `ModuleNotFoundError` on client projects after upgrade.

## [2.1.0] - 2026-09-04

### Breaking changes (kit v3)

- **Workflows removed:** `.agent/workflows/*.md` deleted — procedures live only in `.agent/skills/{name}/SKILL.md`. Invoke `/us-create`, `/data-engineering`, etc. (not legacy `/create-us`, `/database-pass`).
- **Skills canonical:** all domain procedures moved to `.agent/skills/`; `agents/{slug}/references/{skill}/` are symlinks for template registry compatibility.
- **Entry points:** prefer `/skill-name` or `@agent` in chat; `sync_kit.sh` syncs skills + agents (no `.cursor/commands/`).
- **Upgrade:** **Meridian: Upgrade Harness** → `./.agent/scripts/sync_kit.sh`. See bundled `references/protocol/kit-v3-migration.md`.

### Changed

- Agent `agent.md` frontmatter lists domain + shared skills.
- `validate_kit_parity.py` checks skills/agents parity (not workflow commands).
- Docs: `agents-help`, `station-references`, `meridian.mdc` invoke table updated.

## [2.0.0] - 2026-09-04

### Breaking changes (kit v2)

- **Agent stations:** personas moved to `.agent/agents/{slug}/agent.md` (self-contained folder + `references/`). Flat `.agent/agents/{slug}.md` removed.
- **Skills:** domain skills removed from `.agent/skills/` — only five shared skills remain (`meridian-routing`, `update-decisions-log`, `init-project`, `discover-product`, `create-meridian-artifact`). Pass procedures live under each agent's `references/`.
- **References tree:** `.agent/references/` reorganized into `guides/`, `protocol/`, `agents/`, `scrum/`, `templates/`, `plans/` with `INDEX.md` hub.
- **Template registry:** symlinks now target agent `references/` paths (not removed skills).
- **Upgrade:** install extension 2.0.0 → **Meridian: Upgrade Harness** → `./.agent/scripts/sync_kit.sh`. See bundled `references/protocol/kit-v2-migration.md`.

### Added (since 1.1.x, now in v2 bundle)

- Sixteen-agent roster with pantheon call signs (`agent-personas.md`)
- Agents: `ux-researcher`, `data-engineer`, `devops-engineer`; `/deus-ex` dispatch
- Stack-agnostic passes: `/i18n-pass`, `/a11y-pass`, `/payment-pass`, `/api-pass`, `/perf-pass`, `/seo-pass geo`, `/architecture mcp`
- `offensive-checklist.md` for `/security-review offensive`

### Changed

- Workflows route to `@agent` + explicit `references/` paths (no domain skill invoke)
- `validate_meridian.py --strict-kit-md` errors on domain skills in `.agent/skills/` or flat agent files
- IDE adapters: `.cursor/agents/{slug}.md` symlinks to `agents/{slug}/agent.md`

## [1.1.57] - 2026-09-03

### Added

- **Bundled kit:** stack-agnostic phase passes — `/i18n-pass`, `/a11y-pass`, `/payment-pass`, `/api-pass`, `/perf-pass`
- **Bundled kit:** `/seo-pass geo` (GEO) and `/architecture mcp` (MCP agent-tool contract)
- **Bundled kit:** skills `i18n-localization`, `accessibility`, `payment-integration`, `api-contract`, `performance-budget`, `geo-optimization`, `mcp-integration`
- **Bundled kit:** `offensive-checklist.md` for `/security-review offensive` (checklist-only, no exploits)

### Changed

- **Bundled kit:** `07_api_contracts` owner → `technical-architect`; routing, station map, and agents-help updated (40 skills, 42 workflows)

## [1.1.56] - 2026-09-03

### Added

- **Bundled kit:** sixteen-agent roster — `ux-researcher` (Iris, `/ux-pass`), `data-engineer` (Mnemosyne, `/database-pass`), `devops-engineer` (Vulcan, `/release-pass`)
- **Bundled kit:** Meridian pantheon protocol — mythic call signs for all agents (`agent-personas.md`); announce as `@agent (CallSign)` in chat
- **Bundled kit:** skills `ux-research`, `data-engineering`, `release-ops`; ownership split for `03`, `06`, `08`

### Changed

- **Bundled kit:** `agents-help`, station map, routing, and Cursor slash table include `/ux-pass`, `/database-pass`, `/release-pass`

## [1.1.55] - 2026-09-03

### Changed

- **Harness upgrade prompt:** plain-language copy for unstamped folders (`legacy` in the status bar); changelog bullets stripped to readable text (no raw markdown in notifications); tooltip keeps full notes.

## [1.1.54] - 2026-09-03

### Added

- **Harness version:** Install/Upgrade stamps `.agent/VERSION`. Status bar shows `harness A → B` when the folder kit is behind the extension. One prompt per bundled version (Later dismisses that bump). The Meridian kit repo is not prompted.

## [1.1.53] - 2026-09-03

### Added

- **Bundled kit:** `deus-ex` dispatch station (`/deus-ex`) — allocates next agent/slash, does not cook
- **Bundled kit:** `/design-flow` and `/design-theme` — screen journeys, responsive surfaces, theme modes, type ramp
- **Bundled kit:** sprint/epic close integrity — CLI rejects empty retrospective or incomplete Must US

### Changed

- **Bundled kit:** maker/checker stations, object-prefix skills, container-integrity validator WARNs on historical closes

## [1.1.52] - 2026-08-24

### Fixed

- **Bundled kit:** OpenCode adapter — `sync_kit.sh` generates agents with `permission:` frontmatter instead of Cursor `tools:` strings (fixes `ConfigInvalidError` on OpenCode startup)

## [1.1.51] - 2026-08-24

### Added

- **Bundled kit:** meridian-views opencode plugin — visual kanban (VSCode board columns/mapping), versions/sprints/epics/decisions pages served on 127.0.0.1:4788; auto-starts with opencode, read-only, dies with the process; `meridian_board` tool returns the URL

## [1.1.50] - 2026-08-24

### Added

- **Remove harness command** (`meridian.uninstallKit`): Kit setup gains a Remove harness entry — runs `uninstall-meridian-kit.sh` with scope choice (adapters only / full removal); `docs/` and `.meridian/` delivery SQLite are never deleted

## [1.1.49] - 2026-08-24

### Added

- **Bundled kit:** `uninstall-meridian-kit.sh` — removes Meridian adapters (and optionally `.agent/` + gitignore entries) with the same surgical policy; never touches `docs/` or `.meridian/`

## [1.1.48] - 2026-08-24

### Added

- **OpenCode adapter:** bundled kit now ships `sync_kit.sh` — one command generates ALL IDE adapters (Cursor, Claude Code, Codex, OpenCode); installs create `.opencode/` with slash commands, agents, skills, and a delivery plugin (`meridian-tools.ts`: counts/list/show/validate)

### Changed

- **Bundled kit:** `sync_cursor_kit.sh` is now a deprecated shim forwarding to `sync_kit.sh`; kit installer prefers the canonical generator (falls back to shim for older kits); gitignore templates cover `.opencode/`

## [1.1.47] - 2026-08-12

### Changed

- **Bundled kit:** P0 + agents — frontmatter keys (`sprint`, `version`, `epic`) are not SQL columns (`sprint_id`, `version_id`, `epic_id`); prefer `meridian_delivery.py` over invented SELECT

## [1.1.46] - 2026-08-06

### Changed

- **Bundled kit:** `close-us-contract.md` — `/complete-us` is additive only; agents must not copy `us-template.md` on close; INDEX/TEMPLATE_SOURCES routing fixed (US-0186)

## [1.1.45] - 2026-08-05

### Changed

- **Bundled kit:** `patch-record` CLI merges `## Record` on `/complete-us` without replacing Intent/Plan; close-quality gates block batch-close boilerplate; agent skills and P0 rules forbid delivery helper `.py` scripts (US-0185)

## [1.1.44] - 2026-07-28

### Added

- **Multi-product manifest:** `qualitySiege` field on `projects.json` entries (`kit` | `standard` | `full`) — parsed with project resolution for future UI and kit alignment

## [1.1.43] - 2026-07-28

### Fixed

- **Import graph:** JSONC parser no longer treats glob patterns like `**/*.ts` in `tsconfig` `include` as block comments (fixes parse errors on Expo/React Native projects)
- **Delivery graph:** more distinct status colors — open (orange), done (green), frozen (blue); explicit `--fg-open` token

## [1.1.42] - 2026-07-28

### Fixed

- **Multi-product monorepos:** kit scripts resolve by walking up from the active project `packageRoot` (`.meridian/`) to the shared `.agent/scripts` at repo root — fixes deliver, board, decisions, and SQLite export when each app has its own `.meridian/meridian.db`
- **Import graph:** uses active `packageRoot` for script resolution and scan scope (was using kit root for scripts)

## [1.1.41] - 2026-07-27

### Changed

- **README:** value-focused copy for Marketplace and repo — extension vs kit/CLI, who it is for, what you get
- **Delivery graph:** distinct node colors for frozen (cyan) and deprecated (rose); status legend on canvas

## [1.1.40] - 2026-07-27

### Added

- **Import graph:** force-directed canvas viewer (pan/zoom/drag) with colors by file type and legend
- **Delivery graph:** force-directed layout with lateral filter sheet (version, sprint, epic)
- **Import graph CLI:** tsconfig/jsconfig path alias resolution (`@/…`), dynamic `import()`, Python relative imports, and `index` resolution

### Changed

- **Graph viewers:** replaced Mermaid + node list with canvas physics; spatial-grid repulsion and viewport culling for large graphs
- **Import graph:** automatic scope from active package root (no folder picker); stronger spacing to reduce hub hairballs

### Fixed

- **Delivery graph:** filter chip and replot on filter change; layout no longer seeds dependency chains in a line
- **Import graph:** missing edges for extensionless paths, `import()`, and path aliases

## [1.1.39] - 2026-07-24

### Added

- **Architecture diagrams:** collapsible sidebar with diagram list grouped by kind (Runtime, Database, …); toolbar **Diagrams** toggle; persisted sidebar and active diagram state

### Fixed

- **Architecture diagrams:** pan drag no longer selects Mermaid label text (`user-select`, `selectstart`, pointer capture)

## [1.1.38] - 2026-07-24

### Added

- **Architecture diagrams:** command **Meridian: Open Architecture Diagram** — Mermaid maps from `docs/architecture/diagrams/*.{md,mmd}` with multi-file picker, pan/zoom, and Meridian theme (`meridian-mermaid`)
- **Kit:** skill `generate-architecture-diagram` and `/architecture` workflow updates for runtime, database ER, and multi-file diagram inventory

### Changed

- **Bundled kit:** architecture diagram authoring and `05` index guidance synced with extension viewer

## [1.1.37] - 2026-07-22

### Changed

- **Board filters:** checkbox lists per dimension; independent version/sprint/epic sets (intersection only on the kanban)

### Fixed

- **Board filters:** version chip toggle when all selected; removed auto-prune that cleared epic/sprint; filter state version 14 reset

## [1.1.36] - 2026-07-22

### Added

- **Board:** filter sidebar (version, sprint, epic) with All/None, cross-filtering, **Resetar**, and persisted filter state

### Fixed

- **Board:** filter None/All visual state; independent dimension clears; full version list always visible; sprint badge contrast (`badge-foreground` / `badge-background`)

## [1.1.35] - 2026-07-22

### Fixed

- **US viewer:** sprint badge and form field reflect `sprint_id` from SQLite even when `body_markdown` frontmatter lacks `sprint:`
- **Board:** dedicated sprint chip on kanban cards (planning export `sprint` field)
- **US form:** sprint dropdown filtered by US version; sprint labels show version

## [1.1.34] - 2026-07-22

### Added

- **Bundled kit:** US-centric sprint assignment — `user_stories.sprint_id`, frontmatter `sprint:`, migration + `reconcile_sprint_links` on bootstrap; one sprint per US
- **Upgrade harness:** runs `bootstrap_meridian_db.py` after kit copy (migrations + sprint link reconcile)
- **Board / US form:** planning export and cards show sprint when allocated

### Changed

- **Bundled kit:** `ready: true`, `set-ready`, and `/implement-us` require US on a `planned`/`active` sprint (same version); docs and checklists updated (`06_database` v3.3)

## [1.1.33] - 2026-07-21

### Changed

- **Bundled kit:** US must belong to a planned or active sprint before `ready: true` or `/implement-us` — `implement-gate`, `update-us`, and `set-ready` enforce sprint scope; docs and checklists aligned

## [1.1.32] - 2026-07-21

### Fixed

- **Sprints:** user stories listed again when loading planning data from SQLite (`storyIds` mapping)

## [1.1.31] - 2026-07-21

### Changed

- **Board:** cards within each column sort by US id descending (newest first, e.g. US-0159 before US-0158)
- **Bundled kit:** decision log governance — US Plan cites SQLite log as `YYYY-MM-DD — title`; refine/complete/audit checklists (US-0160)

## [1.1.30] - 2026-07-20

### Fixed

- **Board:** Show/Hide toggle labels now update on click (toolbar was not re-rendered)

## [1.1.29] - 2026-07-20

### Changed

- **Board:** frozen / deprecated / narrative toggles use Show↔Hide labels and clearer active (`on`) state

## [1.1.28] - 2026-07-20

### Changed

- **Board:** 📋 Backlog and 📌 Todo columns derived from `ready` + `status: ❌`; **🚫 Deprecated** status and toggle; column header icons; `BOARD_STATE_VERSION` 12 (US-0159)
- **Bundled kit:** protocol docs for board vs frontmatter (`MERIDIAN.md`, artifact reference, backlog-refiner, skills)

## [1.1.27] - 2026-07-19

### Added

- **Open Decisions** — read-only editor tab listing the SQLite decision log by date (US-0158)
- `meridian_db_export.py --format decisions` for structured export

## [1.1.25] - 2026-07-19

### Changed

- **Bundled kit:** US persist docs — `update-us` via **stdin/heredoc** (direct SQLite upsert); removed `/tmp/us.md` staging guidance

## [1.1.24] - 2026-07-19

### Changed

- **Bundled kit:** explicit **Forbidden** rule — US “draft” = `ready: false` in SQLite only; no `.meridian/drafts/`, `us-*-refine.md`, or `docs/us/*.md` (protocol failure)
- **Bundled kit:** `create-us`, `create-user-story`, `refine-user-story`, `us-template`, `start-here`, P0 rules updated

## [1.1.23] - 2026-07-18

### Added

- **Bundled kit:** HAR (ação humana necessária) P0 — agents stop for OAuth, billing, production creds
- **Bundled kit:** `/privacy-pass` with LGPD (Brazil / ANPD) and GDPR (EU / EDPB) checklists and official reference URLs
- **Bundled kit:** optional `/seo-pass` + `12_marketing_seo` phase doc for public web products
- **Bundled kit:** privacy validator warnings + `test_privacy_validator.py`

### Changed

- **Bundled kit:** `02_security` and `08_environments` deepened (privacy sections, deploy/rollback/HAR)
- **Bundled kit:** `agents-help`, `start-here`, routing updated for EPIC-18 operators

## [1.1.22] - 2026-07-18

### Added

- **Bundled kit:** quality operator — `quality-owner` agent, `/test-pass`, `/test-review`, `10_test_strategy` phase doc template
- **Bundled kit:** security operator — `/security-review`, `/dependency-audit`, security bootstrap and implementation checklists
- **Bundled kit:** phase-docs `00`–`11` + `docs-readme` — agent guides (what/how/when/revisit), depth checklists, mid-project review procedure; single source for init and `/audit-docs`

### Changed

- **Bundled kit:** removed legacy agents (`board-keeper`, `process-manager`, `security-steward`, `architecture-guardian`, `documentation-strategist`, `scope-architect`); routing and `agents-help` updated
- **Bundled kit:** `validate_meridian.py` warnings for thin `02_security` / `10_test_strategy`; init copies stubs only from `phase-docs/`

## [1.1.21] - 2026-07-18

### Added

- **Bundled kit:** design system operator — `/design-pass` (bootstrap/US modes), `/design-showcase`, `/design-review`
- **Bundled kit:** stack implementation references (`stacks/*` for shadcn, MUI, Chakra, antd, Streamlit, NiceGUI, Django HTMX, Go templ, Leptos)
- **Bundled kit:** composed `App*` pattern, showcase US slices, validator warning when Must UI US omit `09_design_system` refs

## [1.1.20] - 2026-07-18

### Added

- **Board:** optional **Show narrative** toolbar toggle — compact As / I want / so that line on kanban cards (off by default)
- **Planning export:** `preamble` on user stories (SQLite upsert + fallback from `body_markdown`)

## [1.1.19] - 2026-07-18

### Changed

- **Bundled kit:** sync with `6533d2a` — v11 SQLite-only delivery (US, epics, versions, sprints, decisions)
- **Bundled kit:** `prepend-decision` / `list decisions` / `show-decisions` CLI; `update-epic`, `update-version`, `update-sprint`
- **Bundled kit:** removed `/sync-board`, `generate-board-json`, and markdown delivery write paths from operational skills/workflows
- **Bundled kit:** `validate_meridian.py --sqlite-only` and `--strict-kit-md` for drift detection

## [1.1.18] - 2026-07-18

### Changed

- **Bundled kit:** sync with `de42f27` — specialized agents, `generate-board-json`, `sync-board`, section contracts
- **Bundled kit:** `validate_meridian.py` SQLite dogfood fix (`sqlite_delivery_active` skips markdown delivery dirs)
- **Bundled kit:** adds `meridian_section_contracts.py` and `migrate_us_v2_structure.py`

## [1.1.17] - 2026-07-18

### Added

- **`publish:marketplace:env`** — reads `VSCE_PAT` from local `.env` (gitignored) for Marketplace publish

### Changed

- **Bundled kit:** refreshed from monorepo `.agent/`
- **Packaging:** `.env` excluded from VSIX via `.vscodeignore`

## [1.1.16] - 2026-06-11

### Added

- **Bundled kit:** `architecture-folder-guide.md` — optional `docs/architecture/` detail indexed from `05_architecture.md`
- **Bundled kit:** `code-quality-at-us-time.md` — DRY and single responsibility gates at create, refine, and implement

### Changed

- **Bundled kit:** `/architecture`, `/create-us`, `/refine-us`, `/implement-us` aligned with new guides; refine/implement checklists extended; monitor concepts updated

## [1.1.15] - 2026-06-11

### Added

- **Bundled kit:** `/implement-us` workflow + `implement-user-story` skill — hard gate before product code (`ready: true` required)

### Changed

- **Bundled kit:** validator errors on open US with `ready != true`; `board.json` exports `ready` field

## [1.1.14] - 2026-06-11

### Changed

- **Bundled kit:** P0 decision log clock (`date` commands); workflows `/update-decisions-log` and `/complete-sprint`; routing and agent-help alignment; `start-here` decision schema fix

## [1.1.13] - 2026-06-11

### Added

- **How to use** help tab — onboarding: extension vs chat, workflow vs agent vs skill, reading order
- **Start here** and **Usage guide** editor tabs — same webview pattern as Agents Help (kit `.agent/references/`)
- Sidebar **Commands** tree grouped: Guides, Views, Governance, Kit setup

### Changed

- Command Help renamed to **Meridian: How to Use**; guides section lists four docs in order
- Kit references: `usage-guide.md` gains VS Code extension section; `agents-help.md` group count fix

## [1.1.12] - 2026-06-10

### Changed

- **Sprints, Versions, and Epics webviews** — accordion blocks with expandable detail (goal/outcome, progress, linked US list)
- **Sprints** — lists `stories:` from frontmatter in sprint order; tap US opens `docs/us/`
- **Versions** — expanded body shows outcome, sprint links, and epics with progress in that release
- **Epics** — accordion replaces flat rows; expanded body shows outcome, versions, and scoped US list

### Fixed

- Planning webviews showed blank lists — JavaScript syntax error in embedded helper script (`docs/us/` string quote typo)

## [1.1.11] - 2026-06-09

### Changed

- **Bundled kit docs:** multi-product + project context strip parity across `usage-guide`, `start-here`, `agents-help`, `projects-manifest-template`, `instruction-surfaces` (EPIC-13 checklist)
- **Command Help:** Board and Deliverables entries document Project toolbar row and persisted active project
- Desktop Learn tab (`meridian-concepts.ts`) — Multiple Meridian projects section

## [1.1.10] - 2026-06-09

### Added

- **Project context strip** in Board, Versions, Sprints, and Epics — active name, `docs/` path, US count
- **Dropdown** in toolbar when multiple projects — switch persists and refreshes all open Meridian tabs
- Tab titles: `Board — App OSC (42)` or `Board — app-desktop/docs (42)` for single nested `docs/`

### Changed

- `switchActiveMeridianProjectById` shared by status bar, command, and webview dropdown

## [1.1.9] - 2026-06-09

### Added

- **Multi-product repos:** discovery of every Meridian `docs/` folder + optional `.meridian/projects.json` manifest
- **Meridian: Select Active Project** — picker when the repo has more than one product; status bar shows active name
- Setting `meridian.activeProject` to pin the active project id
- Validate runs against the active product `packageRoot`, not only the monorepo root

### Changed

- Bundled kit: `projects-manifest-template.md`, usage-guide and init-project guidance for monorepos
- Dogfood: US-0101, EPIC-13, v2.03 closed

## [1.1.8] - 2026-06-09

### Fixed

- Commands sidebar: Install Harness and Upgrade Harness no longer listed twice

## [1.1.7] - 2026-06-09

### Changed

- Bundled kit: **as-is inventory** (`docs/inventory/as-is.md`) for Mode B migration of existing codebases
- Bundled kit: **instruction-surfaces** maintainer map — where to edit when the protocol changes
- README: maintainers section (kit refs vs `command-catalog.ts`)

## [1.1.6] - 2026-06-10

### Changed

- README: intro sections (what Meridian is, what you get, the loop) before install steps

## [1.1.4] - 2026-06-10

### Changed

- README: single Marketplace install path — no VSIX/tarball fallbacks; clear step-by-step use guide

## [1.1.3] - 2026-06-10

### Changed

- **No auto-install:** removed startup prompt; kit installs only when the user runs **Meridian: Install Harness**
- README and command help updated (manual install only)

## [1.1.2] - 2026-06-10

### Changed

- Marketplace categories: **AI** + **Visualization**
- Author **S. Luciano** (GitHub colabcolibri)

## [1.1.1] - 2026-06-10

### Changed

- README and DISTRIBUTION: plugin-first install flow (Install Harness in extension, not tarball/terminal)
- Marketplace keywords reduced to 10 (listing validation limit)
- GitHub links for [colabcolibri/meridian](https://github.com/colabcolibri/meridian) and [colabcolibri](https://github.com/colabcolibri) in README
- Removed full legal name from manifest — author **S. Luciano**, publisher **colabcolibri**
- Marketplace categories: **AI** + **Visualization**

## [1.1.0] - 2026-06-09

### Added

- **Bundled kit** — `.agent/` ships inside the VSIX
- **Meridian: Install Harness** — copies kit + syncs `.cursor/` / `.claude/` from the extension (no terminal)
- **Meridian: Upgrade Harness** — replace `.agent/` + re-sync adapters
- Auto-prompt and status bar when kit is missing
- `onStartupFinished` activation

### Changed

- Single product: extension + kit; README and DISTRIBUTION rewritten for plugin-first install
- Marketplace keywords trimmed to 10 (Marketplace limit)

### Notes

- End users: Extensions → **Install Harness** → `/init-meridian` if needed
- Kit tarball remains optional for CI / advanced users

## [1.0.0] - 2026-06-09

### Added

- Board kanban webview with version/epic filters and per-column pagination
- Planning views: Versions, Sprints, Epics (Deliverables alias)
- Command Help and Agents Help editor tabs
- Sync Board (`board.json` from US frontmatter)
- Validate Project (`validate_meridian.py` integration)
- Workspace detection for monorepo and client layouts
- Brand icon and English `package.nls.json` manifest strings
- Publisher `colabcolibri` with repository metadata

### Notes

- Requires the [Meridian kit](https://github.com/colabcolibri/meridian) (`.agent/` + `docs/`) in the workspace — install separately from the kit tarball or repo.

[1.1.4]: https://github.com/colabcolibri/meridian/releases/tag/v1.1.4
[1.1.3]: https://github.com/colabcolibri/meridian/releases/tag/v1.1.3
[1.1.2]: https://github.com/colabcolibri/meridian/releases/tag/v1.1.2
[1.1.1]: https://github.com/colabcolibri/meridian/releases/tag/v1.1.1
[1.1.0]: https://github.com/colabcolibri/meridian/releases/tag/v1.1.0
[1.0.0]: https://github.com/colabcolibri/meridian/releases/tag/v1.0.0
