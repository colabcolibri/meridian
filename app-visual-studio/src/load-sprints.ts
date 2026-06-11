import * as fs from "node:fs"
import * as path from "node:path"

import { parseFrontmatterRecord, parseStringList } from "./load-frontmatter.js"
import { sortByIdAsc } from "./domain/sort-by-id.js"

export type SprintSummary = {
  id: string
  title: string
  version: string
  status: string
  goal: string
  doneWhen: string
  storyIds: string[]
}

export function loadSprintSummaries(docsRoot: string): SprintSummary[] {
  const dir = path.join(docsRoot, "sprints")
  if (!fs.existsSync(dir)) {
    return []
  }
  const out: SprintSummary[] = []
  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith(".md")) {
      continue
    }
    const raw = fs.readFileSync(path.join(dir, name), "utf-8")
    const record = parseFrontmatterRecord(raw)
    if (!record) {
      continue
    }
    const id = typeof record.id === "string" ? record.id : name.replace(/\.md$/i, "")
    const title = typeof record.title === "string" ? record.title : id
    const version = typeof record.version === "string" ? record.version : ""
    const status = typeof record.status === "string" ? record.status : "planned"
    const goal = typeof record.goal === "string" ? record.goal : ""
    const doneWhen = typeof record.done_when === "string" ? record.done_when : ""
    const storyIds = parseStringList(record.stories)
    if (!version) {
      continue
    }
    out.push({ id, title, version, status, goal, doneWhen, storyIds })
  }
  return sortByIdAsc(out)
}
