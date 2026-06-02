import { describe, expect, it } from "vitest"

import {
  allPlannedTestsChecked,
  executadoHasEvidence,
  getPlannedTestLines,
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
    const body = `## Tests

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
})
