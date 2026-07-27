import * as fs from "node:fs"
import * as path from "node:path"

const KIT_REL = path.join(".agent", "MERIDIAN.md")
const MANIFEST_REL = path.join(".meridian", "projects.json")
const US_FILENAME = /^US-\d{4}\.md$/i

const IGNORED_DIR_NAMES = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  "bundled",
  ".agent",
  "coverage",
  ".next",
  ".turbo",
  "out",
  ".cache",
  "vendor",
])

const MAX_SCAN_DEPTH = 12

export type MeridianProject = {
  id: string
  name: string
  /** Relative to kit root, always ends with `/docs` or `docs` */
  docs: string
  /** Parent folder of docs (`.` = kit root) */
  packageRoot: string
  source: "manifest" | "discovered"
}

export type ProjectsManifest = {
  version?: number
  default?: string
  projects?: Array<{ id: string; name: string; docs: string }>
  exclude?: string[]
}

export function kitFileAt(root: string): string {
  return path.join(root, KIT_REL)
}

export function findKitRoot(startPath: string): string | null {
  let current = path.resolve(startPath)
  for (;;) {
    if (fs.existsSync(kitFileAt(current))) {
      return current
    }
    const parent = path.dirname(current)
    if (parent === current) {
      return null
    }
    current = parent
  }
}

function agentScriptsDirHasKit(scriptsDir: string): boolean {
  return (
    fs.existsSync(path.join(scriptsDir, "meridian_db_export.py")) ||
    fs.existsSync(path.join(scriptsDir, "meridian_import_graph.py"))
  )
}

/** Walk ancestors until `.agent/scripts` has Meridian kit CLIs (shared kit in monorepos). */
export function findKitScriptsRoot(startPath: string): string | null {
  let current = path.resolve(startPath)
  for (;;) {
    const scriptsDir = path.join(current, ".agent", "scripts")
    if (agentScriptsDirHasKit(scriptsDir)) {
      return current
    }
    const parent = path.dirname(current)
    if (parent === current) {
      return null
    }
    current = parent
  }
}

export function toPosixRel(kitRoot: string, absPath: string): string {
  const rel = path.relative(kitRoot, absPath)
  if (rel === "") {
    return "."
  }
  return rel.split(path.sep).join("/")
}

export function isMeridianDocs(docsDir: string): boolean {
  if (!fs.existsSync(docsDir) || !fs.statSync(docsDir).isDirectory()) {
    return false
  }
  if (fs.existsSync(path.join(docsDir, "00_scope.md"))) {
    return true
  }
  const usDir = path.join(docsDir, "us")
  if (!fs.existsSync(usDir) || !fs.statSync(usDir).isDirectory()) {
    return false
  }
  return fs.readdirSync(usDir).some((name) => US_FILENAME.test(name))
}

function docsDirExists(docsDir: string): boolean {
  return fs.existsSync(docsDir) && fs.statSync(docsDir).isDirectory()
}

export function defaultIdFromDocsRel(docsRel: string): string {
  const parent = path.posix.dirname(docsRel.replace(/\\/g, "/"))
  if (parent === "." || parent === "") {
    return "main"
  }
  return parent.replace(/\//g, "-")
}

export function defaultNameFromDocsRel(docsRel: string): string {
  const parent = path.posix.dirname(docsRel.replace(/\\/g, "/"))
  if (parent === "." || parent === "") {
    return "Main"
  }
  const base = parent.split("/").pop() ?? parent
  return base
}

function normalizeDocsRel(docsRel: string): string {
  return docsRel.replace(/\\/g, "/").replace(/\/+$/, "")
}

export function readProjectsManifest(kitRoot: string): ProjectsManifest | null {
  const manifestPath = path.join(kitRoot, MANIFEST_REL)
  if (!fs.existsSync(manifestPath)) {
    return null
  }
  try {
    const raw = fs.readFileSync(manifestPath, "utf8")
    return JSON.parse(raw) as ProjectsManifest
  } catch {
    return null
  }
}

export function discoverMeridianProjects(kitRoot: string): MeridianProject[] {
  const found: MeridianProject[] = []

  function walk(dir: string, depth: number): void {
    if (depth > MAX_SCAN_DEPTH) {
      return
    }
    let entries: fs.Dirent[]
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue
      }
      if (IGNORED_DIR_NAMES.has(entry.name)) {
        continue
      }

      const full = path.join(dir, entry.name)

      if (entry.name === "docs") {
        if (isMeridianDocs(full)) {
          const docsRel = normalizeDocsRel(toPosixRel(kitRoot, full))
          const packageRoot = normalizeDocsRel(
            toPosixRel(kitRoot, path.dirname(full)),
          )
          found.push({
            id: defaultIdFromDocsRel(docsRel),
            name: defaultNameFromDocsRel(docsRel),
            docs: docsRel,
            packageRoot: packageRoot === "" ? "." : packageRoot,
            source: "discovered",
          })
        }
        continue
      }

      walk(full, depth + 1)
    }
  }

  walk(kitRoot, 0)
  return found
}

