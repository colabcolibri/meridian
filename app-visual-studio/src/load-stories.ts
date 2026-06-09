import * as fs from "node:fs"
import * as path from "node:path"

import { parseUserStoryFile } from "./domain/parse-us.js"
import type { UserStory } from "./domain/types.js"

export function loadUserStoriesFromDocs(docsRoot: string): UserStory[] {
  const usDir = path.join(docsRoot, "us")
  if (!fs.existsSync(usDir)) {
    return []
  }
  const stories: UserStory[] = []
  for (const name of fs.readdirSync(usDir)) {
    if (!/^US-\d+\.md$/i.test(name)) {
      continue
    }
    const raw = fs.readFileSync(path.join(usDir, name), "utf-8")
    const story = parseUserStoryFile(name, raw)
    if (story) {
      stories.push(story)
    }
  }
  return stories.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }))
}
