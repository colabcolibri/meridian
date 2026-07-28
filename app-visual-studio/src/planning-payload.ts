import * as path from "node:path"

import {
  loadPlanningPayloadFromSqliteDetailed,
  sqliteDbExists,
} from "./load-from-sqlite.js"
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

export type PlanningLoadResult =
  | { ok: true; payload: PlanningPayload }
  | { ok: false; error: string }

function sqliteRequiredMessage(packageRoot: string): string {
  return (
    `Meridian: .meridian/meridian.db not found under ${packageRoot}.\n` +
    "Run: python3 .agent/scripts/meridian_delivery.py bootstrap"
  )
}

/** v10+: delivery data comes only from SQLite — no docs/us fallback. */
export function loadPlanningPayloadDetailed(
  docsRoot: string,
  packageRoot?: string,
): PlanningLoadResult {
  const pkg = packageRoot ?? path.dirname(docsRoot)
  if (!sqliteDbExists(pkg)) {
    return { ok: false, error: sqliteRequiredMessage(pkg) }
  }
  const fromDb = loadPlanningPayloadFromSqliteDetailed(pkg)
  if (fromDb.error || !fromDb.payload) {
    return {
      ok: false,
      error: fromDb.error ?? "Meridian: SQLite planning export failed.",
    }
  }
  if (fromDb.payload.stories.length === 0) {
    return { ok: false, error: "Meridian: meridian.db has zero user stories." }
  }
  return { ok: true, payload: fromDb.payload }
}

/** Throws if SQLite load fails — use loadPlanningPayloadDetailed when UI needs error text. */
export function loadPlanningPayload(docsRoot: string, packageRoot?: string): PlanningPayload {
  const result = loadPlanningPayloadDetailed(docsRoot, packageRoot)
  if (!result.ok) {
    throw new Error(result.error)
  }
  return result.payload
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
