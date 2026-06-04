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
import { createFileListDocsRoot } from "@/features/folder/file-list-docs-root"
import { createFilesystemDocsRoot } from "@/features/folder/filesystem-docs-root"
import { shouldApplyAsyncResult } from "@/features/folder/folder-open-session"
import {
  hasReadPermission,
  isFileSystemAccessSupported,
  isFolderInputSupported,
  openSnapshotFromHandle,
  persistPickedFolderHandle,
  restoreMeridianFolderHandle,
  startDirectoryPickerFromUserGesture,
  startReadPermissionRequestFromUserGesture,
} from "@/features/folder/folder-access"
import { clearFolderHandle } from "@/features/folder/folder-handle-store"
import type { MeridianDocsRoot } from "@/features/folder/meridian-docs-root"
import { resolveMeridianDocsRoot } from "@/features/folder/resolve-docs-root"
import type {
  MeridianFolderSnapshot,
  MeridianFolderValidation,
  ProjectFolderStatus,
} from "@/features/folder/types"
import {
  assertMeridianFolder,
  inferFolderDisplayName,
  validateFileListFolder,
} from "@/features/folder/validate-file-list-folder"

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
  /** Demo only. */
  openFolder: () => void
  /** Sync picker on click (persists handle for F5). Returns false → use file input fallback. */
  openFolderFromPicker: () => boolean
  applyFolderFromFileList: (files: File[]) => void
  cancelOpening: () => void
  grantReadPermission: () => void
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
  const docsRootRef = useRef<MeridianDocsRoot | null>(null)
  const restoreGenerationRef = useRef(0)
  const openFolderGenerationRef = useRef(0)

  docsRootRef.current = docsRoot

  const fsAccessSupported =
    demoBuild || isFileSystemAccessSupported() || isFolderInputSupported()
  const canPersistAcrossReload = isFileSystemAccessSupported()

  const bindFolder = useCallback(
    (
      snapshot: MeridianFolderSnapshot,
      root: MeridianDocsRoot | FileSystemDirectoryHandle,
    ) => {
      const resolved = resolveMeridianDocsRoot(root, null)
      if (!resolved) {
        throw new Error("Could not open project folder.")
      }

      docsRootRef.current = resolved
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

  const clearBindingState = useCallback(() => {
    handleRef.current = null
    docsRootRef.current = null
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

  const cancelOpening = useCallback(() => {
    restoreGenerationRef.current += 1
    openFolderGenerationRef.current += 1
    clearBoundFolder()
    setError(null)
  }, [clearBoundFolder])

  const beginHardResetSync = useCallback(
    (options?: { clearPersistedHandle?: boolean }): number => {
      restoreGenerationRef.current += 1
      openFolderGenerationRef.current += 1
      const generation = openFolderGenerationRef.current

      clearBindingState()
      setError(null)
      setStatus("opening")

      if (options?.clearPersistedHandle) {
        void clearFolderHandle()
      }

      return generation
    },
    [clearBindingState],
  )

  const setPermissionRequiredForHandle = useCallback(
    (handle: FileSystemDirectoryHandle) => {
      handleRef.current = handle
      docsRootRef.current = null
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
    },
    [bindFolder],
  )

  const finishOpenDemo = useCallback(async () => {
    const opened = await openDemoMeridianFolder()
    handleRef.current = null
    bindFolder(opened.snapshot, opened.docsRoot)
  }, [bindFolder])

  const completeOpenFromPicker = useCallback(
    async (pickerPromise: Promise<FileSystemDirectoryHandle>, generation: number) => {
      try {
        const handle = await pickerPromise

        if (!shouldApplyAsyncResult(generation, openFolderGenerationRef.current)) {
          return
        }

        const granted = await persistPickedFolderHandle(handle)

        if (!shouldApplyAsyncResult(generation, openFolderGenerationRef.current)) {
          return
        }

        if (!granted) {
          setPermissionRequiredForHandle(handle)
          return
        }

        await finishOpenWithHandle(handle, generation)
      } catch (cause) {
        if (!shouldApplyAsyncResult(generation, openFolderGenerationRef.current)) {
          return
        }

        if (cause instanceof DOMException && cause.name === "AbortError") {
          clearBoundFolder()
          return
        }

        const message =
          cause instanceof Error ? cause.message : "Could not open folder."
        failOpenSession(message, generation)
      }
    },
    [
      canPersistAcrossReload,
      clearBoundFolder,
      failOpenSession,
      finishOpenWithHandle,
      setPermissionRequiredForHandle,
    ],
  )

  const openFolderFromPicker = useCallback((): boolean => {
    if (!canPersistAcrossReload) {
      return false
    }

    let pickerPromise: Promise<FileSystemDirectoryHandle>
    try {
      pickerPromise = startDirectoryPickerFromUserGesture()
    } catch {
      return false
    }

    const generation = beginHardResetSync()
    void completeOpenFromPicker(pickerPromise, generation)
    return true
  }, [beginHardResetSync, canPersistAcrossReload, completeOpenFromPicker])

  const applyFolderFromFileList = useCallback(
    (files: File[]) => {
      if (files.length === 0) {
        cancelOpening()
        return
      }

      const generation = beginHardResetSync()

      void (async () => {
        try {
          const validation = validateFileListFolder(files)
          const invalidMessage = assertMeridianFolder(validation)
          if (invalidMessage) {
            throw new Error(invalidMessage)
          }

          if (!shouldApplyAsyncResult(generation, openFolderGenerationRef.current)) {
            return
          }

          const displayName = inferFolderDisplayName(files)
          const snapshot: MeridianFolderSnapshot = {
            name: displayName,
            validation,
          }
          const root = createFileListDocsRoot(files, displayName)
          handleRef.current = null
          bindFolder(snapshot, root)
        } catch (cause) {
          const message =
            cause instanceof Error ? cause.message : "Could not open folder."
          failOpenSession(message, generation)
        }
      })()
    },
    [beginHardResetSync, bindFolder, cancelOpening, failOpenSession],
  )

  const completeGrantReadPermission = useCallback(
    async (permissionPromise: Promise<PermissionState>, generation: number) => {
      const handle = handleRef.current
      if (!handle) {
        return
      }

      try {
        const state = await permissionPromise

        if (!shouldApplyAsyncResult(generation, openFolderGenerationRef.current)) {
          return
        }

        setError(null)
        setStatus("opening")

        if (state !== "granted") {
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
    },
    [finishOpenWithHandle],
  )

  useEffect(() => {
    if (demoBuild || !canPersistAcrossReload) {
      return
    }

    const generation = ++restoreGenerationRef.current
    let cancelled = false

    async function restoreFromStorage() {
      const handle = await restoreMeridianFolderHandle()
      if (cancelled || generation !== restoreGenerationRef.current) {
        return
      }
      if (folderKeyRef.current) {
        return
      }

      if (!handle) {
        setStatus("none")
        return
      }

      setStatus("opening")

      if (!(await hasReadPermission(handle))) {
        setPermissionRequiredForHandle(handle)
        return
      }

      openFolderGenerationRef.current += 1
      const restoreGeneration = openFolderGenerationRef.current
      const timeout = new Promise<"timeout">((resolve) =>
        setTimeout(() => resolve("timeout"), 5000),
      )
      const result = await Promise.race([
        finishOpenWithHandle(handle, restoreGeneration)
          .then(() => "done" as const)
          .catch(() => "done" as const),
        timeout,
      ])
      if (cancelled || restoreGeneration !== openFolderGenerationRef.current) {
        return
      }
      if (result === "timeout" || !folderKeyRef.current) {
        await clearFolderHandle()
        clearBoundFolder()
        setStatus("none")
      }
    }

    void restoreFromStorage()

    return () => {
      cancelled = true
    }
  }, [
    canPersistAcrossReload,
    clearBoundFolder,
    demoBuild,
    finishOpenWithHandle,
    setPermissionRequiredForHandle,
  ])

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

  const openFolder = useCallback(() => {
    if (!demoBuild) {
      return
    }

    const generation = beginHardResetSync()
    void (async () => {
      try {
        await finishOpenDemo()
        if (!shouldApplyAsyncResult(generation, openFolderGenerationRef.current)) {
          return
        }
      } catch (cause) {
        const message =
          cause instanceof Error ? cause.message : "Could not load demo project."
        failOpenSession(message, generation)
      }
    })()
  }, [beginHardResetSync, demoBuild, failOpenSession, finishOpenDemo])

  const grantReadPermission = useCallback(() => {
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
    const permissionPromise = startReadPermissionRequestFromUserGesture(handle)
    void completeGrantReadPermission(permissionPromise, generation)
  }, [completeGrantReadPermission, demoBuild, finishOpenDemo])

  const clearFolder = useCallback(async () => {
    beginHardResetSync({ clearPersistedHandle: true })
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
  }, [beginHardResetSync, demoBuild, finishOpenDemo])

  const getDocsRoot = useCallback(async () => {
    const resolved = resolveMeridianDocsRoot(docsRootRef.current, handleRef.current)
    if (resolved && resolved !== docsRootRef.current) {
      docsRootRef.current = resolved
      setDocsRoot(resolved)
    }
    return resolved
  }, [])

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
      openFolderFromPicker,
      applyFolderFromFileList,
      cancelOpening,
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
      openFolderFromPicker,
      applyFolderFromFileList,
      cancelOpening,
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
