import { describe, expect, it } from "vitest"

import type { BoardEntry } from "@/domain/meridian/board-types"
import {
  collectDocumentProtocolIssues,
  compareBoardWithStories,
} from "@/domain/meridian/protocol-validators"
import { acceptanceHasFalta, validateStoryBody } from "@/domain/meridian/story-body"
import type { PhaseDocument, UserStory } from "@/domain/meridian/types"

describe("protocol validators", () => {
  it("detecta doc approved com dependência aberta", () => {
    const documents: PhaseDocument[] = [
      {
        id: "07_architecture",
        title: "Arquitetura",
        phase: "Fase 2",
        status: "draft",
        dependsOn: [],
        blocks: [],
        purpose: "",
      },
      {
        id: "10_environments",
        title: "Ambientes",
        phase: "Fase 3",
        status: "approved",
        dependsOn: ["07_architecture"],
        blocks: [],
        purpose: "",
      },
    ]

    const issues = collectDocumentProtocolIssues(documents)
    expect(issues.some((issue) => issue.targetId === "10_environments")).toBe(true)
  })

  it("exige Falta no aceite quando US é 🔶", () => {
    const body = `## Aceite\n\n- [ ] Critério sem falta\n`
    expect(acceptanceHasFalta(body)).toBe(false)
    expect(validateStoryBody("🔶", body)).toHaveLength(1)
  })

  it("compara board.json com arquivos US", () => {
    const stories: UserStory[] = [
      {
        id: "US-001",
        title: "A",
        epic: "EPIC-01",
        version: "v0",
        status: "✅",
        moscow: "Must",
        dependsOn: [],
        doneWhen: "done",
      },
    ]
    const board: BoardEntry[] = [
      {
        ...stories[0],
        depends_on: [],
        done_when: "done",
        status: "❌",
      },
    ]

    const issues = compareBoardWithStories(stories, board)
    expect(issues.some((issue) => issue.message.includes("status"))).toBe(true)
  })
})
