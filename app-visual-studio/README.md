# Meridian — installable VS Code extension (`app-visual-studio`)

**Product:** an extension you **install** (Marketplace or `.vsix`) — like a Markdown or Git extension — not a repo-only tool. When your workspace has Meridian (`docs/` + `.agent/MERIDIAN.md`), you get a **sidebar** with Board (kanban), epics, and versions read from disk.

**Not the goal:** command-palette sync scripts (agents in Cursor already maintain `docs/us/` and `board.json`).

**Dev:** this folder is source; users never clone it unless they contribute. **Ship:** `vsce package` → publish or install `.vsix`.

The browser monitor in `app-desktop/` remains optional/demo.

## Prerequisites

- Node.js 18+
- [pnpm](https://pnpm.io/)
- VS Code or Cursor with the Extension Development Host

## Setup

```bash
cd app-visual-studio
pnpm install
pnpm compile
```

## Usar na **mesma janela** (recomendado — como extensão instalada)

**F5 sempre abre uma janela nova** — isso é só para *desenvolver* a extensão, não para o uso diário.

Para ver o kanban **no mesmo Cursor** onde você já abriu o repo `meridian/`:

```bash
cd app-visual-studio
pnpm install:cursor
```

O script procura o CLI do Cursor no `PATH` e, se não achar, nos caminhos padrão do app (ex.: `/Applications/Cursor.app/...` no macOS). Não é obrigatório rodar *Shell Command: Install 'cursor' command in PATH* antes — mas ajuda em setups não padrão.

No Cursor: **Cmd+Shift+P** → `Developer: Reload Window`.

Depois:

1. Você continua na **mesma janela** com o monorepo `meridian/` (ou `app-desktop/`).
2. **Cmd+Shift+P** → `Meridian: Open Board` ou `Meridian: Open Deliverables` — abas de editor.
   - **Board:** versão e épico com **All / None** + chips multi-select; toggle frozen.
   - **Deliverables:** versão com **All / None** + chips; acordeão por release (▶/▼); clique no id abre o `.md`.
3. Barra lateral **Meridian → Commands** — mesmos atalhos + Validate.

**Alternativa (UI):** Extensions → `⋯` → **Install from VSIX…** → escolha `app-visual-studio/meridian-vscode-0.1.0.vsix` (rode `pnpm package:vsix` antes).

Para desinstalar/reinstalar após mudanças no código: rode `pnpm install:cursor` de novo e reload.

## Desenvolver a extensão (F5 — janela extra, só mantainers)

### Option A — monorepo root (recommended if you use Cursor on `meridian/`)

1. Open **`meridian.code-workspace`** (double-click in Finder) or **File → Open Workspace from File…**.
2. In the Run and Debug sidebar, choose **Run Meridian extension** (not a generic Node config).
3. Press **F5**. A second window opens (`[Extension Development Host]`) with **`app-desktop/`** already open (configured in `launch.json`).
4. Status bar should show **`Meridian (N)`**; Command Palette → **Meridian: Sync Board** (stub until v4-S2).

If the host window is empty, use **File → Open Folder…** → `app-desktop/` (fixes Cursor `NoWorkspaceUriError` in the log).

### Option B — extension folder only

1. **File → Open Folder…** → `app-visual-studio/` (not the whole repo).
2. Run and Debug → **Run Extension** → **F5**.
3. In the new window, open `app-desktop/` (or your project with `.agent/` + `docs/`).

### `Detecção de tarefa NPM: falha ao analisar package.json`

The extension `package.json` is a **VS Code manifest** (fields like `contributes`, `activationEvents`), not a plain Node app. Cursor/VS Code npm auto-detect fails on it — harmless. This repo sets `"npm.autoDetect": "off"` in `.vscode/settings.json`. Use **`pnpm compile`** or the **compile** shell task for F5.

### F5 “does nothing” or fails

| Cause | Fix |
| ----- | --- |
| Repo root open, no debug config | Use **`meridian.code-workspace`** or root `.vscode/launch.json` → **Run Meridian extension** |
| Wrong debug target selected | Sidebar **Run and Debug** → dropdown must be extension config, not “Node” |
| `preLaunchTask` failed | Terminal: `cd app-visual-studio && pnpm install && pnpm compile` |
| No second window | Check **View → Output** → **Log (Extension Host)** for errors |
| Cursor | Same steps; ensure **Extension Development** is available (built on VS Code) |

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
| `pnpm test` | Smoke: compile must exit 0 |

## Where to run commands (like ⇧⌘P, but in the UI)

| Place | What |
| ----- | ---- |
| **Commands → Command help** or **View → Meridian → Open Command Help** | Reference tab for every extension command |
| **Commands → Agents & commands** or **Meridian: Open Agents Help** | Webview tab — kit manual (agents, slash commands, steps) |
| **Activity bar → Meridian → Commands** | List of actions (click = run + **Output**) |
| **Menu View → Meridian** | Same commands |
| **Command Palette** | `Meridian: …` (⇧⌘P) |

### Outputs

| Command | Output channel |
| ------- | -------------- |
| Validate project | **Meridian Validate** (full `validate_meridian.py` log) |
| Workspace status / Sync board / New US | **Meridian Tools** |

### Board (kanban)

- **Commands → Open Board** or **View → Meridian → Open Board**
- Opens an **editor tab** `Meridian Board` (not inside the Commands tree)
- Click a card → US file opens beside the board

## Activation

The extension activates when the workspace contains `.agent/MERIDIAN.md` (`workspaceContains` in `package.json`).

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
| `meridian.openHelp` | Meridian: Open Command Help | ✅ Reference tab (PT) |
| `meridian.openAgentsHelp` | Meridian: Open Agents Help | ✅ Agents help webview tab |
| `meridian.validateProject` | Meridian: Validate Project | ✅ Runs `validate_meridian.py` |
| `meridian.showStatus` | Meridian: Show Workspace Status | ✅ Output |
| `meridian.newUserStory` | Meridian: New User Story | Stub — use `/create-us` (v5) |

## Go-live smoke (v4)

```bash
cd app-visual-studio
pnpm test
pnpm package:vsix
pnpm install:cursor   # or install VSIX manually
```

Reload Cursor → **Meridian → Open Board / Versions / Sprints / Epics** → **Sync board** → **Validate project**.

## Related docs

- `app-desktop/docs/versions/v4.md`
- `app-desktop/docs/epics/EPIC-05.md`
- `app-desktop/docs/us/US-0041.md`
