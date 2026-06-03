import { createFilesystemDocsRoot } from "@/features/folder/filesystem-docs-root"
import type { MeridianDocsRoot } from "@/features/folder/meridian-docs-root"

function isMeridianDocsRoot(value: unknown): value is MeridianDocsRoot {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as MeridianDocsRoot).readText === "function" &&
    typeof (value as MeridianDocsRoot).listFiles === "function"
  )
}

function isDirectoryHandle(value: unknown): value is FileSystemDirectoryHandle {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as FileSystemDirectoryHandle).kind === "directory"
  )
}

/** Coerces a stored handle (legacy/HMR) into a MeridianDocsRoot adapter. */
export function resolveMeridianDocsRoot(
  stored: unknown,
  fallbackHandle: FileSystemDirectoryHandle | null,
): MeridianDocsRoot | null {
  if (isMeridianDocsRoot(stored)) {
    return stored
  }

  if (isDirectoryHandle(stored)) {
    return createFilesystemDocsRoot(stored)
  }

  if (fallbackHandle) {
    return createFilesystemDocsRoot(fallbackHandle)
  }

  return null
}
