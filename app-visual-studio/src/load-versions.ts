import * as fs from "node:fs"
import * as path from "node:path"

import { parseFrontmatterRecord } from "./load-frontmatter.js"
import { sortByIdAsc } from "./domain/sort-by-id.js"

export type VersionSummary = { id: string; title: string; status: string }

export function loadVersionSummaries(docsRoot: string): VersionSummary[] {
  const dir = path.join(docsRoot, "versions")
  if (!fs.existsSync(dir)) {
    return []
  }
  const out: VersionSummary[] = []
  for (const name of fs.readdirSync(dir)) {
    if (!/^v[\w.-]+\.md$/i.test(name)) {
      continue
    }
    const raw = fs.readFileSync(path.join(dir, name), "utf-8")
    const record = parseFrontmatterRecord(raw)
    if (!record) {
      continue
    }
    const id = typeof record.id === "string" ? record.id : name.replace(/\.md$/i, "")
    const title = typeof record.title === "string" ? record.title : id
    const status = typeof record.status === "string" ? record.status : "planned"
    out.push({ id, title, status })
  }
  return sortByIdAsc(out)
}
