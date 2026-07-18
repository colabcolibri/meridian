import * as path from "node:path"

import { loadEpicSummaries } from "./load-epics.js"
import { loadPlanningPayloadFromSqlite } from "./load-from-sqlite.js"
import { loadSprintSummaries } from "./load-sprints.js"
import { loadVersionSummaries } from "./load-versions.js"
import { loadUserStoriesFromDocs } from "./load-stories.js"
import { sortByIdAsc } from "./domain/sort-by-id.js"
import { allSelectedVersionIds } from "./domain/version-filter.js"
import type { EpicSummary } from "./load-epics.js"
import type { SprintSummary } from "./load-sprints.js"
import type { VersionSummary } from "./load-versions.js"
import type { UserStory } from "./domain/types.js"

export type PlanningPayload = {
  versions: VersionSummary[]
  epics: EpicSummary[]
  sprints: SprintSummary[]
  stories: UserStory[]
}

export function loadPlanningPayload(docsRoot: string, packageRoot?: string): PlanningPayload {
  const pkg = packageRoot ?? path.dirname(docsRoot)
  const fromDb = loadPlanningPayloadFromSqlite(pkg)
  if (fromDb && fromDb.stories.length > 0) {
    return fromDb
  }
  return {
    versions: loadVersionSummaries(docsRoot),
    epics: loadEpicSummaries(docsRoot),
    sprints: loadSprintSummaries(docsRoot),
    stories: loadUserStoriesFromDocs(docsRoot),
  }
}

/** Lists sorted by id (v0, v4-S2, EPIC-05); version chips default to all selected. */
export function planningPayloadForListViews(
  payload: PlanningPayload,
): PlanningPayload & { defaultVersions: string[] } {
  const versions = sortByIdAsc(payload.versions)
  return {
    ...payload,
    versions,
    sprints: sortByIdAsc(payload.sprints),
    epics: sortByIdAsc(payload.epics),
    defaultVersions: allSelectedVersionIds(versions.map((v) => v.id)),
  }
}

export function planningPayloadForVersionsView(payload: PlanningPayload): PlanningPayload {
  return {
    ...payload,
    versions: sortByIdAsc(payload.versions),
  }
}
