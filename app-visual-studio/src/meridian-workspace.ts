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
import { loadPlanningPayloadFromSqlite } from "./load-from-sqlite.js"

const US_FILENAME = /^US-\d{4}\.md$/i

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
  docsExists: boolean
  usCount: number
}

export function countUserStoriesInDocs(docsRoot: string, packageRoot?: string): number {
  const pkg = packageRoot ?? path.dirname(docsRoot)
  const fromDb = loadPlanningPayloadFromSqlite(pkg)
  if (fromDb && fromDb.stories.length > 0) {
    return fromDb.stories.length
  }
  const usDir = path.join(docsRoot, "us")
  if (!fs.existsSync(usDir)) {
    return 0
  }
  return fs
    .readdirSync(usDir, { withFileTypes: true })
    .filter((e) => e.isFile() && US_FILENAME.test(e.name)).length
}

function docsDirExists(docsDir: string): boolean {
  return fs.existsSync(docsDir) && fs.statSync(docsDir).isDirectory()
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
    docsExists,
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
