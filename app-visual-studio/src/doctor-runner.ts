import { spawn } from "node:child_process"
import * as fs from "node:fs"
import * as path from "node:path"

export function doctorScriptPath(projectRoot: string): string {
  return path.join(projectRoot, ".agent", "scripts", "meridian_doctor.py")
}

export function runMeridianDoctor(
  projectRoot: string,
): Promise<{ code: number; output: string }> {
  const script = doctorScriptPath(projectRoot)
  if (!fs.existsSync(script)) {
    return Promise.resolve({
      code: 1,
      output: `Script not found: ${script}\nInstall or upgrade the Meridian harness first.`,
    })
  }

  return new Promise((resolve) => {
    const chunks: string[] = []
    const proc = spawn("python3", [script, projectRoot], {
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
