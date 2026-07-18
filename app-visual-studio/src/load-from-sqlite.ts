import { execFileSync } from "node:child_process"
import * as fs from "node:fs"
import * as path from "node:path"

import type { EpicSummary } from "./load-epics.js"
import type { SprintSummary } from "./load-sprints.js"
import type { VersionSummary } from "./load-versions.js"
import type { UserStory } from "./domain/types.js"
import type { PlanningPayload } from "./planning-payload.js"

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

function kitRootFromPackageRoot(packageRoot: string): string {
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

export function loadPlanningPayloadFromSqlite(packageRoot: string): PlanningPayload | null {
  if (!sqliteDbExists(packageRoot)) {
    return null
  }
  const kitRoot = kitRootFromPackageRoot(packageRoot)
  const script = path.join(kitRoot, ".agent", "scripts", "meridian_db_export.py")
  if (!fs.existsSync(script)) {
    return null
  }
  try {
    const stdout = execFileSync(
      "python3",
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
      stories: s.stories ?? [],
    }))
    return { versions, epics, sprints, stories }
  } catch {
    return null
  }
}
