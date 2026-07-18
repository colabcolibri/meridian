import {
  parseEpicFile,
  parseSprintFile,
  parseUserStoryFile,
  parseVersionFile,
} from "@/domain/meridian/parser"
import type { Epic, ProductVersion, Sprint, UserStory } from "@/domain/meridian/types"
import { deriveBoardFromStories } from "@/domain/meridian/board-derive"
import type {
  MeridianProjectCore,
  MeridianProjectSupplement,
} from "@/features/folder/project-loader"

interface DeliveryExportFile {
  file: string
  raw: string
}

interface DeliveryExportPayload {
  packageRoot: string
  userStories: DeliveryExportFile[]
  epics: DeliveryExportFile[]
  versions: DeliveryExportFile[]
  sprints: DeliveryExportFile[]
}

export function resolvePackageRootFromDocsPath(docsPath: string): string {
  const normalized = docsPath.replace(/\/$/, "")
  if (normalized.endsWith("/docs")) {
    return normalized.slice(0, -"/docs".length)
  }
  return normalized
}

export async function probeMeridianDb(packageRoot: string): Promise<boolean> {
  try {
    const url = `/api/meridian/db?packageRoot=${encodeURIComponent(packageRoot)}&probe=1`
    const res = await fetch(url)
    if (!res.ok) return false
    const body = (await res.json()) as { ok?: boolean }
    return body.ok === true
  } catch {
    return false
  }
}

export async function fetchDeliveryExport(
  packageRoot: string,
): Promise<DeliveryExportPayload | null> {
  try {
    const url = `/api/meridian/db?packageRoot=${encodeURIComponent(packageRoot)}`
    const res = await fetch(url)
    if (!res.ok) return null
    return (await res.json()) as DeliveryExportPayload
  } catch {
    return null
  }
}

export function parseDeliveryExport(payload: DeliveryExportPayload): {
  userStories: UserStory[]
  epics: Epic[]
  versions: ProductVersion[]
  sprints: Sprint[]
} {
  const userStories = payload.userStories.map(({ file, raw }) =>
    parseUserStoryFile(file, raw),
  )
  const epics = payload.epics.map(({ file, raw }) => parseEpicFile(file, raw))
  const versions = payload.versions.map(({ file, raw }) => parseVersionFile(file, raw))
  const sprints = payload.sprints.map(({ file, raw }) => parseSprintFile(file, raw))
  return { userStories, epics, versions, sprints }
}

export async function loadMeridianProjectFromDb(
  packageRoot: string,
  loadPhaseDocs: () => Promise<MeridianProjectCore>,
): Promise<{
  core: MeridianProjectCore
  supplement: MeridianProjectSupplement
}> {
  const payload = await fetchDeliveryExport(packageRoot)
  if (!payload) {
    throw new Error("Could not load delivery data from SQLite.")
  }

  const { userStories, epics, versions, sprints } = parseDeliveryExport(payload)
  const phaseCore = await loadPhaseDocs()

  userStories.sort((a, b) => a.id.localeCompare(b.id))
  const board = deriveBoardFromStories(userStories)

  return {
    core: {
      phaseDocuments: phaseCore.phaseDocuments,
      userStories,
      board,
      issues: phaseCore.issues,
    },
    supplement: {
      epics,
      versions,
      sprints,
      decisionDays: [],
      issues: [],
    },
  }
}
