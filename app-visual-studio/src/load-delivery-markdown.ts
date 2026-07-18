import { execFileSync } from "node:child_process"

import { parseDeliveryRelativePath } from "./delivery-path.js"
import { resolvePythonCommand, sqliteDbExists } from "./load-from-sqlite.js"
import { resolveExportScriptPath } from "./resolve-kit-scripts.js"

type EntityExport = {
  id: string
  raw: string
  error?: string
}

export function loadDeliveryMarkdownFromSqlite(
  packageRoot: string,
  relativePath: string,
  extensionPath?: string,
): string | null {
  const parsed = parseDeliveryRelativePath(relativePath)
  if (!parsed || !sqliteDbExists(packageRoot)) {
    return null
  }
  const script = resolveExportScriptPath(packageRoot, extensionPath)
  if (!script) {
    return null
  }
  try {
    const stdout = execFileSync(
      resolvePythonCommand(),
      [script, packageRoot, "--entity", parsed.folder, "--id", parsed.id],
      { encoding: "utf-8", maxBuffer: 8 * 1024 * 1024 },
    )
    const data = JSON.parse(stdout) as EntityExport
    if (data.error || !data.raw) {
      return null
    }
    return data.raw
  } catch {
    return null
  }
}
