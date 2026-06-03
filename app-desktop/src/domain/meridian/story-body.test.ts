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

const documentedBody = `## Record

### Files

- \`src/features/monitor/KanbanView.tsx\` — compact cards

### Backend

- _n/a_

### Frontend

- _n/a_

### Scripts / Docs

- _n/a_
`

describe("story-body tests", () => {
  it("lists items in ### Planned under ## Plan", () => {
    const body = `## Plan

### Planned

- [ ] **build** — \`pnpm build\`
- [x] **manual** — open app
`
    expect(getPlannedTestLines(body)).toHaveLength(2)
  })

  it("blocks status ✅ with tests_status pending", () => {
    const body = `## Plan

### Planned

- [ ] **build** — \`pnpm build\`

## Record

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
    const body = `## Plan

### Planned

- [ ] **build** — \`pnpm build\`

## Record

### Executed

_(pending)_
`
    expect(validateStoryBody({ ...baseStory, testsStatus: "done" }, body)).toEqual(
      expect.arrayContaining([
        expect.stringContaining("Planned marked [x]"),
        expect.stringContaining("Executed"),
      ]),
    )
  })

  it("accepts complete closure", () => {
    const body = `${documentedBody}

### Executed

- \`pnpm build\` — ok

## Plan

### Planned

- [x] **build** — \`pnpm build\`
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

  it("detects missing record section", () => {
    expect(
      getTechnicalImplementationStatus("## Intent\n\n### Acceptance\n\n- [x] ok\n"),
    ).toBe("missing")
  })

  it("detects placeholder record", () => {
    const body = `## Record

### Files

_(fill in when implementation is complete)_
`
    expect(getTechnicalImplementationStatus(body)).toBe("placeholder")
  })

  it("detects documented record with ### Files paths", () => {
    expect(getTechnicalImplementationStatus(documentedBody)).toBe("documented")
  })

  it("detects documented table-style record", () => {
    const body = `## Record

| Layer | Files |
| ----- | ----- |
| UI | \`src/DecisionsView.tsx\`, \`src/MonitorDashboard.tsx\` |
`
    expect(getTechnicalImplementationStatus(body)).toBe("documented")
  })

  it("marks frontend-only record as incomplete", () => {
    const body = `## Record

### Frontend

- \`collectProtocolIssues\`, \`MonitorIssuesBanner\`.
`
    expect(getTechnicalImplementationStatus(body)).toBe("incomplete")
  })

  it("requires ### Files paths for status ✅", () => {
    const body = `## Plan

### Planned

- [x] **manual** — ok

## Record

### Executed

- manual ok
`
    const messages = validateStoryBody(
      { status: "✅", tests: "required", testsStatus: "done" },
      body,
    )
    expect(messages).toContain(
      "Record: status ✅ requires ## Record with ### Files and real paths (/complete-us).",
    )
  })

  it("warns on partial US without record", () => {
    const body = `## Intent

### Acceptance

- [ ] Partial — Missing: tests

## Plan

### Planned

- [ ] **manual** — pending
`
    const messages = validateStoryBody(
      { status: "🔶", tests: "required", testsStatus: "pending" },
      body,
    )
    expect(messages).toContain(
      "Record: partial US missing touched-files record (fill in via /complete-us).",
    )
  })

  it("does not alert record for status ❌", () => {
    const messages = validateStoryBody(
      { status: "❌", tests: "required", testsStatus: "pending" },
      "",
    )
    expect(messages.some((message) => message.startsWith("Record:"))).toBe(false)
  })

  it("resolves implementation badge for kanban cards", () => {
    expect(resolveStoryDocumentationBadge({ status: "✅" }, documentedBody)).toBe(
      "impl-ok",
    )
    expect(resolveStoryDocumentationBadge({ status: "❌" }, documentedBody)).toBe(null)
    expect(
      resolveStoryDocumentationBadge(
        { status: "✅" },
        "## Intent\n\n### Acceptance\n\n- [x] ok\n",
      ),
    ).toBe("impl-missing")
    expect(
      resolveStoryDocumentationBadge(
        { status: "✅" },
        "## Record\n\n### Frontend\n\n- only prose\n",
      ),
    ).toBe("impl-missing")
  })
})
