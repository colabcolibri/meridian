import { describe, expect, it } from "vitest"

import {
  createBindingSnapshot,
  hadBoundFolder,
  resolveStatusAfterAbort,
  resolveStatusAfterOpenFailure,
  shouldApplyAsyncResult,
} from "@/features/folder/folder-open-session"

describe("folder-open-session", () => {
  it("resolveStatusAfterOpenFailure never returns open", () => {
    expect(resolveStatusAfterOpenFailure()).toBe("error")
  })

  it("shouldApplyAsyncResult requires matching positive generation", () => {
    expect(shouldApplyAsyncResult(2, 2)).toBe(true)
    expect(shouldApplyAsyncResult(2, 3)).toBe(false)
    expect(shouldApplyAsyncResult(0, 0)).toBe(false)
  })

  it("resolveStatusAfterAbort restores prior status or none", () => {
    const prior = createBindingSnapshot({
      status: "open",
      folderKey: "fs-docs-1",
      folder: {
        name: "docs",
        validation: { hasScopeDoc: true, hasUsDir: true, hasKanban: true },
      },
      pendingFolderName: null,
      hints: [],
      error: null,
      isDemoActive: false,
      docsRoot: null,
    })
    expect(resolveStatusAfterAbort(prior, { demoBuild: false })).toBe("open")
    expect(resolveStatusAfterAbort(null, { demoBuild: false })).toBe("none")
    expect(resolveStatusAfterAbort(null, { demoBuild: true })).toBe("opening")
  })

  it("hadBoundFolder detects rollback-eligible open session", () => {
    expect(
      hadBoundFolder(
        createBindingSnapshot({
          status: "open",
          folderKey: "k1",
          folder: null,
          pendingFolderName: null,
          hints: [],
          error: null,
          isDemoActive: false,
          docsRoot: null,
        }),
      ),
    ).toBe(true)
    expect(
      hadBoundFolder(
        createBindingSnapshot({
          status: "permission_required",
          folderKey: null,
          folder: null,
          pendingFolderName: "docs",
          hints: [],
          error: null,
          isDemoActive: false,
          docsRoot: null,
        }),
      ),
    ).toBe(false)
  })
})
