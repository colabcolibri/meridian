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
  it("lista itens em ### Planejado", () => {
    const body = `## Testes

### Planejado

- [ ] **build** — \`pnpm build\`
- [x] **manual** — abrir app
`
    expect(getPlannedTestLines(body)).toHaveLength(2)
  })

  it("bloqueia status ✅ com tests_status pending", () => {
    const body = `## Testes

### Planejado

- [ ] **build** — \`pnpm build\`

### Executado

_(pendente)_
`
    const messages = validateStoryBody(
      { status: "✅", tests: "required", testsStatus: "pending" },
      body,
    )
    expect(messages.some((m) => m.includes("tests_status: done"))).toBe(true)
  })

  it("exige planejado [x] e executado quando tests_status done", () => {
    const body = `## Testes

### Planejado

- [ ] **build** — \`pnpm build\`

### Executado

_(pendente)_
`
    expect(validateStoryBody({ ...baseStory, testsStatus: "done" }, body)).toEqual(
      expect.arrayContaining([
        expect.stringContaining("Planejado marcados [x]"),
        expect.stringContaining("Executado preenchido"),
      ]),
    )
  })

  it("aceita fechamento completo", () => {
    const body = `## Testes

### Planejado

- [x] **build** — \`pnpm build\`

### Executado

- \`pnpm build\` — ok
`
    expect(allPlannedTestsChecked(body)).toBe(true)
    expect(executadoHasEvidence(body)).toBe(true)
    expect(validateStoryBody(baseStory, body)).toHaveLength(0)
  })

  it("tests: none exige tests_status n/a", () => {
    expect(
      validateStoryBody({ status: "✅", tests: "none", testsStatus: "pending" }, ""),
    ).toContain("tests: none exige tests_status: n/a.")
  })
})
