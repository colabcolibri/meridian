import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"

import {
  hasReadPermission,
  isFileSystemAccessSupported,
  meridianFolderHints,
  openSnapshotFromHandle,
  pickMeridianFolder,
  requestReadPermissionFromUser,
  restoreMeridianFolderHandle,
} from "@/features/folder/folder-access"
import { clearFolderHandle } from "@/features/folder/folder-handle-store"
import type {
  MeridianFolderSnapshot,
  MeridianFolderValidation,
  ProjectFolderStatus,
} from "@/features/folder/types"

interface ProjectFolderContextValue {
  status: ProjectFolderStatus
  folder: MeridianFolderSnapshot | null
  folderKey: string | null
  pendingFolderName: string | null
  hints: string[]
  error: string | null
  fsAccessSupported: boolean
  openFolder: () => Promise<void>
  grantReadPermission: () => Promise<void>
  clearFolder: () => Promise<void>
  getHandle: () => Promise<FileSystemDirectoryHandle | null>
}

const ProjectFolderContext = createContext<ProjectFolderContextValue | null>(null)

export function ProjectFolderProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<ProjectFolderStatus>("none")
  const [folder, setFolder] = useState<MeridianFolderSnapshot | null>(null)
  const [folderKey, setFolderKey] = useState<string | null>(null)
  const [pendingFolderName, setPendingFolderName] = useState<string | null>(null)
  const [hints, setHints] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleRef = useRef<FileSystemDirectoryHandle | null>(null)
  const folderKeyRef = useRef<string | null>(null)
  const restoreGenerationRef = useRef(0)
  const userOpenGenerationRef = useRef(0)

  const fsAccessSupported = isFileSystemAccessSupported()

  const bindFolder = useCallback(
    (snapshot: MeridianFolderSnapshot, handle: FileSystemDirectoryHandle) => {
      handleRef.current = handle
      setFolder(snapshot)
      const key = `${handle.name}-${Date.now()}`
      folderKeyRef.current = key
      setFolderKey(key)
      setPendingFolderName(null)
      setHints(meridianFolderHints(snapshot.validation))
      setStatus("open")
      setError(null)
    },
    [],
  )

  const requirePermissionForHandle = useCallback(
    (handle: FileSystemDirectoryHandle) => {
      handleRef.current = handle
      setFolder(null)
      folderKeyRef.current = null
      setFolderKey(null)
      setPendingFolderName(handle.name)
      setHints([])
      setStatus("permission_required")
      setError(null)
    },
    [],
  )

  const clearBoundFolder = useCallback(() => {
    handleRef.current = null
    setFolder(null)
    folderKeyRef.current = null
    setFolderKey(null)
    setPendingFolderName(null)
    setHints([])
    setStatus("none")
  }, [])

  const finishOpenWithHandle = useCallback(
    async (handle: FileSystemDirectoryHandle) => {
      const opened = await openSnapshotFromHandle(handle)
      bindFolder(opened.snapshot, opened.handle)
    },
    [bindFolder],
  )

  useEffect(() => {
    if (!fsAccessSupported) {
      return
    }

    const generation = ++restoreGenerationRef.current
    let cancelled = false

    async function restore() {
      const handle = await restoreMeridianFolderHandle()
      if (cancelled || generation !== restoreGenerationRef.current) {
        return
      }
      if (userOpenGenerationRef.current > 0) {
        return
      }

      if (!handle) {
        setStatus("none")
        return
      }

      if (!(await hasReadPermission(handle))) {
        requirePermissionForHandle(handle)
        return
      }

      try {
        await finishOpenWithHandle(handle)
      } catch (cause) {
        if (cancelled) {
          return
        }
        await clearFolderHandle()
        clearBoundFolder()
        setError(
          cause instanceof Error
            ? cause.message
            : "Não foi possível restaurar a pasta.",
        )
        setStatus("error")
      }
    }

    void restore()

    return () => {
      cancelled = true
    }
  }, [
    clearBoundFolder,
    finishOpenWithHandle,
    fsAccessSupported,
    requirePermissionForHandle,
  ])

  const openFolder = useCallback(async () => {
    userOpenGenerationRef.current += 1
    restoreGenerationRef.current += 1
    setError(null)
    setStatus("opening")

    try {
      const picked = await pickMeridianFolder()

      if (!(await hasReadPermission(picked.handle))) {
        requirePermissionForHandle(picked.handle)
        return
      }

      await finishOpenWithHandle(picked.handle)
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === "AbortError") {
        setStatus(
          folderKeyRef.current
            ? "open"
            : handleRef.current
              ? "permission_required"
              : "none",
        )
        return
      }

      const message =
        cause instanceof Error ? cause.message : "Não foi possível abrir a pasta."
      setError(message)
      setStatus(
        folderKeyRef.current
          ? "open"
          : handleRef.current
            ? "permission_required"
            : "error",
      )
    }
  }, [finishOpenWithHandle, requirePermissionForHandle])

  const grantReadPermission = useCallback(async () => {
    const handle = handleRef.current
    if (!handle) {
      setError("Nenhuma pasta pendente. Use Abrir pasta novamente.")
      setStatus("none")
      return
    }

    setError(null)
    setStatus("opening")

    try {
      const granted = await requestReadPermissionFromUser(handle)
      if (!granted) {
        setError("Permissão de leitura negada.")
        setStatus("permission_required")
        return
      }

      await finishOpenWithHandle(handle)
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : "Não foi possível conceder permissão."
      setError(message)
      setStatus("permission_required")
    }
  }, [finishOpenWithHandle])

  const clearFolder = useCallback(async () => {
    restoreGenerationRef.current += 1
    userOpenGenerationRef.current += 1
    await clearFolderHandle()
    clearBoundFolder()
    setError(null)
  }, [clearBoundFolder])

  const getHandle = useCallback(async () => {
    const cached = handleRef.current
    if (!cached) {
      return null
    }
    if (!(await hasReadPermission(cached))) {
      return null
    }
    return cached
  }, [])

  const value = useMemo<ProjectFolderContextValue>(
    () => ({
      status,
      folder,
      folderKey,
      pendingFolderName,
      hints,
      error,
      fsAccessSupported,
      openFolder,
      grantReadPermission,
      clearFolder,
      getHandle,
    }),
    [
      status,
      folder,
      folderKey,
      pendingFolderName,
      hints,
      error,
      fsAccessSupported,
      openFolder,
      grantReadPermission,
      clearFolder,
      getHandle,
    ],
  )

  return (
    <ProjectFolderContext.Provider value={value}>
      {children}
    </ProjectFolderContext.Provider>
  )
}

export function useProjectFolder(): ProjectFolderContextValue {
  const context = useContext(ProjectFolderContext)
  if (!context) {
    throw new Error("useProjectFolder must be used within ProjectFolderProvider")
  }
  return context
}

export type { MeridianFolderValidation }
