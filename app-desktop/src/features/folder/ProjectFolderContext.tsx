import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import {
  getActiveFolderHandle,
  isFileSystemAccessSupported,
  meridianFolderHints,
  pickMeridianFolder,
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
  const [hints, setHints] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const fsAccessSupported = isFileSystemAccessSupported()

  const applySnapshot = useCallback((snapshot: MeridianFolderSnapshot | null) => {
    if (!snapshot) {
      setFolder(null)
      setHints([])
      setStatus("none")
      return
    }
    setFolder(snapshot)
    setHints(meridianFolderHints(snapshot.validation))
    setStatus("open")
    setError(null)
  }, [])

  useEffect(() => {
    if (!fsAccessSupported) {
      return
    }

    let cancelled = false

    async function restore() {
      setStatus("opening")
      try {
        const snapshot = await restoreMeridianFolder()
        if (!cancelled) {
          applySnapshot(snapshot)
          if (!snapshot) {
            setStatus("none")
          }
        }
      } catch {
        if (!cancelled) {
          setStatus("none")
        }
      }
    }

    void restore()

    return () => {
      cancelled = true
    }
  }, [applySnapshot, fsAccessSupported])

  const openFolder = useCallback(async () => {
    setError(null)
    setStatus("opening")
    try {
      const snapshot = await pickMeridianFolder()
      applySnapshot(snapshot)
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : "Não foi possível abrir a pasta."
      setError(message)
      setStatus(folder ? "open" : "error")
    }
  }, [applySnapshot, folder])

  const clearFolder = useCallback(async () => {
    await clearFolderHandle()
    applySnapshot(null)
    setError(null)
  }, [applySnapshot])

  const getHandle = useCallback(() => getActiveFolderHandle(), [])

  const value = useMemo<ProjectFolderContextValue>(
    () => ({
      status,
      folder,
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
