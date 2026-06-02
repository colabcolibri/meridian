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

/** Não exige user activation — use em restore, reload e após o picker. */
export async function hasReadPermission(
  handle: FileSystemDirectoryHandle,
): Promise<boolean> {
  const state = await handle.queryPermission({ mode: "read" })
  return state === "granted"
}

/**
 * Exige user activation (clique). Não chamar em useEffect nem após await longo.
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
      "Seu navegador não suporta abertura de pasta. Use Chrome ou Edge recente em localhost.",
    )
  }

  const picker = window.showDirectoryPicker
  if (!picker) {
    throw new Error(
      "Seu navegador não suporta abertura de pasta. Use Chrome ou Edge recente em localhost.",
    )
  }

  const handle = await picker.call(window, { mode: "read" })
  await saveFolderHandle(handle)
  const granted = await hasReadPermission(handle)

  return { handle, granted }
}

/** Abre snapshot quando já há permissão de leitura. */
export async function openSnapshotFromHandle(
  handle: FileSystemDirectoryHandle,
): Promise<MeridianFolderOpenResult> {
  const snapshot = await snapshotFromHandle(handle)
  return { snapshot, handle }
}

/** Restaura handle salvo; não pede permissão (sem user activation). */
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
