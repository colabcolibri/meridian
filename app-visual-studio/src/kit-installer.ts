import * as fs from "node:fs"
import * as path from "node:path"
import { spawnSync } from "node:child_process"

import type * as vscode from "vscode"

const KIT_MARKER = path.join(".agent", "MERIDIAN.md")

export function bundledKitAgentDir(extensionPath: string): string {
  const bundled = path.join(extensionPath, "bundled", "kit", ".agent")
  if (fs.existsSync(path.join(bundled, "MERIDIAN.md"))) {
    return bundled
  }
  const monorepoAgent = path.join(extensionPath, "..", ".agent")
  if (fs.existsSync(path.join(monorepoAgent, "MERIDIAN.md"))) {
    return monorepoAgent
  }
  return bundled
}

export function workspaceProjectRoot(
  folders: readonly vscode.WorkspaceFolder[] | undefined,
): string | null {
  const first = folders?.[0]
  return first ? path.resolve(first.uri.fsPath) : null
}

function appendGitignoreAdapterEntries(gitignorePath: string): void {
  const entries = [".cursor/", ".claude/"]
  if (!fs.existsSync(gitignorePath)) {
    fs.writeFileSync(
      gitignorePath,
      "# Meridian IDE adapters (local symlinks)\n.cursor/\n.claude/\n",
      "utf8",
    )
    return
  }
  const content = fs.readFileSync(gitignorePath, "utf8")
  let next = content
  for (const entry of entries) {
    if (content.split("\n").some((line) => line.trim() === entry)) {
      continue
    }
    if (!next.includes("Meridian IDE adapters")) {
      next += "\n# Meridian IDE adapters (local symlinks)\n"
    }
    next += `${entry}\n`
  }
  if (next !== content) {
    fs.writeFileSync(gitignorePath, next, "utf8")
  }
}

function chmodScripts(agentDir: string): void {
  const scriptsDir = path.join(agentDir, "scripts")
  if (!fs.existsSync(scriptsDir)) {
    return
  }
  for (const name of fs.readdirSync(scriptsDir)) {
    if (name.endsWith(".sh")) {
      try {
        fs.chmodSync(path.join(scriptsDir, name), 0o755)
      } catch {
        /* Windows may ignore */
      }
    }
  }
}

function runAdapterSync(projectRoot: string, agentDir: string): string | null {
  const syncScript = path.join(agentDir, "scripts", "sync_cursor_kit.sh")
  if (!fs.existsSync(syncScript)) {
    return "sync_cursor_kit.sh not found in installed kit"
  }
  chmodScripts(agentDir)
  const bash = process.platform === "win32" ? "bash" : "bash"
  const result = spawnSync(bash, [syncScript], {
    cwd: projectRoot,
    encoding: "utf8",
    shell: false,
  })
  if (result.status !== 0) {
    const err = (result.stderr || result.stdout || "").trim()
    return err || `sync exited with code ${result.status}`
  }
  return null
}

export type InstallKitResult = {
  ok: boolean
  message: string
  projectRoot: string
}

export function installBundledKit(
  projectRoot: string,
  extensionPath: string,
  options: { force?: boolean } = {},
): InstallKitResult {
  const root = path.resolve(projectRoot)
  const src = bundledKitAgentDir(extensionPath)
  const dest = path.join(root, ".agent")

  if (!fs.existsSync(path.join(src, "MERIDIAN.md"))) {
    return {
      ok: false,
      message: `Bundled kit missing in extension at ${src}. Reinstall the extension.`,
      projectRoot: root,
    }
  }

  if (fs.existsSync(dest) && !options.force) {
    return {
      ok: false,
      message:
        ".agent/ already exists. Use Upgrade harness (force) to replace the kit and refresh adapters.",
      projectRoot: root,
    }
  }

  try {
    fs.cpSync(src, dest, { recursive: true, force: true })
    chmodScripts(dest)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return { ok: false, message: `Failed to copy kit: ${msg}`, projectRoot: root }
  }

  appendGitignoreAdapterEntries(path.join(root, ".gitignore"))

  const syncError = runAdapterSync(root, dest)
  if (syncError) {
    return {
      ok: true,
      message: `Kit installed at ${dest}. Adapter sync failed (${syncError}) — run .agent/scripts/sync_cursor_kit.sh manually.`,
      projectRoot: root,
    }
  }

  return {
    ok: true,
    message: `Meridian harness installed: ${dest} (agents, skills, workflows) + IDE adapters synced.`,
    projectRoot: root,
  }
}

export function kitInstalledAt(projectRoot: string): boolean {
  return fs.existsSync(path.join(path.resolve(projectRoot), KIT_MARKER))
}
