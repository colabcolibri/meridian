# Meridian distribution

Two **separate** products. Most users need only the **kit**. The **extension** is optional observability in Cursor/VS Code.

| Product | What it is | Who needs it |
| ------- | ---------- | ------------ |
| **meridian-kit** | `.agent/` + `install.sh` (tarball) | Everyone using Meridian in a project |
| **meridian-vscode** | Editor extension (`.vsix`) | Optional — board and planning tabs in the IDE |

Author: [Sergio Luciano Jr](https://github.com/colabcolibri) · Repository: [colabcolibri/meridian](https://github.com/colabcolibri/meridian)

---

## Kit install — what you get (including agents)

Running `./install.sh` (or `install-meridian-kit.sh`) copies the **full** `.agent/` tree into the target project:

| Path | Contents |
| ---- | -------- |
| `.agent/agents/` | All Meridian agents (`process-manager`, `board-keeper`, …) |
| `.agent/skills/` | Skills with `SKILL.md` |
| `.agent/workflows/` | Slash commands (`/create-us`, `/init-meridian`, …) |
| `.agent/rules/` | Always-on rules (`meridian.mdc`) |
| `.agent/scripts/` | `validate_meridian.py`, sync, install, package |
| `.agent/references/` | Templates, agents-help, usage guides |

Then (default install) **adapter sync** wires IDE slash commands:

| IDE | Extra folders |
| --- | ------------- |
| **Cursor** | `.cursor/agents/`, `.cursor/commands/`, `.cursor/skills/`, `.cursor/rules/` → symlinks to `.agent/` |
| **Claude Code** | `.claude/agents/`, `.claude/commands/` → symlinks |
| **Antigravity / `.agent` native** | None — use `--no-sync`; agents live in `.agent/agents/` |

**Yes — every kit install includes all agents.** Re-run with `--force` to upgrade the kit and refresh adapters without deleting your custom `.cursor/` files.

---

## Distribute the kit (no monorepo clone)

### Maintainers — build tarball

From the meridian repo:

```bash
KIT_VERSION=1.0.0 ./.agent/scripts/package-kit.sh
# → dist/meridian-kit-1.0.0.tar.gz
```

Publish on **GitHub Releases** (tag e.g. `kit-v1.0.0`), attach the `.tar.gz`.

### End users — install in any repo

```bash
# Download release asset, then:
tar -xzf meridian-kit-1.0.0.tar.gz
cd meridian-kit-1.0.0
./install.sh /path/to/my-project
cd /path/to/my-project
# /init-meridian if docs/ is missing
```

No `git clone` of the full monorepo required. No `app-desktop/`, no extension source in the tarball.

---

## Distribute the extension (optional)

The extension is **not** inside the kit tarball. Users who want Board / planning views in Cursor:

### Option A — GitHub Release `.vsix` (recommended for non-developers)

Maintainers:

```bash
cd app-visual-studio
pnpm package:vsix
# → meridian-vscode-X.Y.Z.vsix
```

Attach to **GitHub Releases** (tag e.g. `extension-v0.3.7`).

End users:

1. Download `meridian-vscode-*.vsix` from Releases.
2. Cursor → Extensions → `⋯` → **Install from VSIX…**
3. Reload window.

### Option B — From a clone (developers)

```bash
git clone https://github.com/colabcolibri/meridian.git
cd meridian/app-visual-studio
pnpm install:cursor   # builds VSIX and installs locally
```

### Option C — Marketplace (future)

Requires a [Visual Studio Marketplace publisher](https://marketplace.visualstudio.com/manage) (`colabcolibri`). Until listed, use Release `.vsix` or Option B.

The extension **reads** the project's `docs/` — it does not replace the kit. Install **kit first**, extension second.

---

## Quick matrix

| User goal | Install |
| --------- | ------- |
| Agents + slash commands in Cursor | `meridian-kit` tarball → `./install.sh` |
| Same in Claude Code | Same (default sync includes `.claude/`) |
| Antigravity only | `./install.sh --no-sync` |
| Kanban in editor | Kit + `.vsix` from Releases or `pnpm install:cursor` |
| Validate project | Kit only (`validate_meridian.py` in `.agent/scripts/`) |

---

## License

PolyForm Noncommercial 1.0.0 — see `LICENSE` in the kit tarball and monorepo root.
