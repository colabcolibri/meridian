import { execFileSync } from "node:child_process"
import * as fs from "node:fs"
import * as path from "node:path"

import type { EpicSummary } from "./load-epics.js"
import type { SprintSummary } from "./load-sprints.js"
import type { VersionSummary } from "./load-versions.js"
import type { UserStory } from "./domain/types.js"
import type { PlanningPayload } from "./planning-payload.js"
import { resolveExportScriptPath } from "./resolve-kit-scripts.js"

type PlanningExport = {
  userStories: Array<{
    id: string
    title: string
    epic: string
    version: string
    status: UserStory["status"]
    moscow: UserStory["moscow"]
    dependsOn: string[]
    doneWhen: string
    tests: UserStory["tests"]
    testsStatus: UserStory["testsStatus"]
    ready: boolean
    summary: string | null
    preamble: string | null
  }>
  versions: Array<{
    id: string
    title: string
    status: string
    outcome: string
    summary: string | null
  }>
  epics: Array<{
    id: string
    title: string
    status: string
    outcome: string
    versions: string[]
    summary: string | null
  }>
  sprints: Array<{
    id: string
    version: string
    title: string
    status: string
    goal: string
    doneWhen: string
    stories: string[]
    summary: string | null
  }>
}

export function kitRootFromPackageRoot(packageRoot: string): string {
  const agent = path.join(packageRoot, ".agent", "MERIDIAN.md")
  if (fs.existsSync(agent)) {
    return packageRoot
  }
  const parent = path.dirname(packageRoot)
  if (fs.existsSync(path.join(parent, ".agent", "MERIDIAN.md"))) {
    return parent
  }
  return packageRoot
}

export function sqliteDbExists(packageRoot: string): boolean {
  return fs.existsSync(path.join(packageRoot, ".meridian", "meridian.db"))
}

export function resolvePythonCommand(): string {
  for (const cmd of ["python3", "python"]) {
    try {
      execFileSync(cmd, ["--version"], { encoding: "utf-8", stdio: "pipe" })
      return cmd
    } catch {
      continue
    }
  }
  return "python3"
}

export type SqlitePlanningResult = {
  payload: PlanningPayload | null
  error: string | null
}

export function loadPlanningPayloadFromSqlite(packageRoot: string): PlanningPayload | null {
  return loadPlanningPayloadFromSqliteDetailed(packageRoot).payload
}

export function loadPlanningPayloadFromSqliteDetailed(
  packageRoot: string,
  extensionPath?: string,
): SqlitePlanningResult {
  if (!sqliteDbExists(packageRoot)) {
    return { payload: null, error: null }
  }
  const script = resolveExportScriptPath(packageRoot, extensionPath)
  if (!script) {
    return {
      payload: null,
      error: `Kit script not found for ${packageRoot}`,
    }
  }
  const python = resolvePythonCommand()
  try {
    const stdout = execFileSync(
      python,
      [script, packageRoot, "--format", "planning"],
      { encoding: "utf-8", maxBuffer: 32 * 1024 * 1024 },
    )
    const data = JSON.parse(stdout) as PlanningExport
    const stories: UserStory[] = data.userStories.map((s) => ({
      id: s.id,
      title: s.title,
      epic: s.epic,
      version: s.version,
      status: s.status,
      moscow: s.moscow,
      dependsOn: s.dependsOn ?? [],
      doneWhen: s.doneWhen ?? "",
      tests: s.tests,
      testsStatus: s.testsStatus,
      ready: s.ready,
      preamble: s.preamble ?? null,
    }))
    const versions: VersionSummary[] = data.versions.map((v) => ({
      id: v.id,
      title: v.title,
      status: v.status,
      outcome: v.outcome,
    }))
    const epics: EpicSummary[] = data.epics.map((e) => ({
      id: e.id,
      title: e.title,
      status: e.status,
      outcome: e.outcome,
      versions: e.versions ?? [],
    }))
    const sprints: SprintSummary[] = data.sprints.map((s) => ({
      id: s.id,
      title: s.title,
      version: s.version,
      status: s.status,
      goal: s.goal,
      doneWhen: s.doneWhen,
      storyIds: s.stories ?? [],
    }))
    return { payload: { versions, epics, sprints, stories }, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return {
      payload: null,
      error: `SQLite export failed (${python}): ${message}`,
    }
  }
}