function manifestToProject(
  kitRoot: string,
  entry: { id: string; name: string; docs: string },
): MeridianProject | null {
  const docsRel = normalizeDocsRel(entry.docs)
  const docsAbs = path.join(kitRoot, ...docsRel.split("/"))
  if (!docsDirExists(docsAbs)) {
    return null
  }
  const packageRoot = normalizeDocsRel(toPosixRel(kitRoot, path.dirname(docsAbs)))
  return {
    id: entry.id,
    name: entry.name,
    docs: docsRel,
    packageRoot: packageRoot === "" ? "." : packageRoot,
    source: "manifest",
  }
}

export function applyExclude(
  projects: MeridianProject[],
  exclude: string[] | undefined,
): MeridianProject[] {
  if (!exclude?.length) {
    return projects
  }
  const excluded = new Set(exclude.map((e) => normalizeDocsRel(e)))
  return projects.filter((p) => !excluded.has(p.docs))
}

export function mergeMeridianProjects(
  kitRoot: string,
  manifest: ProjectsManifest | null,
  discovered: MeridianProject[],
): MeridianProject[] {
  const byDocs = new Map<string, MeridianProject>()

  for (const entry of manifest?.projects ?? []) {
    const project = manifestToProject(kitRoot, entry)
    if (project) {
      byDocs.set(project.docs, project)
    }
  }

  for (const project of discovered) {
    if (!byDocs.has(project.docs)) {
      byDocs.set(project.docs, project)
    }
  }

  const merged = [...byDocs.values()].sort((a, b) =>
    a.docs.localeCompare(b.docs),
  )
  return applyExclude(merged, manifest?.exclude)
}

export function resolveMeridianProjects(kitRoot: string): MeridianProject[] {
  const manifest = readProjectsManifest(kitRoot)
  const discovered = discoverMeridianProjects(kitRoot)
  return mergeMeridianProjects(kitRoot, manifest, discovered)
}

/** Prefer project whose package or docs matches the opened workspace folder. */
export function matchProjectForWorkspacePath(
  projects: MeridianProject[],
  kitRoot: string,
  workspacePath: string,
): MeridianProject | null {
  const normalized = path.resolve(workspacePath)
  const kit = path.resolve(kitRoot)

  for (const project of projects) {
    const packageAbs = path.join(kit, ...project.packageRoot.split("/"))
    const docsAbs = path.join(kit, ...project.docs.split("/"))
    if (normalized === packageAbs || normalized === docsAbs) {
      return project
    }
    if (
      normalized.startsWith(packageAbs + path.sep) ||
      normalized.startsWith(docsAbs + path.sep)
    ) {
      return project
    }
  }

  const localDocs = path.join(normalized, "docs")
  if (isMeridianDocs(localDocs)) {
    const docsRel = normalizeDocsRel(toPosixRel(kit, localDocs))
    return (
      projects.find((p) => p.docs === docsRel) ?? {
        id: defaultIdFromDocsRel(docsRel),
        name: defaultNameFromDocsRel(docsRel),
        docs: docsRel,
        packageRoot: normalizeDocsRel(toPosixRel(kit, normalized)),
        source: "discovered",
      }
    )
  }

  return null
}

export function pickDefaultProjectId(
  projects: MeridianProject[],
  manifest: ProjectsManifest | null,
  preferredId: string | undefined,
): string | undefined {
  if (projects.length === 0) {
    return undefined
  }
  if (preferredId && projects.some((p) => p.id === preferredId)) {
    return preferredId
  }
  if (manifest?.default && projects.some((p) => p.id === manifest.default)) {
    return manifest.default
  }
  if (projects.length === 1) {
    return projects[0].id
  }
  return undefined
}

export function projectById(
  projects: MeridianProject[],
  id: string,
): MeridianProject | undefined {
  return projects.find((p) => p.id === id)
}
