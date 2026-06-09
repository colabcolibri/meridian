# Changelog

All notable changes to the **Meridian** VS Code extension (`meridian-vscode`).

Format based on [Keep a Changelog](https://keepachangelog.com/).

## [1.1.0] - 2026-06-09

### Added

- **Bundled kit** — `.agent/` ships inside the VSIX (`bundle-kit.mjs` on package/publish)
- **Meridian: Install Harness** — copies kit into workspace + syncs `.cursor/` / `.claude/` adapters
- **Meridian: Upgrade Harness** — replaces existing `.agent/` with bundled version
- Auto-prompt on first workspace open when kit is missing
- Status bar **Meridian: install harness** when `.agent/` is absent
- `onStartupFinished` activation so the extension runs before kit is installed
- Unit tests for `kit-installer`

### Changed

- **Display name:** Meridian Harness (single product — extension + kit)
- README and MARKETPLACE docs updated for bundled kit workflow
- `package.nls.json` description reflects install-from-extension flow

### Notes

- Open a project folder → **Install Harness** → `/init-meridian` if `docs/` is missing
- Kit tarball on GitHub Releases remains optional for non-extension installs

## [1.0.0] - 2026-06-09

### Added

- Board kanban webview with version/epic filters and per-column pagination
- Planning views: Versions, Sprints, Epics (Deliverables alias)
- Command Help and Agents Help editor tabs
- Sync Board (`board.json` from US frontmatter)
- Validate Project (`validate_meridian.py` integration)
- Workspace detection for monorepo and client layouts
- Brand icon and English `package.nls.json` manifest strings
- Publisher `colabcolibri` with repository and author metadata

### Notes

- Requires the [Meridian kit](https://github.com/colabcolibri/meridian) (`.agent/` + `docs/`) in the workspace — install separately from the kit tarball or repo.

[1.1.0]: https://github.com/colabcolibri/meridian/releases/tag/v1.1.0
[1.0.0]: https://github.com/colabcolibri/meridian/releases/tag/v1.0.0
