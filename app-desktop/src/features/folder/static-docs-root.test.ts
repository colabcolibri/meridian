import { describe, expect, it } from "vitest"

import {
  listManifestFiles,
  validateDemoManifest,
} from "@/features/folder/static-docs-root"

describe("static demo docs root", () => {
  it("lists only direct children matching the pattern", () => {
    const files = ["00_scope.md", "us/US-0001.md", "us/US-0002.md", "epics/EPIC-01.md"]

    expect(listManifestFiles(files, "us", /^US-\d+\.md$/i)).toEqual([
      { name: "US-0001.md", relativePath: "us/US-0001.md" },
      { name: "US-0002.md", relativePath: "us/US-0002.md" },
    ])
  })

  it("validates a minimal Meridian demo manifest", () => {
    expect(
      validateDemoManifest({
        name: "demo",
        files: ["00_scope.md", "us/US-0001.md", "kanban/board.json"],
      }),
    ).toEqual({
      hasScopeDoc: true,
      hasUsDir: true,
      hasKanban: true,
    })
  })
})
