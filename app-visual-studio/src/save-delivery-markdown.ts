import { execFileSync } from "node:child_process"
import * as fs from "node:fs"
import * as path from "node:path"

import { parseDeliveryRelativePath } from "./delivery-path.js"
import { kitRootFromPackageRoot, resolvePythonCommand, sqliteDbExists } from "./load-from-sqlite.js"

type WriteExport = {
  ok?: boolean
  error?: string
  id?: string
}

function exportScriptPath(packageRoot: string): string | null {
  const kitRoot = kitRootFromPackageRoot(packageRoot)
  const script = path.join(kitRoot, ".agent", "scripts", "meridian_db_export.py")
  return fs.existsSync(script) ? script : null
}

export type SaveDeliveryResult =
  | { ok: true; id: string }
  | { ok: false; error: string }

export function saveDeliveryMarkdownToSqlite(
  packageRoot: string,
  relativePath: string,
  markdown: string,
): SaveDeliveryResult {
  const parsed = parseDeliveryRelativePath(relativePath)
  if (!parsed || !sqliteDbExists(packageRoot)) {
    return { ok: false, error: "Delivery path or SQLite database not found." }
  }
  const script = exportScriptPath(packageRoot)
  if (!script) {
    return { ok: false, error: "meridian_db_export.py not found in kit." }
  }
  if (!markdown.trim()) {
    return { ok: false, error: "Markdown is empty." }
  }
  try {
    const stdout = execFileSync(
      resolvePythonCommand(),
      [script, packageRoot, "--entity", parsed.folder, "--id", parsed.id, "--write"],
      { encoding: "utf-8", input: markdown, maxBuffer: 8 * 1024 * 1024 },
    )
    const data = JSON.parse(stdout) as WriteExport
    if (!data.ok) {
      return { ok: false, error: data.error ?? "Save failed." }
    }
    return { ok: true, id: data.id ?? parsed.id }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { ok: false, error: message }
  }
}
