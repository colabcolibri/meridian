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
import { shouldApplyAsyncResult } from "@/features/folder/folder-open-session"
import {
  isFolderInputSupported,
  isFileSystemAccessSupported,
} from "@/features/folder/folder-access"
import {
  createHttpDocsRoot,
  probeHttpServer,
} from "@/features/folder/http-folder-access"
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
  openFolderFromPath: (folderPath: string) => void
  applyFolderFromFileList: (files: File[]) => void
  cancelOpening: () => void
  clearFolder: () => Promise<void>
  storedPath: string | null
  getDocsRoot: () => Promise<MeridianDocsRoot | null>
  getHandle: () => Promise<FileSystemDirectoryHandle | null>
}

const LOCAL_PATH_KEY = "meridian.localFolderPath"

function loadStoredPath(): string | null {
  try {
    const raw = localStorage.getItem(LOCAL_PATH_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { path?: string }
    return parsed.path ?? null
  } catch {
    return null
  }
}

function saveStoredPath(p: string) {
  localStorage.setItem(LOCAL_PATH_KEY, JSON.stringify({ path: p }))
}

function clearStoredPath() {
  localStorage.removeItem(LOCAL_PATH_KEY)
}

const ProjectFolderContext = createContext<ProjectFolderContextValue | null>(null)

export function ProjectFolderProvider({ children }: { children: ReactNode }) {
  const demoBuild = isDemoMode()
  const [storedPath, setStoredPath] = useState<string | null>(() =>
    demoBuild ? null : loadStoredPath(),
  )
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

  const beginHardResetSync = useCallback((): number => {
    restoreGenerationRef.current += 1
    openFolderGenerationRef.current += 1
    const generation = openFolderGenerationRef.current

    clearBindingState()
    setError(null)
    setStatus("opening")

    return generation
  }, [clearBindingState])

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

  const finishOpenDemo = useCallback(async () => {
    const opened = await openDemoMeridianFolder()
    handleRef.current = null
    bindFolder(opened.snapshot, opened.docsRoot)
  }, [bindFolder])

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

  const openFolderFromPath = useCallback(
    (folderPath: string) => {
      saveStoredPath(folderPath)
      setStoredPath(folderPath)
      const generation = beginHardResetSync()

      void (async () => {
        try {
          const reachable = await probeHttpServer(folderPath)
          if (!reachable) {
            throw new Error(
              "Local file server not reachable. Make sure `pnpm dev` is running.",
            )
          }
          if (!shouldApplyAsyncResult(generation, openFolderGenerationRef.current)) {
            return
          }
          const root = createHttpDocsRoot(folderPath)
          const { validateMeridianFolder, assertMeridianFolder } =
            await import("@/features/folder/validate-meridian-folder-http")
          const validation = await validateMeridianFolder(root)
          const invalidMessage = assertMeridianFolder(validation)
          if (invalidMessage) throw new Error(invalidMessage)
          if (!shouldApplyAsyncResult(generation, openFolderGenerationRef.current)) {
            return
          }
          const displayName = root.displayName
          bindFolder({ name: displayName, validation }, root)
        } catch (cause) {
          const message =
            cause instanceof Error ? cause.message : "Could not open folder."
          failOpenSession(message, generation)
        }
      })()
    },
    [beginHardResetSync, bindFolder, failOpenSession],
  )

  useEffect(() => {
    if (demoBuild || !storedPath) return

    const generation = ++restoreGenerationRef.current
    let cancelled = false

    void (async () => {
      try {
        const reachable = await probeHttpServer(storedPath)
        if (cancelled || generation !== restoreGenerationRef.current) return
        if (!reachable) {
          setStatus("none")
          return
        }
        openFolderGenerationRef.current += 1
        const restoreGeneration = openFolderGenerationRef.current
        setStatus("opening")
        const root = createHttpDocsRoot(storedPath)
        const { validateMeridianFolder, assertMeridianFolder } =
          await import("@/features/folder/validate-meridian-folder-http")
        const validation = await validateMeridianFolder(root)
        if (cancelled || restoreGeneration !== openFolderGenerationRef.current) return
        const invalidMessage = assertMeridianFolder(validation)
        if (invalidMessage) {
          clearStoredPath()
          setStoredPath(null)
          clearBoundFolder()
          setError(invalidMessage)
          return
        }
        const displayName = root.displayName
        bindFolder({ name: displayName, validation }, root)
      } catch {
        if (cancelled) return
        clearStoredPath()
        setStoredPath(null)
        clearBoundFolder()
      }
    })()

    return () => {
      cancelled = true
    }
  }, [demoBuild, storedPath, clearBoundFolder, bindFolder])

  const clearFolder = useCallback(async () => {
    clearStoredPath()
    setStoredPath(null)
    beginHardResetSync()

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
    return handleRef.current
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
      openFolderFromPath,
      applyFolderFromFileList,
      cancelOpening,
      clearFolder,
      getDocsRoot,
      getHandle,
      storedPath,
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
      openFolderFromPath,
      applyFolderFromFileList,
      cancelOpening,
      clearFolder,
      getDocsRoot,
      getHandle,
      storedPath,
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
