import { describe, expect, it } from "vitest"

import {
  allPlannedTestsChecked,
  executadoHasEvidence,
  getPlannedTestLines,
  getTechnicalImplementationStatus,
  resolveStoryDocumentationBadge,
  validateStoryBody,
} from "@/domain/meridian/story-body"
import type { UserStory } from "@/domain/meridian/types"

const baseStory: Pick<UserStory, "status" | "tests" | "testsStatus"> = {
  status: "✅",
  tests: "required",
  testsStatus: "done",
}

const documentedBody = `## Technical implementation

### Files

- \`src/features/monitor/KanbanView.tsx\` — compact cards

### Backend

- _n/a_
`

describe("story-body tests", () => {
  it("lists items in ### Planned", () => {
    const body = `## Tests

### Planned

- [ ] **build** — \`pnpm build\`
- [x] **manual** — open app
`
    expect(getPlannedTestLines(body)).toHaveLength(2)
  })

  it("blocks status ✅ with tests_status pending", () => {
    const body = `## Tests

### Planned

- [ ] **build** — \`pnpm build\`

### Executed

_(pending)_
`
    const messages = validateStoryBody(
      { status: "✅", tests: "required", testsStatus: "pending" },
      body,
    )
    expect(messages.some((m) => m.includes("tests_status: done"))).toBe(true)
  })

  it("requires planned [x] and executed when tests_status done", () => {
    const body = `## Tests

### Planned

- [ ] **build** — \`pnpm build\`

### Executed

_(pending)_
`
    expect(validateStoryBody({ ...baseStory, testsStatus: "done" }, body)).toEqual(
      expect.arrayContaining([
        expect.stringContaining("Planned marked [x]"),
        expect.stringContaining("Executed filled"),
      ]),
    )
  })

  it("accepts complete closure", () => {
    const body = `${documentedBody}

## Tests

### Planned

- [x] **build** — \`pnpm build\`

### Executed

- \`pnpm build\` — ok
`
    expect(allPlannedTestsChecked(body)).toBe(true)
    expect(executadoHasEvidence(body)).toBe(true)
    expect(validateStoryBody(baseStory, body)).toHaveLength(0)
  })

  it("tests: none requires tests_status n/a", () => {
    expect(
      validateStoryBody({ status: "✅", tests: "none", testsStatus: "pending" }, ""),
    ).toContain("tests: none requires tests_status: n/a.")
  })

  it("detects missing technical implementation section", () => {
    expect(getTechnicalImplementationStatus("## Acceptance\n\n- [x] ok\n")).toBe(
      "missing",
    )
  })

  it("detects placeholder technical implementation", () => {
    const body = `## Technical implementation

### Files

_(fill in when implementation is complete)_
`
    expect(getTechnicalImplementationStatus(body)).toBe("placeholder")
  })

  it("detects documented technical implementation with ### Files paths", () => {
    expect(getTechnicalImplementationStatus(documentedBody)).toBe("documented")
  })

  it("detects documented table-style technical implementation", () => {
    const body = `## Technical implementation

| Layer | Files |
| ----- | ----- |
| UI | \`src/DecisionsView.tsx\`, \`src/MonitorDashboard.tsx\` |
`
    expect(getTechnicalImplementationStatus(body)).toBe("documented")
  })

  it("marks legacy ### Frontend-only sections as incomplete", () => {
    const body = `## Technical implementation

### Frontend

- \`collectProtocolIssues\`, \`MonitorIssuesBanner\`.
`
    expect(getTechnicalImplementationStatus(body)).toBe("incomplete")
  })

  it("requires ### Files paths for status ✅", () => {
    const body = `## Tests

### Planned

- [x] **manual** — ok

### Executed

- manual ok
`
    const messages = validateStoryBody(
      { status: "✅", tests: "required", testsStatus: "done" },
      body,
    )
    expect(messages).toContain(
      "Technical implementation: status ✅ requires ## Technical implementation with ### Files and real paths (/complete-us).",
    )
  })

  it("warns on partial US without technical implementation", () => {
    const body = `## Acceptance

- [ ] Partial — Missing: tests

## Tests

### Planned

- [ ] **manual** — pending
`
    const messages = validateStoryBody(
      { status: "🔶", tests: "required", testsStatus: "pending" },
      body,
    )
    expect(messages).toContain(
      "Technical implementation: partial US missing touched-files record (fill in via /complete-us).",
    )
  })

  it("does not alert technical implementation for status ❌", () => {
    const messages = validateStoryBody(
      { status: "❌", tests: "required", testsStatus: "pending" },
      "",
    )
    expect(
      messages.some((message) => message.startsWith("Technical implementation:")),
    ).toBe(false)
  })

  it("resolves implementation badge for kanban cards", () => {
    expect(resolveStoryDocumentationBadge({ status: "✅" }, documentedBody)).toBe(
      "impl-ok",
    )
    expect(resolveStoryDocumentationBadge({ status: "❌" }, documentedBody)).toBe(null)
    expect(
      resolveStoryDocumentationBadge({ status: "✅" }, "## Acceptance\n\n- [x] ok\n"),
    ).toBe("impl-missing")
    expect(
      resolveStoryDocumentationBadge(
        { status: "✅" },
        "## Technical implementation\n\n### Frontend\n\n- only prose\n",
      ),
    ).toBe("impl-missing")
  })
})
