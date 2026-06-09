import * as path from "node:path"

import type * as vscode from "vscode"

/** Paths under docs/ that affect board or deliverables webviews. */
const US_REL = /^us\/US-\d{4}\.md$/i
const BOARD_JSON_REL = /^kanban\/board\.json$/i
const DELIVERABLES_REL = /^(versions|epics|sprints)\/.+\.md$/i

export function relativeDocsPath(docsRoot: string, filePath: string): string | null {
  const docs = path.resolve(docsRoot)
  const file = path.resolve(filePath)
  if (file !== docs && !file.startsWith(docs + path.sep)) {
    return null
  }
  return path.relative(docs, file).split(path.sep).join("/")
}

export function isBoardSyncDocsPath(docsRoot: string, filePath: string): boolean {
  const rel = relativeDocsPath(docsRoot, filePath)
  if (!rel) {
    return false
  }
  return US_REL.test(rel) || BOARD_JSON_REL.test(rel) || DELIVERABLES_REL.test(rel)
}

export function fileEventTouchesBoardSync(
  docsRoot: string,
  files: readonly { readonly oldUri?: vscode.Uri; readonly newUri?: vscode.Uri }[],
): boolean {
  for (const entry of files) {
    if (entry.newUri && isBoardSyncDocsPath(docsRoot, entry.newUri.fsPath)) {
      return true
    }
    if (entry.oldUri && isBoardSyncDocsPath(docsRoot, entry.oldUri.fsPath)) {
      return true
    }
  }
  return false
}
