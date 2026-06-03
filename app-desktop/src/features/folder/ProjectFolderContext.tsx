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
  createBindingSnapshot,
  resolveStatusAfterAbort,
  shouldApplyAsyncResult,
  type FolderBindingSnapshot,
} from "@/features/folder/folder-open-session"
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

interface StoredPriorSession extends FolderBindingSnapshot {
  handle: FileSystemDirectoryHandle | null
}

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
  const openFolderGenerationRef = useRef(0)
  const priorOpenSessionRef = useRef<StoredPriorSession | null>(null)

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
      if (openFolderGenerationRef.current === 0) {
        openFolderGenerationRef.current = 1
      }
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

  const clearBindingState = useCallback(() => {
    handleRef.current = null
    setDocsRoot(null)
    setIsDemoActive(false)
    setFolder(null)
    folderKeyRef.current = null
    setFolderKey(null)
    setPendingFolderName(null)
    setHints([])
  }, [])

  const clearBoundFolder = useCallback(() => {
    clearBindingState()
    setStatus("none")
  }, [clearBindingState])

  const readBindingState = useCallback(
    (): StoredPriorSession => ({
      ...createBindingSnapshot({
        status,
        folderKey,
        folder,
        pendingFolderName,
        hints,
        error,
        isDemoActive,
        docsRoot,
      }),
      handle: handleRef.current,
    }),
    [
      status,
      folderKey,
      folder,
      pendingFolderName,
      hints,
      error,
      isDemoActive,
      docsRoot,
    ],
  )

  const restorePriorSession = useCallback(() => {
    const prior = priorOpenSessionRef.current
    priorOpenSessionRef.current = null

    if (!prior) {
      const nextStatus = resolveStatusAfterAbort(null, { demoBuild })
      setStatus(nextStatus)
      if (demoBuild && nextStatus === "opening") {
        void finishOpenDemoRef.current?.()
      }
      return
    }

    handleRef.current = prior.handle
    folderKeyRef.current = prior.folderKey
    setFolderKey(prior.folderKey)
    setFolder(prior.folder)
    setDocsRoot(prior.docsRoot)
    setIsDemoActive(prior.isDemoActive)
    setPendingFolderName(prior.pendingFolderName)
    setHints(prior.hints)
    setError(prior.error)
    setStatus(prior.status)
  }, [demoBuild])

  const beginFolderOpen = useCallback(
    (options?: { savePriorForAbort?: boolean }): number => {
      if (options?.savePriorForAbort) {
        priorOpenSessionRef.current = readBindingState()
      } else {
        priorOpenSessionRef.current = null
      }

      restoreGenerationRef.current += 1
      userOpenGenerationRef.current += 1
      openFolderGenerationRef.current += 1
      const generation = openFolderGenerationRef.current

      clearBindingState()
      setError(null)
      setStatus("opening")

      return generation
    },
    [clearBindingState, readBindingState],
  )

  const failOpenSession = useCallback(
    (message: string, generation: number) => {
      if (!shouldApplyAsyncResult(generation, openFolderGenerationRef.current)) {
        return
      }
      clearBoundFolder()
      setError(message)
      setStatus("error")
    },
    [clearBoundFolder],
  )

  const finishOpenWithHandle = useCallback(
    async (handle: FileSystemDirectoryHandle, generation: number) => {
      if (!shouldApplyAsyncResult(generation, openFolderGenerationRef.current)) {
        return
      }

      const opened = await openSnapshotFromHandle(handle)
      if (!shouldApplyAsyncResult(generation, openFolderGenerationRef.current)) {
        return
      }

      handleRef.current = opened.handle
      bindFolder(opened.snapshot, createFilesystemDocsRoot(opened.handle))
      priorOpenSessionRef.current = null
    },
    [bindFolder],
  )

  const finishOpenDemo = useCallback(async () => {
    const opened = await openDemoMeridianFolder()
    handleRef.current = null
    bindFolder(opened.snapshot, opened.docsRoot)
  }, [bindFolder])

  const finishOpenDemoRef = useRef(finishOpenDemo)
  finishOpenDemoRef.current = finishOpenDemo

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
        openFolderGenerationRef.current += 1
        await finishOpenWithHandle(handle, openFolderGenerationRef.current)
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

    const generation = beginFolderOpen({ savePriorForAbort: true })

    try {
      const picked = await pickMeridianFolder()

      if (!shouldApplyAsyncResult(generation, openFolderGenerationRef.current)) {
        return
      }

      if (!(await hasReadPermission(picked.handle))) {
        requirePermissionForHandle(picked.handle)
        return
      }

      await finishOpenWithHandle(picked.handle, generation)
    } catch (cause) {
      if (!shouldApplyAsyncResult(generation, openFolderGenerationRef.current)) {
        return
      }

      if (cause instanceof DOMException && cause.name === "AbortError") {
        restorePriorSession()
        return
      }

      const message = cause instanceof Error ? cause.message : "Could not open folder."
      failOpenSession(message, generation)
    }
  }, [
    beginFolderOpen,
    failOpenSession,
    finishOpenWithHandle,
    fsAccessSupported,
    requirePermissionForHandle,
    restorePriorSession,
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

    const generation = openFolderGenerationRef.current
    setError(null)
    setStatus("opening")

    try {
      const granted = await requestReadPermissionFromUser(handle)
      if (!shouldApplyAsyncResult(generation, openFolderGenerationRef.current)) {
        return
      }

      if (!granted) {
        setError("Read permission denied.")
        setStatus("permission_required")
        return
      }

      await finishOpenWithHandle(handle, generation)
    } catch (cause) {
      if (!shouldApplyAsyncResult(generation, openFolderGenerationRef.current)) {
        return
      }
      const message =
        cause instanceof Error ? cause.message : "Could not grant permission."
      setError(message)
      setStatus("permission_required")
    }
  }, [demoBuild, finishOpenDemo, finishOpenWithHandle])

  const clearFolder = useCallback(async () => {
    beginFolderOpen({ savePriorForAbort: false })
    await clearFolderHandle()

    if (demoBuild) {
      try {
        await finishOpenDemo()
      } catch (cause) {
        setError(
          cause instanceof Error ? cause.message : "Could not reload demo project.",
        )
        setStatus("error")
      }
      return
    }

    setError(null)
    setStatus("none")
  }, [beginFolderOpen, demoBuild, finishOpenDemo])

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
