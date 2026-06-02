import {
  clearFolderHandle,
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

export async function requestReadPermission(
  handle: FileSystemDirectoryHandle,
): Promise<boolean> {
  const options = { mode: "read" as const }
  const current = await handle.queryPermission(options)
  if (current === "granted") {
    return true
  }
  const next = await handle.requestPermission(options)
  return next === "granted"
}

export async function pickMeridianFolder(): Promise<MeridianFolderSnapshot> {
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
  const granted = await requestReadPermission(handle)
  if (!granted) {
    throw new Error("Permissão de leitura da pasta foi negada.")
  }

  const validation = await validateMeridianFolder(handle)
  const invalidMessage = assertMeridianFolder(validation)
  if (invalidMessage) {
    throw new Error(invalidMessage)
  }

  await saveFolderHandle(handle)

  return { name: handle.name, validation }
}

export async function restoreMeridianFolder(): Promise<MeridianFolderSnapshot | null> {
  if (!isFileSystemAccessSupported()) {
    return null
  }

  const handle = await loadFolderHandle()
  if (!handle) {
    return null
  }

  const granted = await requestReadPermission(handle)
  if (!granted) {
    await clearFolderHandle()
    return null
  }

  const validation = await validateMeridianFolder(handle)
  const invalidMessage = assertMeridianFolder(validation)
  if (invalidMessage) {
    await clearFolderHandle()
    return null
  }

  return { name: handle.name, validation }
}

export async function getActiveFolderHandle(): Promise<FileSystemDirectoryHandle | null> {
  const handle = await loadFolderHandle()
  if (!handle) {
    return null
  }
  const granted = await requestReadPermission(handle)
  return granted ? handle : null
}

export { meridianFolderHints }
