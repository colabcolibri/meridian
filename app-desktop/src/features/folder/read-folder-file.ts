/** Max bytes read when only YAML frontmatter is needed (US index). */
export const FRONTMATTER_READ_BYTES = 8192

/** Browser File System Access API — keep concurrent reads low to avoid queue stalls. */
export const FS_READ_CONCURRENCY = 8

function frontmatterClosedInPrefix(text: string): boolean {
  const trimmed = text.replace(/^\uFEFF/, "")
  if (!trimmed.startsWith("---")) {
    return false
  }
  return trimmed.indexOf("---", 3) !== -1
}

async function readFileAsText(file: File, maxBytes?: number): Promise<string> {
  if (maxBytes === undefined || file.size <= maxBytes) {
    return file.text()
  }

  const prefix = await file.slice(0, maxBytes).text()
  if (frontmatterClosedInPrefix(prefix)) {
    return prefix
  }

  return file.text()
}

/** Reads file text using an existing handle (avoids a second getFileHandle lookup). */
export async function readTextFromFileHandle(
  handle: FileSystemFileHandle,
): Promise<string> {
  const file = await handle.getFile()
  return readFileAsText(file)
}

/** Frontmatter-only read from an existing file handle. */
export async function readFrontmatterFromFileHandle(
  handle: FileSystemFileHandle,
  maxBytes = FRONTMATTER_READ_BYTES,
): Promise<string> {
  const file = await handle.getFile()
  return readFileAsText(file, maxBytes)
}

export async function readTextFile(
  directory: FileSystemDirectoryHandle,
  filename: string,
): Promise<string> {
  const fileHandle = await directory.getFileHandle(filename)
  return readTextFromFileHandle(fileHandle)
}

/** Reads up to `maxBytes` when frontmatter fits; otherwise reads the full file. */
export async function readTextFileForFrontmatter(
  directory: FileSystemDirectoryHandle,
  filename: string,
  maxBytes = FRONTMATTER_READ_BYTES,
): Promise<string> {
  const fileHandle = await directory.getFileHandle(filename)
  return readFrontmatterFromFileHandle(fileHandle, maxBytes)
}

export type ListedFileHandle = {
  name: string
  handle: FileSystemFileHandle
}

/** Lists matching files in one directory scan, returning handles for direct reads. */
export async function listFileHandles(
  directory: FileSystemDirectoryHandle,
  namePattern: RegExp,
): Promise<ListedFileHandle[]> {
  const entries: ListedFileHandle[] = []
  for await (const [name, handle] of directory.entries()) {
    if (handle.kind === "file" && namePattern.test(name)) {
      entries.push({ name, handle: handle as FileSystemFileHandle })
    }
  }
  return entries.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { numeric: true }),
  )
}
