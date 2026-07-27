import * as path from "node:path"

import type { MeridianWorkspaceInfo } from "./meridian-workspace.js"

/** Absolute folder scanned for static imports — active Meridian project packageRoot. */
export function resolveImportGraphScope(info: MeridianWorkspaceInfo): string {
  return info.packageRoot
}

export function formatImportGraphScopeLabel(info: MeridianWorkspaceInfo): string {
  const rel = path.relative(info.projectRoot, info.packageRoot).replace(/\\/g, "/")
  if (rel === "" || rel === ".") {
    return info.projectName
  }
  return `${info.projectName} (${rel})`
}
