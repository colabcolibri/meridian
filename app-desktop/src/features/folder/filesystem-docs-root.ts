import type {
  MeridianDocsRoot,
  ListedDocsFile,
} from "@/features/folder/meridian-docs-root"
import { sliceTextForFrontmatter } from "@/features/folder/meridian-docs-root"
import {
  listFileHandles,
  readFrontmatterFromFileHandle,
  readTextFromFileHandle,
} from "@/features/folder/read-folder-file"

async function resolveDirectory(
  root: FileSystemDirectoryHandle,
  directory: string,
): Promise<FileSystemDirectoryHandle> {
  if (!directory) {
    return root
  }

  let current = root
  for (const segment of directory.split("/").filter(Boolean)) {
    current = await current.getDirectoryHandle(segment)
  }
  return current
}

async function readTextAtPath(
  root: FileSystemDirectoryHandle,
  relativePath: string,
): Promise<string> {
  const segments = relativePath.split("/").filter(Boolean)
  const filename = segments.at(-1)!
  const directory = await resolveDirectory(root, segments.slice(0, -1).join("/"))
  const handle = await directory.getFileHandle(filename)
  return readTextFromFileHandle(handle)
}

export function createFilesystemDocsRoot(
  handle: FileSystemDirectoryHandle,
): MeridianDocsRoot {
  return {
    kind: "filesystem",
    displayName: handle.name,
    async readText(relativePath) {
      return readTextAtPath(handle, relativePath)
    },
    async readTextForFrontmatter(relativePath, maxBytes) {
      const segments = relativePath.split("/").filter(Boolean)
      const filename = segments.at(-1)!
      const directory = await resolveDirectory(handle, segments.slice(0, -1).join("/"))
      const fileHandle = await directory.getFileHandle(filename)
      return readFrontmatterFromFileHandle(fileHandle, maxBytes)
    },
    async listFiles(directory, namePattern) {
      const dir = await resolveDirectory(handle, directory)
      const handles = await listFileHandles(dir, namePattern)
      const prefix = directory ? `${directory}/` : ""
      return handles.map(
        (entry): ListedDocsFile => ({
          name: entry.name,
          relativePath: `${prefix}${entry.name}`,
        }),
      )
    },
  }
}

/** Reads full file then applies frontmatter prefix rules (static / tests). */
export async function readTextForFrontmatterFromFull(
  text: string,
  maxBytes?: number,
): Promise<string> {
  return sliceTextForFrontmatter(text, maxBytes)
}
