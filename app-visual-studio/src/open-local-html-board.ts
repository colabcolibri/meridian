import * as fs from "node:fs"
import * as path from "node:path"

import * as vscode from "vscode"

import { resolvePythonCommand } from "./load-from-sqlite.js"
import type { MeridianWorkspaceInfo } from "./meridian-workspace.js"
import { resolveKitScriptsDir } from "./resolve-kit-scripts.js"

export async function openLocalHtmlBoard(
  info: MeridianWorkspaceInfo | null,
  extensionPath: string,
): Promise<void> {
  if (!info) {
    void vscode.window.showErrorMessage("Meridian: no kit workspace. Install Harness first.")
    return
  }
  const scriptsDir = resolveKitScriptsDir(info.packageRoot, extensionPath)
  const script = scriptsDir ? path.join(scriptsDir, "meridian_board_serve.py") : ""
  if (!script || !fs.existsSync(script)) {
    void vscode.window.showErrorMessage(
      "Meridian: meridian_board_serve.py not found. Upgrade the kit.",
    )
    return
  }
  const python = resolvePythonCommand()
  const term = vscode.window.createTerminal({
    name: "Meridian HTML board",
    cwd: info.packageRoot,
  })
  term.show(true)
  const quoted = [python, script, info.packageRoot]
    .map((part) => (/\s/.test(part) ? `"${part}"` : part))
    .join(" ")
  term.sendText(quoted)
  void vscode.window.showInformationMessage(
    "Meridian: HTML board starting in the terminal. Ctrl+C there stops it.",
  )
}
