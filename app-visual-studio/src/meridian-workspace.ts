import * as fs from "node:fs"
import * as path from "node:path"

import {
  findKitRoot,
  isMeridianDocs,
  matchProjectForWorkspacePath,
  pickDefaultProjectId,
  projectById,
  readProjectsManifest,
  resolveMeridianProjects,
  type MeridianProject,
} from "./resolve-meridian-projects.js"
import { loadPlanningPayloadFromSqliteDetailed, sqliteDbExists } from "./load-from-sqlite.js"

export type MeridianProjectSummary = {
  id: string
  name: string
  docs: string
  packageRoot: string
  source: MeridianProject["source"]
  usCount: number
  isActive: boolean
}

export type MeridianWorkspaceInfo = {
  projectRoot: string
  docsRoot: string
  packageRoot: string
  projectId: string
  projectName: string
  projects: MeridianProjectSummary[]
  kitDetected: true
  kitInstalled: boolean
  docsExists: boolean
  meridianDbExists: boolean
  cursorAdaptersSynced: boolean
  usCount: number
}

export function countUserStoriesInDocs(docsRoot: string, packageRoot?: string): number {
  const pkg = packageRoot ?? path.dirname(docsRoot)
  if (!sqliteDbExists(pkg)) {
    return 0
  }
  const fromDb = loadPlanningPayloadFromSqliteDetailed(pkg)
  return fromDb.payload?.stories.length ?? 0
}

function docsDirExists(docsDir: string): boolean {
  return fs.existsSync(docsDir) && fs.statSync(docsDir).isDirectory()
}

function cursorAdaptersSynced(kitRoot: string): boolean {
  const workflows = path.join(kitRoot, ".agent", "workflows")
  const commands = path.join(kitRoot, ".cursor", "commands")
  if (!fs.existsSync(workflows) || !fs.existsSync(commands)) {
    return false
  }
  const workflowCount = fs.readdirSync(workflows).filter((n) => n.endsWith(".md")).length
  const commandCount = fs.readdirSync(commands).filter((n) => n.endsWith(".md")).length
  return workflowCount > 0 && workflowCount === commandCount
}

function buildInfo(
  kitRoot: string,
  project: MeridianProject,
  allProjects: MeridianProject[],
): MeridianWorkspaceInfo {
  const docsRoot = path.join(kitRoot, ...project.docs.split("/"))
  const packageRoot = path.join(kitRoot, ...project.packageRoot.split("/"))
  const docsExists = docsDirExists(docsRoot)

  const projects: MeridianProjectSummary[] = allProjects.map((p) => {
    const pDocs = path.join(kitRoot, ...p.docs.split("/"))
    const exists = docsDirExists(pDocs)
    return {
      id: p.id,
      name: p.name,
      docs: p.docs,
      packageRoot: p.packageRoot,
      source: p.source,
      usCount: exists ? countUserStoriesInDocs(pDocs, path.join(kitRoot, ...p.packageRoot.split("/"))) : 0,
      isActive: p.id === project.id,
    }
  })

  return {
    projectRoot: kitRoot,
    docsRoot,
    packageRoot,
    projectId: project.id,
    projectName: project.name,
    projects,
    kitDetected: true,
    kitInstalled: fs.existsSync(path.join(kitRoot, ".agent", "MERIDIAN.md")),
    docsExists,
    meridianDbExists: sqliteDbExists(packageRoot),
    cursorAdaptersSynced: cursorAdaptersSynced(kitRoot),
    usCount: docsExists ? countUserStoriesInDocs(docsRoot, packageRoot) : 0,
  }
}

export function resolveActiveProject(
  kitRoot: string,
  workspacePath: string,
  storedActiveId: string | undefined,
  configuredActiveId?: string,
): MeridianProject | null {
  const all = resolveMeridianProjects(kitRoot)
  if (all.length === 0) {
    return null
  }

  const manifest = readProjectsManifest(kitRoot)
  const fromWorkspace = matchProjectForWorkspacePath(all, kitRoot, workspacePath)
  const preferred = configuredActiveId ?? storedActiveId ?? fromWorkspace?.id
  const defaultId = pickDefaultProjectId(all, manifest, preferred)
  if (defaultId) {
    return projectById(all, defaultId) ?? all[0]
  }
  return all[0] ?? null
}

/** Aligns with `validate_meridian.py` kit detection (`.agent/MERIDIAN.md`). */
export function resolveMeridianWorkspaceFromPaths(
  workspacePath: string,
  storedActiveId?: string,
  configuredActiveId?: string,
): MeridianWorkspaceInfo | null {
  const normalized = path.resolve(workspacePath)
  const kitRoot = findKitRoot(normalized)
  if (!kitRoot) {
    return null
  }

  const all = resolveMeridianProjects(kitRoot)
  let active = resolveActiveProject(
    kitRoot,
    normalized,
    storedActiveId,
    configuredActiveId,
  )

  if (!active && normalized !== kitRoot && isMeridianDocs(path.join(normalized, "docs"))) {
    const docsRel = path.relative(kitRoot, path.join(normalized, "docs")).split(path.sep).join("/")
    const packageRel = path.relative(kitRoot, normalized).split(path.sep).join("/") || "."
    active = {
      id: packageRel === "." ? "main" : packageRel.replace(/\//g, "-"),
      name: path.basename(normalized),
      docs: docsRel,
      packageRoot: packageRel,
      source: "discovered",
    }
  }

  if (!active) {
    active = {
      id: "main",
      name: "Main",
      docs: "docs",
      packageRoot: ".",
      source: "discovered",
    }
  }

  const projectList = all.length ? all : [active]
  const resolved = projectById(projectList, active.id) ?? active
  return buildInfo(kitRoot, resolved, projectList)
}

export function formatStatusTooltip(info: MeridianWorkspaceInfo): string {
  const lines = [
    "Meridian kit: detected",
    `Kit root: ${info.projectRoot}`,
    `Active project: ${info.projectName} (${info.projectId})`,
    `Docs: ${info.docsRoot}`,
    `Package: ${info.packageRoot}`,
  ]
  if (info.projects.length > 1) {
    lines.push("Projects:")
    for (const p of info.projects) {
      const mark = p.isActive ? "•" : " "
      lines.push(
        `  ${mark} ${p.name} [${p.id}] → ${p.docs} (${p.usCount} US, ${p.source})`,
      )
    }
    lines.push("Switch: Meridian: Select Active Project")
  }
  if (!info.docsExists) {
    lines.push("Warning: docs/ folder missing or empty")
  } else {
    lines.push(`User stories (active): ${info.usCount}`)
  }
  return lines.join("\n")
}
