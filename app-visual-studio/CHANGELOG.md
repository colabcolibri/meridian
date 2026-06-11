# Changelog

All notable changes to the **Meridian** VS Code extension (`meridian-vscode`).

Format based on [Keep a Changelog](https://keepachangelog.com/).

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
