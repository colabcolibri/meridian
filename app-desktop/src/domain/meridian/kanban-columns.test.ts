import { describe, expect, it } from "vitest"

import { resolveKanbanColumn } from "@/domain/meridian/kanban-columns"
import type { UserStory } from "@/domain/meridian/types"

const baseStory: UserStory = {
  id: "US-0099",
  title: "Exemplo",
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
  it("deriva 🧪 quando tests_status é pending", () => {
    expect(resolveKanbanColumn(baseStory)).toBe("🧪")
  })

  it("mantém ✅ quando tests_status é done", () => {
    expect(resolveKanbanColumn({ ...baseStory, testsStatus: "done" })).toBe("✅")
  })

  it("mantém ❌ mesmo com tests pendente", () => {
    expect(resolveKanbanColumn({ ...baseStory, status: "❌" })).toBe("❌")
  })

  it("ignora tests quando tests: none", () => {
    expect(
      resolveKanbanColumn({
        ...baseStory,
        tests: "none",
        testsStatus: "n/a",
      }),
    ).toBe("✅")
  })
})
