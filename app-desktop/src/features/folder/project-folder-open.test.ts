import { describe, expect, it } from "vitest"

import {
  resolveStatusAfterOpenFailure,
  resolveStatusAfterPickerAbort,
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

  it("resolveStatusAfterPickerAbort never restores a prior folder", () => {
    expect(resolveStatusAfterPickerAbort()).toBe("none")
  })
})
