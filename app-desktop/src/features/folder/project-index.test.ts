import { describe, expect, it } from "vitest"

import { splitMarkdown } from "@/domain/meridian/frontmatter"
import { FRONTMATTER_READ_BYTES } from "@/features/folder/read-folder-file"

describe("frontmatter prefix reads", () => {
  it("detects closed frontmatter within a prefix slice", () => {
    const full = `---
id: US-0001
title: Example
status: ❌
---

## Intent

Long body that would exceed a prefix read in production.
`

    const prefix = full.slice(0, FRONTMATTER_READ_BYTES)
    const { frontmatter } = splitMarkdown(prefix)

    expect(frontmatter).toContain("id: US-0001")
  })

  it("parses user story frontmatter from prefix-only content", () => {
    const prefix = `---
id: US-0099
title: Prefix story
epic: EPIC-02
version: v1
status: ❌
moscow: Must
done_when: Done when prefix works.
tests: none
tests_status: n/a
---
`

    const { frontmatter } = splitMarkdown(prefix)
    expect(frontmatter).toContain("US-0099")
  })
})

describe("collectIndexProtocolIssues", () => {
  it("is separable from body validation", async () => {
    const { collectIndexProtocolIssues, collectStoryProtocolIssues } =
      await import("@/domain/meridian/protocol-validators")

    expect(typeof collectIndexProtocolIssues).toBe("function")
    expect(typeof collectStoryProtocolIssues).toBe("function")
  })
})
