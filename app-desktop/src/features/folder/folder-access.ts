import {
  loadFolderHandle,
  saveFolderHandle,
} from "@/features/folder/folder-handle-store"
import type { MeridianFolderSnapshot } from "@/features/folder/types"
import {
  assertMeridianFolder,
  meridianFolderHints,
  validateMeridianFolder,
} from "@/features/folder/validate-meridian-folder"

export function isFileSystemAccessSupported(): boolean {
  return typeof window !== "undefined" && "showDirectoryPicker" in window
}

/** Reliable folder pick via hidden &lt;input webkitdirectory&gt; (same-tab safe). */
export function isFolderInputSupported(): boolean {
  if (typeof document === "undefined") {
    return false
  }
  const input = document.createElement("input")
  return "webkitdirectory" in input
}

/** Does not require user activation — use on restore, reload, and after the picker. */
export async function hasReadPermission(
  handle: FileSystemDirectoryHandle,
): Promise<boolean> {
  const state = await handle.queryPermission({ mode: "read" })
  return state === "granted"
}

/**
 * Requires user activation (click). Do not call from useEffect or after a long await.
 */
export async function requestReadPermissionFromUser(
  handle: FileSystemDirectoryHandle,
): Promise<boolean> {
  const state = await handle.requestPermission({ mode: "read" })
  return state === "granted"
}

export interface MeridianFolderOpenResult {
  snapshot: MeridianFolderSnapshot
  handle: FileSystemDirectoryHandle
}

async function snapshotFromHandle(
  handle: FileSystemDirectoryHandle,
): Promise<MeridianFolderSnapshot> {
  const validation = await validateMeridianFolder(handle)
  const invalidMessage = assertMeridianFolder(validation)
  if (invalidMessage) {
    throw new Error(invalidMessage)
  }
  return { name: handle.name, validation }
}

const PICKER_UNSUPPORTED =
  "Your browser does not support folder access. Use a recent Chrome or Edge on localhost."

/**
 * Starts the native picker synchronously on click — returns the promise immediately.
 * Call this with zero `await` before it (not even inside an `async` function's first line
 * after other work). Then await the returned promise in a separate task.
 */
export function startDirectoryPickerFromUserGesture(): Promise<FileSystemDirectoryHandle> {
  if (!isFileSystemAccessSupported() || !window.showDirectoryPicker) {
    throw new Error(PICKER_UNSUPPORTED)
  }
  return window.showDirectoryPicker({ mode: "read" })
}

export async function persistPickedFolderHandle(
  handle: FileSystemDirectoryHandle,
): Promise<boolean> {
  await saveFolderHandle(handle)
  return hasReadPermission(handle)
}

/**
 * @deprecated Prefer startDirectoryPickerFromUserGesture + persistPickedFolderHandle.
 */
export async function pickMeridianFolder(): Promise<{
  handle: FileSystemDirectoryHandle
  granted: boolean
}> {
  const handle = await startDirectoryPickerFromUserGesture()
  const granted = await persistPickedFolderHandle(handle)
  return { handle, granted }
}

/**
 * Starts permission request synchronously on click — same activation rules as the picker.
 */
export function startReadPermissionRequestFromUserGesture(
  handle: FileSystemDirectoryHandle,
): Promise<PermissionState> {
  return handle.requestPermission({ mode: "read" })
}

/** Opens snapshot when read permission is already granted. */
export async function openSnapshotFromHandle(
  handle: FileSystemDirectoryHandle,
): Promise<MeridianFolderOpenResult> {
  const snapshot = await snapshotFromHandle(handle)
  return { snapshot, handle }
}

/** Restores saved handle; does not request permission (no user activation). */
export async function restoreMeridianFolderHandle(): Promise<FileSystemDirectoryHandle | null> {
  if (!isFileSystemAccessSupported()) {
    return null
  }

  const handle = await loadFolderHandle()
  if (!handle) {
    return null
  }

  return handle
}

export async function getActiveFolderHandle(): Promise<FileSystemDirectoryHandle | null> {
  const handle = await loadFolderHandle()
  if (!handle) {
    return null
  }
  if (!(await hasReadPermission(handle))) {
    return null
  }
  return handle
}

export { meridianFolderHints }
