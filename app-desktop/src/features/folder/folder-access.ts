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

export async function pickMeridianFolder(): Promise<{
  handle: FileSystemDirectoryHandle
  granted: boolean
}> {
  if (!isFileSystemAccessSupported()) {
    throw new Error(
      "Your browser does not support folder access. Use a recent Chrome or Edge on localhost.",
    )
  }

  if (!window.showDirectoryPicker) {
    throw new Error(
      "Your browser does not support folder access. Use a recent Chrome or Edge on localhost.",
    )
  }

  const handle = await window.showDirectoryPicker({ mode: "read" })
  await saveFolderHandle(handle)
  const granted = await hasReadPermission(handle)

  return { handle, granted }
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
