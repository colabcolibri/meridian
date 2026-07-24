import * as path from "node:path"

import type * as vscode from "vscode"

export function meridianDbPath(packageRoot: string): string {
  return path.join(packageRoot, ".meridian", "meridian.db")
}

export function isMeridianDbPath(packageRoot: string, filePath: string): boolean {
  const db = path.resolve(meridianDbPath(packageRoot))
  return path.resolve(filePath) === db
}

export function fileEventTouchesMeridianDb(
  packageRoot: string,
  files: readonly { readonly oldUri?: vscode.Uri; readonly newUri?: vscode.Uri }[],
): boolean {
  for (const entry of files) {
    if (entry.newUri && isMeridianDbPath(packageRoot, entry.newUri.fsPath)) {
      return true
    }
    if (entry.oldUri && isMeridianDbPath(packageRoot, entry.oldUri.fsPath)) {
      return true
    }
  }
  return false
}

export function isArchitectureDiagramPath(docsRoot: string, filePath: string): boolean {
  const diagramsDir = path.join(docsRoot, "architecture", "diagrams")
  const resolved = path.resolve(filePath)
  if (!resolved.startsWith(path.resolve(diagramsDir) + path.sep)) {
    return false
  }
  const ext = path.extname(resolved).toLowerCase()
  return ext === ".md" || ext === ".mmd"
}

export function fileEventTouchesArchitectureDiagrams(
  docsRoot: string,
  files: readonly { readonly oldUri?: vscode.Uri; readonly newUri?: vscode.Uri }[],
): boolean {
  for (const entry of files) {
    if (entry.newUri && isArchitectureDiagramPath(docsRoot, entry.newUri.fsPath)) {
      return true
    }
    if (entry.oldUri && isArchitectureDiagramPath(docsRoot, entry.oldUri.fsPath)) {
      return true
    }
  }
  return false
}
