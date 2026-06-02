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
  isFileSystemAccessSupported,
  meridianFolderHints,
  pickMeridianFolder,
  requestReadPermission,
  restoreMeridianFolder,
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
  hints: string[]
  error: string | null
  fsAccessSupported: boolean
  openFolder: () => Promise<void>
  clearFolder: () => Promise<void>
  getHandle: () => Promise<FileSystemDirectoryHandle | null>
}

const ProjectFolderContext = createContext<ProjectFolderContextValue | null>(null)

export function ProjectFolderProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<ProjectFolderStatus>("none")
  const [folder, setFolder] = useState<MeridianFolderSnapshot | null>(null)
  const [folderKey, setFolderKey] = useState<string | null>(null)
  const [hints, setHints] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleRef = useRef<FileSystemDirectoryHandle | null>(null)
  const restoreGenerationRef = useRef(0)
  const userOpenGenerationRef = useRef(0)

  const fsAccessSupported = isFileSystemAccessSupported()

  const bindFolder = useCallback(
    (snapshot: MeridianFolderSnapshot, handle: FileSystemDirectoryHandle) => {
      handleRef.current = handle
      setFolder(snapshot)
      setFolderKey(`${handle.name}-${Date.now()}`)
      setHints(meridianFolderHints(snapshot.validation))
      setStatus("open")
      setError(null)
    },
    [],
  )

  const clearBoundFolder = useCallback(() => {
    handleRef.current = null
    setFolder(null)
    setFolderKey(null)
    setHints([])
    setStatus("none")
  }, [])

  useEffect(() => {
    if (!fsAccessSupported) {
      return
    }

    const generation = ++restoreGenerationRef.current
    let cancelled = false

    async function restore() {
      const hasSaved = await restoreMeridianFolder()
      if (cancelled || generation !== restoreGenerationRef.current) {
        return
      }
      if (userOpenGenerationRef.current > 0) {
        return
      }

      if (!hasSaved) {
        setStatus("none")
        return
      }

      bindFolder(hasSaved.snapshot, hasSaved.handle)
    }

    void restore()

    return () => {
      cancelled = true
    }
  }, [bindFolder, fsAccessSupported])

  const openFolder = useCallback(async () => {
    userOpenGenerationRef.current += 1
    restoreGenerationRef.current += 1
    setError(null)
    setStatus("opening")

    try {
      const opened = await pickMeridianFolder()
      bindFolder(opened.snapshot, opened.handle)
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === "AbortError") {
        setStatus(handleRef.current ? "open" : "none")
        return
      }

      const message =
        cause instanceof Error ? cause.message : "Não foi possível abrir a pasta."
      setError(message)
      setStatus(handleRef.current ? "open" : "error")
    }
  }, [bindFolder])

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
    const granted = await requestReadPermission(cached)
    return granted ? cached : null
  }, [])

  const value = useMemo<ProjectFolderContextValue>(
    () => ({
      status,
      folder,
      folderKey,
      hints,
      error,
      fsAccessSupported,
      openFolder,
      clearFolder,
      getHandle,
    }),
    [
      status,
      folder,
      folderKey,
      hints,
      error,
      fsAccessSupported,
      openFolder,
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
