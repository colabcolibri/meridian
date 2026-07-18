import { execFileSync } from "node:child_process"
import * as fs from "node:fs"
import * as path from "node:path"

import { parseDeliveryRelativePath } from "./delivery-path.js"
import { kitRootFromPackageRoot, resolvePythonCommand, sqliteDbExists } from "./load-from-sqlite.js"

type EntityExport = {
  id: string
  raw: string
  error?: string
}

function exportScriptPath(packageRoot: string): string | null {
  const kitRoot = kitRootFromPackageRoot(packageRoot)
  const script = path.join(kitRoot, ".agent", "scripts", "meridian_db_export.py")
  return fs.existsSync(script) ? script : null
}

export function loadDeliveryMarkdownFromSqlite(
  packageRoot: string,
  relativePath: string,
): string | null {
  const parsed = parseDeliveryRelativePath(relativePath)
  if (!parsed || !sqliteDbExists(packageRoot)) {
    return null
  }
  const script = exportScriptPath(packageRoot)
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
