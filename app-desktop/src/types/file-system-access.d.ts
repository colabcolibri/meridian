/** File System Access API (Chromium) — usado em US-0009. */

type FileSystemPermissionMode = "read" | "readwrite"

interface FileSystemHandlePermissionDescriptor {
  mode?: FileSystemPermissionMode
}

interface FileSystemHandle {
  readonly kind: "file" | "directory"
  readonly name: string
  queryPermission(
    descriptor?: FileSystemHandlePermissionDescriptor,
  ): Promise<PermissionState>
  requestPermission(
    descriptor?: FileSystemHandlePermissionDescriptor,
  ): Promise<PermissionState>
}

interface FileSystemDirectoryHandle extends FileSystemHandle {
  readonly kind: "directory"
  entries(): AsyncIterableIterator<[string, FileSystemHandle]>
  getDirectoryHandle(
    name: string,
    options?: { create?: boolean },
  ): Promise<FileSystemDirectoryHandle>
  getFileHandle(
    name: string,
    options?: { create?: boolean },
  ): Promise<FileSystemFileHandle>
}

interface FileSystemFileHandle extends FileSystemHandle {
  readonly kind: "file"
  getFile(): Promise<File>
}

interface DirectoryPickerOptions {
  id?: string
  mode?: "read" | "readwrite"
  startIn?:
    | FileSystemHandle
    | "desktop"
    | "documents"
    | "downloads"
    | "music"
    | "pictures"
    | "videos"
}

interface Window {
  showDirectoryPicker?(
    options?: DirectoryPickerOptions,
  ): Promise<FileSystemDirectoryHandle>
}
