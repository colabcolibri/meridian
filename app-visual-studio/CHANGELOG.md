# Changelog

All notable changes to the **Meridian** VS Code extension (`meridian-vscode`).

Format based on [Keep a Changelog](https://keepachangelog.com/).

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
