import * as fs from "node:fs"
import * as path from "node:path"

import { bundledKitAgentDir } from "./kit-installer.js"
import { kitRootFromPackageRoot } from "./load-from-sqlite.js"

export function workspaceScriptsDir(packageRoot: string): string {
  return path.join(kitRootFromPackageRoot(packageRoot), ".agent", "scripts")
}

export function extensionScriptsDir(extensionPath: string): string {
  return path.join(bundledKitAgentDir(extensionPath), "scripts")
}

/** Dev VSIX may ship stale bundled/kit — try monorepo `.agent/scripts` next. */
export function extensionScriptsCandidates(extensionPath: string): string[] {
  const resolved = path.resolve(extensionPath)
  const candidates = [
    extensionScriptsDir(resolved),
    path.join(resolved, "..", ".agent", "scripts"),
  ]
  return [...new Set(candidates.map((dir) => path.resolve(dir)))]
}

export function scriptsSupportDeliveryForm(scriptsDir: string): boolean {
  return (
    fs.existsSync(path.join(scriptsDir, "meridian_db_export.py")) &&
    fs.existsSync(path.join(scriptsDir, "meridian_delivery_form.py"))
  )
}

/**
 * Prefer workspace `.agent/scripts` when form-capable; otherwise extension bundled/monorepo kit.
 * `packageRoot` is still passed to Python for `.meridian/meridian.db` — only script location changes.
 */
export function resolveKitScriptsDir(
  packageRoot: string,
  extensionPath?: string,
): string | null {
  const workspaceScripts = workspaceScriptsDir(packageRoot)
  if (scriptsSupportDeliveryForm(workspaceScripts)) {
    return workspaceScripts
  }

  if (extensionPath) {
    for (const extensionScripts of extensionScriptsCandidates(extensionPath)) {
      if (scriptsSupportDeliveryForm(extensionScripts)) {
        return extensionScripts
      }
    }
    for (const extensionScripts of extensionScriptsCandidates(extensionPath)) {
      if (fs.existsSync(path.join(extensionScripts, "meridian_db_export.py"))) {
        return extensionScripts
      }
    }
  }

  if (fs.existsSync(path.join(workspaceScripts, "meridian_db_export.py"))) {
    return workspaceScripts
  }
  return null
}

export function resolveExportScriptPath(
  packageRoot: string,
  extensionPath?: string,
): string | null {
  const scriptsDir = resolveKitScriptsDir(packageRoot, extensionPath)
  if (!scriptsDir) {
    return null
  }
  const script = path.join(scriptsDir, "meridian_db_export.py")
  return fs.existsSync(script) ? script : null
}
