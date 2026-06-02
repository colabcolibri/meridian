import { describe, expect, it } from "vitest"

import { resolveKanbanColumn } from "@/domain/meridian/kanban-columns"
import type { UserStory } from "@/domain/meridian/types"

const baseStory: UserStory = {
  id: "US-0099",
  title: "Example",
  epic: "EPIC-01",
  version: "v1",
  status: "✅",
  moscow: "Must",
  dependsOn: [],
  doneWhen: "done",
  tests: "required",
  testsStatus: "pending",
}

describe("kanban columns", () => {
  it("derives 🧪 when tests_status is pending", () => {
    expect(resolveKanbanColumn(baseStory)).toBe("🧪")
  })

  it("keeps ✅ when tests_status is done", () => {
    expect(resolveKanbanColumn({ ...baseStory, testsStatus: "done" })).toBe("✅")
  })

  it("keeps ❌ even with pending tests", () => {
    expect(resolveKanbanColumn({ ...baseStory, status: "❌" })).toBe("❌")
  })

  it("ignores tests when tests: none", () => {
    expect(
      resolveKanbanColumn({
        ...baseStory,
        tests: "none",
        testsStatus: "n/a",
      }),
    ).toBe("✅")
  })
})
