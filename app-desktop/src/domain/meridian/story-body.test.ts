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
    const body = `## Technical implementation

### Frontend

- \`src/App.tsx\` — shell

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

### Backend

_(fill in when applicable)_
`
    expect(getTechnicalImplementationStatus(body)).toBe("placeholder")
  })

  it("detects documented technical implementation with file paths", () => {
    const body = `## Technical implementation

### Files

- \`src/features/monitor/KanbanView.tsx\` — compact cards

### Backend

- _n/a_
`
    expect(getTechnicalImplementationStatus(body)).toBe("documented")
  })

  it("detects documented table-style technical implementation", () => {
    const body = `## Technical implementation

| Layer | Files |
| ----- | ----- |
| UI | \`DecisionsView.tsx\`, \`MonitorDashboard.tsx\` |
`
    expect(getTechnicalImplementationStatus(body)).toBe("documented")
  })

  it("requires technical implementation for status ✅", () => {
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
      "Technical implementation: status ✅ requires ## Technical implementation filled (files + layers).",
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
      "Technical implementation: partial US has no implementation record yet (fill on close).",
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

  it("resolves documentation badge for kanban cards", () => {
    const documentedBody = `## Technical implementation

### Files

- \`src/App.tsx\` — shell
`
    expect(resolveStoryDocumentationBadge({ status: "✅" }, documentedBody)).toBe("doc")
    expect(resolveStoryDocumentationBadge({ status: "❌" }, documentedBody)).toBe(null)
    expect(
      resolveStoryDocumentationBadge({ status: "✅" }, "## Acceptance\n\n- [x] ok\n"),
    ).toBe("sem-doc")
    expect(
      resolveStoryDocumentationBadge(
        { status: "🔶" },
        "## Technical implementation\n\n_(fill in when applicable)_\n",
      ),
    ).toBe("sem-doc")
  })
})
