import * as fs from "node:fs"
import * as path from "node:path"

import type { UserStory } from "./domain/types.js"

export type BoardJsonEntry = {
  id: string
  title: string
  epic: string
  version: string
  status: UserStory["status"]
  moscow: UserStory["moscow"]
  depends_on: string[]
  done_when: string
  tests: UserStory["tests"]
  tests_status: UserStory["testsStatus"]
  ready: boolean
}

export function storyToBoardEntry(story: UserStory): BoardJsonEntry {
  return {
    id: story.id,
    title: story.title,
    epic: story.epic,
    version: story.version,
    status: story.status,
    moscow: story.moscow,
    depends_on: story.dependsOn,
    done_when: story.doneWhen,
    tests: story.tests,
    tests_status: story.testsStatus,
    ready: story.ready === true,
  }
}

export function storiesToBoardEntries(stories: UserStory[]): BoardJsonEntry[] {
  return stories.map(storyToBoardEntry)
}

export type WriteBoardResult = {
  written: number
  boardPath: string
}

export function writeBoardJson(docsRoot: string, stories: UserStory[]): WriteBoardResult {
  const kanbanDir = path.join(docsRoot, "kanban")
  fs.mkdirSync(kanbanDir, { recursive: true })
  const boardPath = path.join(kanbanDir, "board.json")
  const entries = storiesToBoardEntries(stories)
  fs.writeFileSync(boardPath, `${JSON.stringify(entries, null, 2)}\n`, "utf-8")
  return { written: entries.length, boardPath }
}
