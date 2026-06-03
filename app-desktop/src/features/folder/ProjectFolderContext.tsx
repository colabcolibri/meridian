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

import { isDemoMode } from "@/features/folder/demo-config"
import {
  openDemoMeridianFolder,
  meridianFolderHints,
} from "@/features/folder/demo-folder-access"
import { createFilesystemDocsRoot } from "@/features/folder/filesystem-docs-root"
import {
  hasReadPermission,
  isFileSystemAccessSupported,
  openSnapshotFromHandle,
  pickMeridianFolder,
  requestReadPermissionFromUser,
  restoreMeridianFolderHandle,
} from "@/features/folder/folder-access"
import { clearFolderHandle } from "@/features/folder/folder-handle-store"
import type { MeridianDocsRoot } from "@/features/folder/meridian-docs-root"
import { resolveMeridianDocsRoot } from "@/features/folder/resolve-docs-root"
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
  isDemoBuild: boolean
  isDemoActive: boolean
  openFolder: () => Promise<void>
  grantReadPermission: () => Promise<void>
  clearFolder: () => Promise<void>
  getDocsRoot: () => Promise<MeridianDocsRoot | null>
  getHandle: () => Promise<FileSystemDirectoryHandle | null>
}

const ProjectFolderContext = createContext<ProjectFolderContextValue | null>(null)

export function ProjectFolderProvider({ children }: { children: ReactNode }) {
  const demoBuild = isDemoMode()
  const [status, setStatus] = useState<ProjectFolderStatus>(
    demoBuild ? "opening" : "none",
  )
  const [folder, setFolder] = useState<MeridianFolderSnapshot | null>(null)
  const [folderKey, setFolderKey] = useState<string | null>(null)
  const [pendingFolderName, setPendingFolderName] = useState<string | null>(null)
  const [hints, setHints] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isDemoActive, setIsDemoActive] = useState(false)
  const [docsRoot, setDocsRoot] = useState<MeridianDocsRoot | null>(null)

  const handleRef = useRef<FileSystemDirectoryHandle | null>(null)
  const folderKeyRef = useRef<string | null>(null)
  const restoreGenerationRef = useRef(0)
  const userOpenGenerationRef = useRef(0)

  const fsAccessSupported = isFileSystemAccessSupported()

  const bindFolder = useCallback(
    (
      snapshot: MeridianFolderSnapshot,
      root: MeridianDocsRoot | FileSystemDirectoryHandle,
    ) => {
      const resolved = resolveMeridianDocsRoot(root, null)
      if (!resolved) {
        throw new Error("Could not open project folder.")
      }

      setDocsRoot(resolved)
      setIsDemoActive(resolved.kind === "static")
      if (resolved.kind === "static") {
        handleRef.current = null
      }
      setFolder(snapshot)
      const key = `${resolved.kind}-${resolved.displayName}-${Date.now()}`
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
      setDocsRoot(null)
      setIsDemoActive(false)
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
    setDocsRoot(null)
    setIsDemoActive(false)
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
      handleRef.current = opened.handle
      bindFolder(opened.snapshot, createFilesystemDocsRoot(opened.handle))
    },
    [bindFolder],
  )

  const finishOpenDemo = useCallback(async () => {
    const opened = await openDemoMeridianFolder()
    handleRef.current = null
    bindFolder(opened.snapshot, opened.docsRoot)
  }, [bindFolder])

  useEffect(() => {
    if (!demoBuild) {
      return
    }

    const generation = ++restoreGenerationRef.current
    let cancelled = false

    async function openDemo() {
      try {
        await finishOpenDemo()
      } catch (cause) {
        if (cancelled || generation !== restoreGenerationRef.current) {
          return
        }
        clearBoundFolder()
        setError(
          cause instanceof Error ? cause.message : "Could not load demo project.",
        )
        setStatus("error")
      }
    }

    void openDemo()

    return () => {
      cancelled = true
    }
  }, [clearBoundFolder, demoBuild, finishOpenDemo])

  useEffect(() => {
    if (demoBuild || !fsAccessSupported) {
      if (demoBuild && !fsAccessSupported) {
        return
      }
      if (demoBuild) {
        return
      }
      return
    }

    const generation = ++restoreGenerationRef.current
    let cancelled = false

    setStatus("opening")

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
        setError(cause instanceof Error ? cause.message : "Could not restore folder.")
        setStatus("error")
      }
    }

    void restore()

    return () => {
      cancelled = true
    }
  }, [
    clearBoundFolder,
    demoBuild,
    finishOpenWithHandle,
    fsAccessSupported,
    requirePermissionForHandle,
  ])

  const openFolder = useCallback(async () => {
    if (!fsAccessSupported) {
      setError(
        "Your browser does not support folder access. Use Chrome or Edge, or run the demo build.",
      )
      setStatus("error")
      return
    }

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
              : demoBuild
                ? "opening"
                : "none",
        )
        if (demoBuild && !folderKeyRef.current && !handleRef.current) {
          void finishOpenDemo()
        }
        return
      }

      const message = cause instanceof Error ? cause.message : "Could not open folder."
      setError(message)
      setStatus(
        folderKeyRef.current
          ? "open"
          : handleRef.current
            ? "permission_required"
            : "error",
      )
    }
  }, [
    demoBuild,
    finishOpenDemo,
    finishOpenWithHandle,
    fsAccessSupported,
    requirePermissionForHandle,
  ])

  const grantReadPermission = useCallback(async () => {
    const handle = handleRef.current
    if (!handle) {
      setError("No pending folder. Use Open folder again.")
      setStatus(demoBuild ? "opening" : "none")
      if (demoBuild) {
        void finishOpenDemo()
      }
      return
    }

    setError(null)
    setStatus("opening")

    try {
      const granted = await requestReadPermissionFromUser(handle)
      if (!granted) {
        setError("Read permission denied.")
        setStatus("permission_required")
        return
      }

      await finishOpenWithHandle(handle)
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : "Could not grant permission."
      setError(message)
      setStatus("permission_required")
    }
  }, [demoBuild, finishOpenDemo, finishOpenWithHandle])

  const clearFolder = useCallback(async () => {
    restoreGenerationRef.current += 1
    userOpenGenerationRef.current += 1
    await clearFolderHandle()
    clearBoundFolder()
    setError(null)

    if (demoBuild) {
      setStatus("opening")
      try {
        await finishOpenDemo()
      } catch (cause) {
        setError(
          cause instanceof Error ? cause.message : "Could not reload demo project.",
        )
        setStatus("error")
      }
    }
  }, [clearBoundFolder, demoBuild, finishOpenDemo])

  const getDocsRoot = useCallback(async () => {
    const resolved = resolveMeridianDocsRoot(docsRoot, handleRef.current)
    if (resolved && resolved !== docsRoot) {
      setDocsRoot(resolved)
    }
    return resolved
  }, [docsRoot])

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
      isDemoBuild: demoBuild,
      isDemoActive,
      openFolder,
      grantReadPermission,
      clearFolder,
      getDocsRoot,
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
      demoBuild,
      isDemoActive,
      openFolder,
      grantReadPermission,
      clearFolder,
      getDocsRoot,
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
