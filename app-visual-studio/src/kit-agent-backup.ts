import * as fs from "node:fs"
import * as path from "node:path"
import { spawnSync } from "node:child_process"

export const AGENT_BACKUP_DIR = "agent-backup"
const BACKUP_PREFIX = "harness-"
const MAX_BACKUPS = 5

function backupStamp(): string {
  return new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)
}

function zipDirectory(sourceDir: string, zipPath: string): boolean {
  if (process.platform === "win32") {
    const source = path.join(sourceDir, "*")
    const result = spawnSync(
      "powershell",
      [
        "-NoProfile",
        "-Command",
        `Compress-Archive -Path '${source.replace(/'/g, "''")}' -DestinationPath '${zipPath.replace(/'/g, "''")}' -Force`,
      ],
      { encoding: "utf8", shell: false },
    )
    return result.status === 0 && fs.existsSync(zipPath)
  }

  const result = spawnSync("zip", ["-rq", zipPath, "."], {
    cwd: sourceDir,
    encoding: "utf8",
    shell: false,
  })
  return result.status === 0 && fs.existsSync(zipPath)
}

function listBackupEntries(backupRoot: string): string[] {
  if (!fs.existsSync(backupRoot)) {
    return []
  }
  return fs
    .readdirSync(backupRoot)
    .filter((name) => name.startsWith(BACKUP_PREFIX))
    .map((name) => path.join(backupRoot, name))
    .filter((entry) => {
      try {
        return fs.statSync(entry).isFile() || fs.statSync(entry).isDirectory()
      } catch {
        return false
      }
    })
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)
}

function pruneOldBackups(backupRoot: string, keep = MAX_BACKUPS): void {
  const entries = listBackupEntries(backupRoot)
  for (const entry of entries.slice(keep)) {
    try {
      fs.rmSync(entry, { recursive: true, force: true })
    } catch {
      /* best effort */
    }
  }
}

export function appendGitignoreBackupEntry(gitignorePath: string): void {
  const entry = `${AGENT_BACKUP_DIR}/`
  if (!fs.existsSync(gitignorePath)) {
    fs.writeFileSync(
      gitignorePath,
      `# Meridian harness backups (Upgrade Harness)\n${entry}\n`,
      "utf8",
    )
    return
  }
  const content = fs.readFileSync(gitignorePath, "utf8")
  if (content.split("\n").some((line) => line.trim() === entry || line.trim() === AGENT_BACKUP_DIR)) {
    return
  }
  const header = content.includes("Meridian harness backups")
    ? ""
    : "\n# Meridian harness backups (Upgrade Harness)\n"
  fs.writeFileSync(gitignorePath, `${content.replace(/\s*$/, "")}${header}${entry}\n`, "utf8")
}

/** Backs up `.agent/` into `agent-backup/harness-<timestamp>.zip` (folder fallback if zip unavailable). */
export function backupAgentDirBeforeOverwrite(
  projectRoot: string,
  agentDir: string,
): string | null {
  if (!fs.existsSync(agentDir)) {
    return null
  }

  const root = path.resolve(projectRoot)
  const backupRoot = path.join(root, AGENT_BACKUP_DIR)
  fs.mkdirSync(backupRoot, { recursive: true })

  const stamp = backupStamp()
  const zipPath = path.join(backupRoot, `${BACKUP_PREFIX}${stamp}.zip`)
  const dirPath = path.join(backupRoot, `${BACKUP_PREFIX}${stamp}`)

  try {
    if (zipDirectory(agentDir, zipPath)) {
      pruneOldBackups(backupRoot)
      return zipPath
    }
    fs.cpSync(agentDir, dirPath, { recursive: true })
    pruneOldBackups(backupRoot)
    return dirPath
  } catch {
    return null
  }
}
