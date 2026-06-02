import { describe, expect, it } from "vitest"

import type { BoardEntry } from "@/domain/meridian/board-types"
import {
  collectDocumentProtocolIssues,
  compareBoardWithStories,
} from "@/domain/meridian/protocol-validators"
import { acceptanceHasFalta, validateStoryBody } from "@/domain/meridian/story-body"
import type { PhaseDocument, UserStory } from "@/domain/meridian/types"

describe("protocol validators", () => {
  it("detects doc approved with open dependency", () => {
    const documents: PhaseDocument[] = [
      {
        id: "05_architecture",
        title: "Architecture",
        phase: "Phase 2",
        status: "draft",
        dependsOn: [],
        blocks: [],
        purpose: "",
      },
      {
        id: "08_environments",
        title: "Environments",
        phase: "Phase 3",
        status: "approved",
        dependsOn: ["05_architecture"],
        blocks: [],
        purpose: "",
      },
    ]

    const issues = collectDocumentProtocolIssues(documents)
    expect(issues.some((issue) => issue.targetId === "08_environments")).toBe(true)
  })

  it("requires Missing in Acceptance when US is 🔶", () => {
    const body = `## Acceptance\n\n- [ ] Criterion without missing note\n`
    expect(acceptanceHasFalta(body)).toBe(false)
    expect(
      validateStoryBody({ status: "🔶", tests: "none", testsStatus: "n/a" }, body),
    ).toHaveLength(1)
  })

  it("compares board.json with US files", () => {
    const stories: UserStory[] = [
      {
        id: "US-0001",
        title: "A",
        epic: "EPIC-01",
        version: "v0",
        status: "✅",
        moscow: "Must",
        dependsOn: [],
        doneWhen: "done",
        tests: "required",
        testsStatus: "done",
      },
    ]
    const board: BoardEntry[] = [
      {
        ...stories[0],
        depends_on: [],
        done_when: "done",
        status: "❌",
        tests: "required",
        tests_status: "done",
      },
    ]

    const issues = compareBoardWithStories(stories, board)
    expect(issues.some((issue) => issue.message.includes("status"))).toBe(true)
  })
})
