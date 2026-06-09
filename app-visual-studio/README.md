# Meridian — installable VS Code extension (`app-visual-studio`)

**Product:** an extension you **install** (`.vsix` from [GitHub Releases](https://github.com/colabcolibri/meridian/releases) or `pnpm install:cursor` from a clone) — not a repo-only tool. When your workspace has Meridian (`docs/` + `.agent/MERIDIAN.md`), you get a **sidebar** with Board (kanban), planning views, and kit help — all read from disk.

**Requires the kit:** copy or install `.agent/` in the project first ([kit tarball](https://github.com/colabcolibri/meridian/blob/main/.agent/DISTRIBUTION.md)). The extension does not ship agents or slash commands.

**Publisher:** `colabcolibri` · **Author:** [Sergio Luciano Jr](https://github.com/colabcolibri) · **Repository:** [colabcolibri/meridian](https://github.com/colabcolibri/meridian)

**Not the goal:** replacing Cursor agents or slash commands that maintain `docs/us/` and `board.json`.

**Dev:** this folder is source; end users install the packaged extension unless they contribute. **Ship:** `pnpm package:vsix` → publish or install `.vsix`.

The browser monitor in `app-desktop/` remains optional/demo.

## Prerequisites

- Node.js 18+
- [pnpm](https://pnpm.io/)
- VS Code or Cursor

## Setup (contributors)

```bash
cd app-visual-studio
pnpm install
pnpm compile
```

## Use in your current window (recommended)

**F5 always opens a second window** — that flow is for *developing* the extension, not daily use.

To use Meridian **in the same Cursor/VS Code window** where you already opened the `meridian/` repo:

```bash
cd app-visual-studio
pnpm install:cursor
```

The script finds the Cursor CLI on `PATH`, or falls back to default app paths (e.g. `/Applications/Cursor.app/...` on macOS). You do not need *Shell Command: Install 'cursor' command in PATH* first, but it helps on non-standard setups.

Then in Cursor: **Cmd+Shift+P** (Mac) or **Ctrl+Shift+P** (Windows/Linux) → **Developer: Reload Window**.

After reload:

1. Stay in the **same window** with the monorepo (`meridian/` or `app-desktop/`).
2. **Cmd+Shift+P** → **Meridian: Open Board** or **Meridian: Open Deliverables** — editor tabs.
   - **Board:** version and epic filters with **All / None** + multi-select chips; frozen toggle.
   - **Deliverables (Versions):** version filter with **All / None** + chips; accordion per release (▶/▼); click an id to open the `.md` file.
3. Activity bar **Meridian → Commands** — same actions + **Validate Project**.

**Alternative (UI):** Extensions → `⋯` → **Install from VSIX…** → pick `meridian-vscode-*.vsix`.

Download the VSIX from [GitHub Releases](https://github.com/colabcolibri/meridian/releases) if you do not clone this repo. Build locally: `pnpm package:vsix`.

To reinstall after code changes: run `pnpm install:cursor` again and reload the window.

## Develop the extension (F5 — extra window, maintainers only)

### Option A — monorepo root (recommended if you use Cursor on `meridian/`)

1. Open **`meridian.code-workspace`** (double-click in Finder) or **File → Open Workspace from File…**.
2. In the Run and Debug sidebar, choose **Run Meridian extension** (not a generic Node config).
3. Press **F5**. A second window opens (`[Extension Development Host]`) with **`app-desktop/`** already open (configured in `launch.json`).
4. Status bar should show **`Meridian (N)`**; Command Palette → **Meridian: Open Board**.

If the host window is empty, use **File → Open Folder…** → `app-desktop/` (fixes Cursor `NoWorkspaceUriError` in the log).

### Option B — extension folder only

1. **File → Open Folder…** → `app-visual-studio/` (not the whole repo).
2. Run and Debug → **Run Extension** → **F5**.
3. In the new window, open `app-desktop/` (or your project with `.agent/` + `docs/`).

### NPM task detection: failed to parse `package.json`

The extension `package.json` is a **VS Code manifest** (fields like `contributes`, `activationEvents`), not a plain Node app. Cursor/VS Code npm auto-detect fails on it — harmless. This repo sets `"npm.autoDetect": "off"` in `.vscode/settings.json`. Use **`pnpm compile`** or the **compile** shell task for F5.

### F5 “does nothing” or fails

| Cause | Fix |
| ----- | --- |
| Repo root open, no debug config | Use **`meridian.code-workspace`** or root `.vscode/launch.json` → **Run Meridian extension** |
| Wrong debug target selected | Sidebar **Run and Debug** → dropdown must be extension config, not “Node” |
| `preLaunchTask` failed | Terminal: `cd app-visual-studio && pnpm install && pnpm compile` |
| No second window | Check **View → Output** → **Log (Extension Host)** for errors |
| Cursor | Same steps; Extension Development Host is available (Cursor builds on VS Code) |

Manual compile before F5:

```bash
cd app-visual-studio && pnpm compile
```

## Scripts

| Script | Purpose |
| ------ | ------- |
| `pnpm compile` | Bundle `src/extension.ts` → `dist/extension.js` |
| `pnpm watch` / `pnpm dev` | Rebuild on file changes |
| `pnpm build` | Same as `compile` |
| `pnpm test` | Unit tests + compile smoke |
| `pnpm package:vsix` | Build installable `.vsix` |
| `pnpm install:cursor` | Install/reinstall `.vsix` into local Cursor |
| `pnpm install:vscode` | Install/reinstall `.vsix` into local VS Code |

## Where to run commands

| Place | What |
| ----- | ---- |
| **Commands → Command help** or **View → Meridian → Open Command Help** | Reference tab for every extension command |
| **Commands → Agents & commands** or **Meridian: Open Agents Help** | Webview tab — kit manual (agents, slash commands, steps) |
| **Activity bar → Meridian → Commands** | List of actions (click = run + **Output**) |
| **Menu View → Meridian** | Same commands |
| **Command Palette** | `Meridian: …` (⇧⌘P / Ctrl+Shift+P) |

### Output channels

| Command | Output channel |
| ------- | -------------- |
| Validate project | **Meridian Validate** (full `validate_meridian.py` log) |
| Workspace status / Sync board / New US | **Meridian Tools** |

### Board (kanban)

- **Commands → Open Board** or **View → Meridian → Open Board**
- Opens an **editor tab** `Meridian Board` (not inside the Commands tree)
- Click a card → US file opens beside the board

## Activation

The extension activates when the workspace contains `.agent/MERIDIAN.md` (`workspaceContains` in `package.json`), or when you open the Meridian view or run a Meridian command.

## Workspace detection (US-0042)

On activate, the extension resolves the Meridian project:

| Layout | `projectRoot` | `docs/` |
| ------ | ------------- | ------- |
| Client repo | workspace root | `{root}/docs/` |
| Nested app (e.g. `app-desktop/`) | parent with `.agent/` | `{workspace}/docs/` |

Rules match `validate_meridian.py` (`.agent/MERIDIAN.md`). Status bar shows **Meridian** with US count when `docs/` exists; commands stay disabled until kit + `docs/` are valid.

## Commands (v4 — shipped)

| Command ID | Title | Status |
| ---------- | ----- | ------ |
| `meridian.openBoard` | Meridian: Open Board | ✅ Kanban + filters |
| `meridian.openVersions` | Meridian: Open Versions | ✅ All releases |
| `meridian.openSprints` | Meridian: Open Sprints | ✅ Filter by version |
| `meridian.openEpics` | Meridian: Open Epics | ✅ Filter version + epic |
| `meridian.openDeliverables` | Meridian: Open Deliverables | ✅ Alias → Versions |
| `meridian.syncBoard` | Meridian: Sync Board | ✅ Writes `board.json` |
| `meridian.openHelp` | Meridian: Open Command Help | ✅ Reference tab |
| `meridian.openAgentsHelp` | Meridian: Open Agents Help | ✅ Agents help webview |
| `meridian.validateProject` | Meridian: Validate Project | ✅ Runs `validate_meridian.py` |
| `meridian.showStatus` | Meridian: Show Workspace Status | ✅ Output |
| `meridian.newUserStory` | Meridian: New User Story | Stub — use `/create-us` (v5) |

All user-facing extension UI strings and help content are **English**.

### Display language (Cursor / VS Code)

Meridian strings (command titles, sidebar, webviews, notifications) are **English** via `package.nls.json`.

If the **Extensions** detail page shows section headers in Portuguese — e.g. **Comandos**, **Título**, **Atalhos de Teclado** — that is **editor chrome**, not the extension. Those labels follow your Cursor **display language** (`pt-BR`). The command titles in the table remain `Meridian: Open Board`, etc.

To switch editor UI to English: Command Palette → **Configure Display Language** → `en` → restart.

## Icons

| File | Use |
| ---- | --- |
| `media/meridian.svg` | Activity bar (monochrome, theme-tinted) |
| `media/meridian-mark.svg` | Editor tab icon (brand mark, matches monitor favicon) |
| `media/icon.png` | Marketplace / VSIX listing (128x128) |

Source: same meridian-line mark as `app-desktop/public/favicon.svg`.

## Go-live smoke (v4)

```bash
cd app-visual-studio
pnpm test
pnpm package:vsix
pnpm install:cursor   # or install VSIX manually
```

Reload Cursor → **Meridian → Open Board / Versions / Sprints / Epics** → **Sync Board** → **Validate Project**.

## Related docs

- `app-desktop/docs/versions/v4.md`
- `app-desktop/docs/epics/EPIC-05.md`
- `app-desktop/docs/us/US-0041.md`
- `.agent/references/agents-help.md` — kit manual (also in **Meridian: Open Agents Help**)
