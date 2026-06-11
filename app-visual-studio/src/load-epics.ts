import * as fs from "node:fs"
import * as path from "node:path"

import { parseFrontmatterRecord, parseStringList } from "./load-frontmatter.js"
import { sortByIdAsc } from "./domain/sort-by-id.js"

export type EpicSummary = {
  id: string
  title: string
  versions: string[]
  status: string
  outcome: string
}

export function loadEpicSummaries(docsRoot: string): EpicSummary[] {
  const dir = path.join(docsRoot, "epics")
  if (!fs.existsSync(dir)) {
    return []
  }
  const out: EpicSummary[] = []
  for (const name of fs.readdirSync(dir)) {
    if (!/^EPIC-\d+\.md$/i.test(name)) {
      continue
    }
    const raw = fs.readFileSync(path.join(dir, name), "utf-8")
    const record = parseFrontmatterRecord(raw)
    if (!record) {
      continue
    }
    const id = typeof record.id === "string" ? record.id : name.replace(/\.md$/i, "")
    const title = typeof record.title === "string" ? record.title : id
    const status = typeof record.status === "string" ? record.status : "active"
    const outcome = typeof record.outcome === "string" ? record.outcome : ""
    const versions = parseStringList(record.versions)
    if (versions.length === 0 && typeof record.versions === "string") {
      const fromText = [...record.versions.matchAll(/\bv[\w.-]+/g)].map((m) => m[0])
      out.push({ id, title, versions: fromText, status, outcome })
      continue
    }
    out.push({ id, title, versions, status, outcome })
  }
  return sortByIdAsc(out)
}
