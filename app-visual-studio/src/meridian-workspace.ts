import * as fs from "node:fs"
import * as path from "node:path"

import type * as vscode from "vscode"

const KIT_REL = path.join(".agent", "MERIDIAN.md")
const US_FILENAME = /^US-\d{4}\.md$/i
/** Dogfood monorepo: kit at repo root, docs under app-desktop/docs */
const MONOREPO_DOCS_CANDIDATES = ["docs", "app-desktop/docs"] as const

export type MeridianWorkspaceInfo = {
  projectRoot: string
  docsRoot: string
  kitDetected: true
  docsExists: boolean
  usCount: number
}

function kitFileAt(root: string): string {
  return path.join(root, KIT_REL)
}

export function countUserStoriesInDocs(docsRoot: string): number {
  const usDir = path.join(docsRoot, "us")
  if (!fs.existsSync(usDir)) {
    return 0
  }
  return fs
    .readdirSync(usDir, { withFileTypes: true })
    .filter((e) => e.isFile() && US_FILENAME.test(e.name)).length
}

function firstExistingDir(candidates: string[]): string {
  for (const dir of candidates) {
    if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
      return dir
    }
  }
  return candidates[0]
}

function resolveDocsRoot(projectRoot: string, workspacePath: string): string {
  if (workspacePath !== projectRoot) {
    return path.join(workspacePath, "docs")
  }
  const candidates = MONOREPO_DOCS_CANDIDATES.map((rel) =>
    path.join(projectRoot, rel),
  )
  return firstExistingDir(candidates)
}

function buildInfo(projectRoot: string, docsRoot: string): MeridianWorkspaceInfo {
  const docsExists =
    fs.existsSync(docsRoot) && fs.statSync(docsRoot).isDirectory()
  return {
    projectRoot,
    docsRoot,
    kitDetected: true,
    docsExists,
    usCount: docsExists ? countUserStoriesInDocs(docsRoot) : 0,
  }
}

/** Aligns with `validate_meridian.py` kit detection (`.agent/MERIDIAN.md`). */
export function resolveMeridianWorkspaceFromPaths(
  workspacePath: string,
): MeridianWorkspaceInfo | null {
  const normalized = path.resolve(workspacePath)

  if (fs.existsSync(kitFileAt(normalized))) {
    return buildInfo(normalized, resolveDocsRoot(normalized, normalized))
  }

  const parent = path.dirname(normalized)
  if (fs.existsSync(kitFileAt(parent))) {
    return buildInfo(parent, path.join(normalized, "docs"))
  }

  return null
}

export function formatStatusTooltip(info: MeridianWorkspaceInfo): string {
  const lines = [
    "Meridian kit: detected",
    `Project root: ${info.projectRoot}`,
    `Docs: ${info.docsRoot}`,
  ]
  if (!info.docsExists) {
    lines.push("Warning: docs/ folder missing")
  } else {
    lines.push(`User stories: ${info.usCount} (read-only)`)
  }
  return lines.join("\n")
}

export async function pickMeridianWorkspace(
  folders: readonly vscode.WorkspaceFolder[],
): Promise<{ folder: vscode.WorkspaceFolder; info: MeridianWorkspaceInfo } | null> {
  for (const folder of folders) {
    const info = resolveMeridianWorkspaceFromPaths(folder.uri.fsPath)
    if (info) {
      return { folder, info }
    }
  }
  return null
}
