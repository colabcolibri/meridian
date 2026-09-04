import * as fs from "node:fs"
import * as path from "node:path"
import { spawnSync } from "node:child_process"

import type * as vscode from "vscode"

import { readExtensionVersion, stampWorkspaceHarness } from "./harness-stamp.js"
import {
  appendGitignoreBackupEntry,
  backupAgentDirBeforeOverwrite,
} from "./kit-agent-backup.js"

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
  const entries = [".cursor/", ".claude/", ".agents/skills/", ".codex/", ".opencode/", "AGENTS.md"]
  if (!fs.existsSync(gitignorePath)) {
    fs.writeFileSync(
      gitignorePath,
      "# Meridian IDE adapters (local symlinks)\n.cursor/\n.claude/\n.agents/skills/\n.codex/\n.opencode/\nAGENTS.md\n",
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
  // Prefer the canonical generator; fall back to the deprecated shim for older bundled kits.
  const canonical = path.join(agentDir, "scripts", "sync_kit.sh")
  const legacy = path.join(agentDir, "scripts", "sync_cursor_kit.sh")
  const syncScript = fs.existsSync(canonical) ? canonical : legacy
  if (!fs.existsSync(syncScript)) {
    return "sync_kit.sh not found in installed kit"
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

function runBootstrapDb(projectRoot: string, agentDir: string): string | null {
  const script = path.join(agentDir, "scripts", "bootstrap_meridian_db.py")
  if (!fs.existsSync(script)) {
    return null
  }
  const docs = path.join(projectRoot, "docs", "00_scope.md")
  if (!fs.existsSync(docs)) {
    return null
  }
  const python = process.platform === "win32" ? "python" : "python3"
  const result = spawnSync(python, [script, projectRoot], {
    cwd: projectRoot,
    encoding: "utf8",
    shell: false,
  })
  if (result.status !== 0) {
    const err = (result.stderr || result.stdout || "").trim()
    return err || `bootstrap exited with code ${result.status}`
  }
  return (result.stdout || "").trim() || null
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

  let backupNote = ""
  try {
    const backupPath = options.force ? backupAgentDirBeforeOverwrite(root, dest) : null
    fs.cpSync(src, dest, { recursive: true, force: true })
    stampWorkspaceHarness(dest, extensionPath)
    chmodScripts(dest)
    if (backupPath) {
      const rel = path.relative(root, backupPath)
      backupNote = ` Previous kit backed up at ${rel}.`
      appendGitignoreBackupEntry(path.join(root, ".gitignore"))
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return { ok: false, message: `Failed to copy kit: ${msg}`, projectRoot: root }
  }

  appendGitignoreAdapterEntries(path.join(root, ".gitignore"))

  const syncError = runAdapterSync(root, dest)
  const bootstrapMsg = runBootstrapDb(root, dest)
  const bootstrapNote = bootstrapMsg ? ` SQLite: ${bootstrapMsg}.` : ""
  if (syncError) {
    return {
      ok: true,
      message: `Kit installed at ${dest}. Adapter sync failed (${syncError}) — run .agent/scripts/sync_kit.sh manually.${backupNote}${bootstrapNote}`,
      projectRoot: root,
    }
  }

  return {
    ok: true,
    message: `Meridian harness ${readExtensionVersion(extensionPath)} installed: ${dest} (agents, skills, workflows) + IDE adapters synced.${backupNote}${bootstrapNote}`,
    projectRoot: root,
  }
}

export function kitInstalledAt(projectRoot: string): boolean {
  return fs.existsSync(path.join(path.resolve(projectRoot), KIT_MARKER))
}

export function uninstallInstalledKit(
  projectRoot: string,
  options: { scope: "adapters" | "all" },
): InstallKitResult {
  const root = path.resolve(projectRoot)
  const agentDir = path.join(root, ".agent")
  const script = path.join(agentDir, "scripts", "uninstall-meridian-kit.sh")

  if (!fs.existsSync(script)) {
    return {
      ok: false,
      message:
        "uninstall-meridian-kit.sh not found — this workspace has an older kit. Upgrade harness first, or remove .agent/ manually.",
      projectRoot: root,
    }
  }

  chmodScripts(agentDir)
  const bash = "bash"
  const args = options.scope === "all" ? [script, "--all"] : [script]
  const result = spawnSync(bash, args, {
    cwd: root,
    encoding: "utf8",
    shell: false,
  })
  const output = (result.stdout || "").trim()
  if (result.status !== 0) {
    const err = (result.stderr || output).trim()
    return { ok: false, message: err || `uninstall exited with code ${result.status}`, projectRoot: root }
  }

  const removed =
    options.scope === "all"
      ? "Meridian harness removed (adapters + .agent/ + gitignore entries)"
      : "Meridian IDE adapters removed (.agent/ kept)"
  return {
    ok: true,
    message: `${removed}. docs/ and .meridian/ (delivery SQLite) are never deleted — remove manually if desired.`,
    projectRoot: root,
  }
}
