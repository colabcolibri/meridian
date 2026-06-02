import { describe, expect, it } from "vitest"

import {
  collectDocumentProtocolIssues,
  collectStoryProtocolIssues,
} from "@/domain/meridian/protocol-validators"
import { acceptanceHasMissing, validateStoryBody } from "@/domain/meridian/story-body"
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
    expect(acceptanceHasMissing(body)).toBe(false)
    expect(
      validateStoryBody({ status: "🔶", tests: "none", testsStatus: "n/a" }, body),
    ).toEqual(
      expect.arrayContaining([
        'Status 🔶 requires "Missing:" in the Acceptance section.',
        "Technical implementation: partial US missing touched-files record (fill in via /complete-us).",
      ]),
    )
  })

  it("emits warning severity for partial US without technical implementation", () => {
    const stories: UserStory[] = [
      {
        id: "US-0099",
        title: "Partial",
        epic: "EPIC-04",
        version: "v2",
        status: "🔶",
        moscow: "Must",
        dependsOn: [],
        doneWhen: "done",
        tests: "none",
        testsStatus: "n/a",
      },
    ]
    const bodies = new Map([
      ["US-0099", `## Acceptance\n\n- [ ] Partial — Missing: doc\n`],
    ])

    const issues = collectStoryProtocolIssues(stories, bodies)
    const implIssue = issues.find((issue) =>
      issue.message.startsWith("Technical implementation:"),
    )
    expect(implIssue?.severity).toBe("warning")
    expect(implIssue?.file).toBe("us/US-0099.md")
    expect(implIssue?.targetId).toBe("US-0099")
  })

  it("emits error severity for complete US without technical implementation", () => {
    const stories: UserStory[] = [
      {
        id: "US-0100",
        title: "Done",
        epic: "EPIC-04",
        version: "v2",
        status: "✅",
        moscow: "Must",
        dependsOn: [],
        doneWhen: "done",
        tests: "none",
        testsStatus: "n/a",
      },
    ]
    const bodies = new Map([["US-0100", "## Acceptance\n\n- [x] ok\n"]])

    const issues = collectStoryProtocolIssues(stories, bodies)
    const implIssue = issues.find((issue) =>
      issue.message.startsWith("Technical implementation:"),
    )
    expect(implIssue?.severity).toBe("error")
  })
})
