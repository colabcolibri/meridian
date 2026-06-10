import { spawn } from "node:child_process"
import * as fs from "node:fs"
import * as path from "node:path"

import type { MeridianWorkspaceInfo } from "./meridian-workspace.js"

/** Folder argument for validate_meridian.py (package folder that owns docs/). */
export function resolveValidateTarget(info: MeridianWorkspaceInfo): string {
  if (fs.existsSync(path.join(info.packageRoot, "docs"))) {
    return info.packageRoot
  }
  const docsParent = path.dirname(info.docsRoot)
  if (path.basename(info.docsRoot) === "docs") {
    return docsParent
  }
  return info.projectRoot
}

export function validateScriptPath(projectRoot: string): string {
  return path.join(projectRoot, ".agent", "scripts", "validate_meridian.py")
}

export function runValidateMeridian(
  projectRoot: string,
  validateTarget: string,
): Promise<{ code: number; output: string }> {
  const script = validateScriptPath(projectRoot)
  if (!fs.existsSync(script)) {
    return Promise.resolve({
      code: 1,
      output: `Script not found: ${script}`,
    })
  }

  const relativeTarget = path.relative(projectRoot, validateTarget) || "."

  return new Promise((resolve) => {
    const chunks: string[] = []
    const proc = spawn("python3", [script, relativeTarget], {
      cwd: projectRoot,
      env: process.env,
    })
    proc.stdout.on("data", (d: Buffer) => chunks.push(String(d)))
    proc.stderr.on("data", (d: Buffer) => chunks.push(String(d)))
    proc.on("close", (code) => {
      resolve({ code: code ?? 1, output: chunks.join("").trim() || "(no output)" })
    })
    proc.on("error", (err) => {
      resolve({ code: 1, output: `Failed to run python3: ${err.message}` })
    })
  })
}
