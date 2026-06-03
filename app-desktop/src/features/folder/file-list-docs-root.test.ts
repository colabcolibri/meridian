import { describe, expect, it } from "vitest"

import { createFileListDocsRoot } from "@/features/folder/file-list-docs-root"
import {
  inferFolderDisplayName,
  validateFileListFolder,
} from "@/features/folder/validate-file-list-folder"

function fakeFile(path: string): File {
  return {
    name: path.split("/").pop() ?? path,
    webkitRelativePath: path,
    text: async () => `body:${path}`,
  } as File
}

describe("file-list-docs-root", () => {
  it("validates meridian layout from webkitRelativePath", () => {
    const files = [fakeFile("docs/00_scope.md"), fakeFile("docs/us/US-0001.md")]
    expect(validateFileListFolder(files)).toEqual({
      hasScopeDoc: true,
      hasUsDir: true,
      hasKanban: false,
    })
    expect(inferFolderDisplayName(files)).toBe("docs")
  })

  it("reads and lists files by relative path", async () => {
    const files = [
      fakeFile("00_scope.md"),
      fakeFile("us/US-0001.md"),
      fakeFile("us/US-0002.md"),
    ]
    const root = createFileListDocsRoot(files, "docs")
    await expect(root.readText("us/US-0001.md")).resolves.toBe("body:us/US-0001.md")
    const listed = await root.listFiles("us", /^US-.*\.md$/)
    expect(listed.map((entry) => entry.name).sort()).toEqual([
      "US-0001.md",
      "US-0002.md",
    ])
  })
})
