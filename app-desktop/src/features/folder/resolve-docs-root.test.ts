import { describe, expect, it } from "vitest"

import { createStaticDocsRoot } from "@/features/folder/static-docs-root"
import { resolveMeridianDocsRoot } from "@/features/folder/resolve-docs-root"

describe("resolveMeridianDocsRoot", () => {
  it("wraps a directory handle when that was stored by mistake", () => {
    const handle = { kind: "directory", name: "docs" } as FileSystemDirectoryHandle
    const resolved = resolveMeridianDocsRoot(handle, null)

    expect(resolved?.kind).toBe("filesystem")
    expect(typeof resolved?.readText).toBe("function")
  })

  it("returns an existing MeridianDocsRoot unchanged", () => {
    const root = createStaticDocsRoot({
      name: "demo",
      files: ["00_scope.md"],
    })

    expect(resolveMeridianDocsRoot(root, null)).toBe(root)
  })
})
