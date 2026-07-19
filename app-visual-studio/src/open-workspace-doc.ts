import * as fs from "node:fs"
import * as path from "node:path"
import * as vscode from "vscode"

import type { MeridianWorkspaceInfo } from "./meridian-workspace.js"

export async function openWorkspaceDoc(
  info: MeridianWorkspaceInfo,
  relativePath: string,
): Promise<void> {
  const normalized = relativePath.replace(/\\/g, "/").replace(/^\.\//, "")
  const candidates = [
    path.join(info.packageRoot, normalized),
    path.join(info.projectRoot, normalized),
    path.join(info.docsRoot, normalized),
    path.join(path.dirname(info.docsRoot), normalized),
  ]
  const seen = new Set<string>()
  for (const abs of candidates) {
    const resolved = path.resolve(abs)
    if (seen.has(resolved)) {
      continue
    }
    seen.add(resolved)
    if (fs.existsSync(resolved)) {
      const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(resolved))
      await vscode.window.showTextDocument(doc, { preview: false })
      return
    }
  }
  void vscode.window.showWarningMessage(`Meridian: file not found — ${relativePath}`)
}
