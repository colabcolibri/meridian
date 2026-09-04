import * as fs from "node:fs"
import * as path from "node:path"

export const HARNESS_VERSION_FILE = "VERSION"
export const HARNESS_NOTES_FILE = "HARNESS_NOTES.md"
export const HARNESS_DISMISS_STATE_KEY = "meridian.harness.dismissedAvailableVersion"

export type HarnessRelation = "current" | "behind" | "ahead" | "source"

export type HarnessInspection = {
  relation: HarnessRelation
  installedVersion: string | null
  availableVersion: string
  notes: string
  skipPrompt: boolean
}

export function readVersionFile(agentDir: string): string | null {
  const file = path.join(agentDir, HARNESS_VERSION_FILE)
  if (!fs.existsSync(file)) {
    return null
  }
  const line = fs.readFileSync(file, "utf8").split(/\r?\n/)[0]?.trim() ?? ""
  return line.length > 0 ? line : null
}

export function readExtensionVersion(extensionPath: string): string {
  const pkgPath = path.join(extensionPath, "package.json")
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8")) as { version?: string }
  if (typeof pkg.version !== "string" || pkg.version.trim() === "") {
    throw new Error(`Missing version in ${pkgPath}`)
  }
  return pkg.version.trim()
}

export function parseFirstChangelogSection(markdown: string): string {
  const lines = markdown.split(/\r?\n/)
  const start = lines.findIndex((line) => /^## \[[^\]]+\]/.test(line.trim()))
  if (start < 0) {
    return ""
  }
  const body: string[] = []
  for (let i = start + 1; i < lines.length; i += 1) {
    if (/^## \[[^\]]+\]/.test(lines[i].trim())) {
      break
    }
    body.push(lines[i])
  }
  return body.join("\n").trim()
}

export function compareHarnessVersions(
  installed: string | null,
  available: string,
): "current" | "behind" | "ahead" | "unknown" {
  if (installed === null) {
    return "unknown"
  }
  const a = parseSemver(installed)
  const b = parseSemver(available)
  if (!a || !b) {
    return installed === available ? "current" : "unknown"
  }
  for (let i = 0; i < 3; i += 1) {
    if (a[i] < b[i]) {
      return "behind"
    }
    if (a[i] > b[i]) {
      return "ahead"
    }
  }
  return "current"
}

export function isHarnessSourceRepo(projectRoot: string): boolean {
  const agent = path.join(projectRoot, ".agent", "MERIDIAN.md")
  const pkgPath = path.join(projectRoot, "app-visual-studio", "package.json")
  if (!fs.existsSync(agent) || !fs.existsSync(pkgPath)) {
    return false
  }
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8")) as { name?: string }
    return pkg.name === "meridian-vscode"
  } catch {
    return false
  }
}

export function isSameAgentDirectory(left: string, right: string): boolean {
  try {
    return fs.realpathSync(left) === fs.realpathSync(right)
  } catch {
    return path.resolve(left) === path.resolve(right)
  }
}

export function readAvailableNotes(extensionPath: string): string {
  const bundledNotes = path.join(extensionPath, "bundled", "kit", ".agent", HARNESS_NOTES_FILE)
  if (fs.existsSync(bundledNotes)) {
    return fs.readFileSync(bundledNotes, "utf8").trim()
  }
  const changelog = path.join(extensionPath, "CHANGELOG.md")
  if (fs.existsSync(changelog)) {
    return parseFirstChangelogSection(fs.readFileSync(changelog, "utf8"))
  }
  return ""
}

export function stampWorkspaceHarness(agentDir: string, extensionPath: string): void {
  const version = readExtensionVersion(extensionPath)
  fs.writeFileSync(path.join(agentDir, HARNESS_VERSION_FILE), `${version}\n`, "utf8")
  const notes = readAvailableNotes(extensionPath)
  fs.writeFileSync(
    path.join(agentDir, HARNESS_NOTES_FILE),
    notes.length > 0 ? `${notes}\n` : `_Harness ${version}._\n`,
    "utf8",
  )
}

