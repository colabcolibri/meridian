import { describe, expect, it } from "vitest"

import { deriveBoardFromStories } from "@/domain/meridian/board-derive"
import type { UserStory } from "@/domain/meridian/types"

function makeStory(id: string): UserStory {
  return {
    id,
    title: id,
    epic: "EPIC-01",
    version: "v0",
    status: "❌",
    moscow: "Must",
    dependsOn: [],
    doneWhen: "done",
    tests: "required",
    testsStatus: "pending",
  }
}

describe("deriveBoardFromStories", () => {
  it("sorts by numeric id and maps frontmatter fields", () => {
    const board = deriveBoardFromStories([
      makeStory("US-0010"),
      makeStory("US-0002"),
      makeStory("US-10000"),
    ])

    expect(board.map((entry) => entry.id)).toEqual(["US-0002", "US-0010", "US-10000"])
    expect(board[0]).toMatchObject({
      id: "US-0002",
      depends_on: [],
      done_when: "done",
      tests_status: "pending",
    })
  })

  it("handles large batches without dropping entries", () => {
    const stories = Array.from({ length: 5000 }, (_, index) =>
      makeStory(`US-${String(index + 1).padStart(5, "0")}`),
    )

    const board = deriveBoardFromStories(stories)

    expect(board).toHaveLength(5000)
    expect(board[0]?.id).toBe("US-00001")
    expect(board.at(-1)?.id).toBe("US-05000")
  })
})
