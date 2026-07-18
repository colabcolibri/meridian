---
title: Environments
status: approved
version: 1.2
updated: 2026-06-04
depends_on: [01_tech_stack.md, 05_architecture.md]
blocks: []
---

# 08 — Environments

## How to run locally

### Prerequisites

- Node.js compatible with Vite.
- pnpm.
- Python 3 (for `validate_meridian.py` in dev and in the terminal).

### Initial setup

```bash
pnpm install
pnpm prepare
```

### Day-to-day commands

```bash
pnpm dev
pnpm build
pnpm lint
pnpm format
pnpm format:check
python3 ../.agent/scripts/validate_meridian.py .
```

### Validate Meridian governance

At the repository root (or in `app-desktop/`):

```bash
python3 .agent/scripts/validate_meridian.py app-desktop
```

In the app (`pnpm dev`), use the **Validate folder** button — it calls the same script via local API (`/api/meridian/validate`).

### Dogfooding with path persistence (v2.01)

With `pnpm dev`, prefer **Enter path manually (local dev)** on the welcome screen: absolute path to `app-desktop/docs/` (or any project `docs/`). The path is stored in `localStorage` (`meridian.localFolderPath`); F5 and new tabs reload the board without the folder picker. **Close folder** clears the key. File reads use Vite middleware `/api/list` and `/api/files` (see `05_architecture.md`). The picker remains a fallback when no path is stored.

## VS Code extension (`app-visual-studio/`)

### Prerequisites

- Node.js 18+, pnpm.
- Python 3 on `PATH` (for commands that shell out to `.agent/scripts/` from v4-S2 onward).
- VS Code or Cursor with Extension Development Host.

### Setup and compile

```bash
cd app-visual-studio
pnpm install
pnpm compile
```

`npm.autoDetect` is **off** in this folder — `package.json` is an extension manifest, not a plain npm app.

### Debug (F5)

| Workspace opened            | Launch config                                                                          |
| --------------------------- | -------------------------------------------------------------------------------------- |
| Monorepo root (`meridian/`) | Root `.vscode/launch.json` → **Run Meridian extension** (opens `app-desktop/` in host) |
| Extension only              | `app-visual-studio/.vscode/launch.json` → **Run Extension**                            |

After F5, use **Cmd+Shift+P** → `Meridian: Show Workspace Status`. View kanban in **`app-desktop`** (`pnpm dev`) — not inside the extension in v4.

### Extension scripts

| Script                    | Purpose                                      |
| ------------------------- | -------------------------------------------- |
| `pnpm compile`            | esbuild bundle to `dist/extension.js`        |
| `pnpm watch` / `pnpm dev` | Watch mode                                   |
| `pnpm test`               | Compile + unit tests for workspace detection |

Packaging for Marketplace (`vsce package`) → v4-S4 / US-0052.

## Environment variables

v0 monitor and v4 extension do not require environment variables.

| Variable | Description                | Required | Example |
| -------- | -------------------------- | -------: | ------- |
| —        | No variable required in v0 |       No | —       |

## Protected files

- `.env`
- `.env.*`
- `node_modules/`
- `dist/`
- local caches and logs

`.env.example` should be versioned as a configuration contract.

## Available environments

| Environment | Purpose          | Branch | Automatic deploy |
| ----------- | ---------------- | ------ | ---------------- |
| local       | Vite development | any    | no               |

## Differences between environments

There are no remote environments in v0 yet.