export function inspectHarness(
  projectRoot: string,
  extensionPath: string,
  bundledAgentDir: string,
): HarnessInspection | null {
  const agentDir = path.join(path.resolve(projectRoot), ".agent")
  if (!fs.existsSync(path.join(agentDir, "MERIDIAN.md"))) {
    return null
  }
  const availableVersion = readExtensionVersion(extensionPath)
  const installedVersion = readVersionFile(agentDir)
  const notes = readAvailableNotes(extensionPath)
  const skipPrompt =
    isHarnessSourceRepo(projectRoot) || isSameAgentDirectory(agentDir, bundledAgentDir)
  if (skipPrompt) {
    return {
      relation: "source",
      installedVersion,
      availableVersion,
      notes,
      skipPrompt: true,
    }
  }
  const cmp = compareHarnessVersions(installedVersion, availableVersion)
  const relation: HarnessRelation = cmp === "unknown" || cmp === "behind" ? "behind" : cmp
  return {
    relation,
    installedVersion,
    availableVersion,
    notes,
    skipPrompt: false,
  }
}

export function formatHarnessStatusLine(inspection: HarnessInspection): string | null {
  if (inspection.relation !== "behind") {
    return null
  }
  const from = formatInstalledHarnessLabel(inspection.installedVersion, "short")
  return `Meridian: harness ${from} → ${inspection.availableVersion}`
}

export function formatHarnessTooltip(inspection: HarnessInspection): string {
  const installed = formatInstalledHarnessLabel(inspection.installedVersion, "long")
  const lines = [
    `Harness in this folder: ${installed}`,
    `Extension bundle: ${inspection.availableVersion}`,
  ]
  if (inspection.relation === "source") {
    lines.push("This folder is the Meridian kit source. Upgrade Harness would overwrite git .agent/.")
    return lines.join("\n")
  }
  if (inspection.relation === "behind") {
    lines.push("A newer harness is in this extension. Run Meridian: Upgrade Harness to copy it.")
  } else if (inspection.relation === "ahead") {
    lines.push("This folder’s kit is newer than the extension. Upgrade would copy an older bundle.")
  } else {
    lines.push("Folder kit matches this extension.")
  }
  const bullets = plainHarnessNoteBullets(inspection.notes)
  if (bullets.length > 0) {
    lines.push("", "In this extension:", ...bullets.map((b) => `• ${b}`))
  }
  return lines.join("\n")
}

export function formatHarnessPrompt(inspection: HarnessInspection): string {
  const from = formatInstalledHarnessLabel(inspection.installedVersion, "long")
  const lines = [
    `Harness in this folder: ${from}. Extension bundle: ${inspection.availableVersion}.`,
    "Upgrade Harness copies agents, skills, and slash commands into .agent/. Reload does not.",
  ]
  const bullets = plainHarnessNoteBullets(inspection.notes).slice(0, 2)
  if (bullets.length > 0) {
    lines.push("", "What’s new:", ...bullets.map((b) => `• ${b}`))
  }
  return lines.join("\n")
}

/** Strip changelog/markdown into short plain bullets for notifications. */
export function plainHarnessNoteBullets(notes: string): string[] {
  const out: string[] = []
  for (const raw of notes.split(/\r?\n/)) {
    const line = raw.trim()
    if (!line || /^#{1,6}\s/.test(line)) {
      continue
    }
    const bullet = line
      .replace(/^[-*+]\s+/, "")
      .replace(/^\d+\.\s+/, "")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/^_(.+)_$/, "$1")
      .trim()
    if (bullet.length < 8) {
      continue
    }
  if (/^Added$|^Changed$|^Fixed$/i.test(bullet)) {
      continue
    }
    out.push(bullet)
  }
  return out
}

function formatInstalledHarnessLabel(
  version: string | null,
  style: "short" | "long",
): string {
  if (version) {
    return version
  }
  return style === "short" ? "legacy" : "not stamped (install before version tracking)"
}

function parseSemver(value: string): [number, number, number] | null {
  const match = value.trim().match(/^(\d+)\.(\d+)\.(\d+)/)
  if (!match) {
    return null
  }
  return [Number(match[1]), Number(match[2]), Number(match[3])]
}
