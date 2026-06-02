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

import type { MonitorIssue } from "@/domain/meridian/monitor-issues"
import {
  loadMeridianProject,
  type MeridianProjectData,
} from "@/features/folder/project-loader"
import { useProjectFolder } from "@/features/folder/ProjectFolderContext"

interface ProjectDataContextValue {
  loading: boolean
  data: MeridianProjectData | null
  issues: MonitorIssue[]
  reload: () => Promise<void>
}

const emptyData: MeridianProjectData = {
  phaseDocuments: [],
  userStories: [],
  epics: [],
  board: null,
  issues: [],
}

const EMPTY_ISSUES: MonitorIssue[] = []

const ProjectDataContext = createContext<ProjectDataContextValue | null>(null)

export function ProjectDataProvider({ children }: { children: ReactNode }) {
  const { folderKey, status: folderStatus, getHandle } = useProjectFolder()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<MeridianProjectData | null>(null)
  const loadGenerationRef = useRef(0)

  const reload = useCallback(async () => {
    const handle = await getHandle()
    if (!handle) {
      setData(null)
      setLoading(false)
      return
    }

    const generation = ++loadGenerationRef.current
    setLoading(true)

    try {
      const loaded = await loadMeridianProject(handle)
      if (generation !== loadGenerationRef.current) {
        return
      }
      setData(loaded)
    } catch (error) {
      if (generation !== loadGenerationRef.current) {
        return
      }
      setData({
        ...emptyData,
        issues: [
          {
            file: ".",
            message:
              error instanceof Error ? error.message : "Falha ao carregar projeto.",
            severity: "error",
            scope: "parse",
          },
        ],
      })
    } finally {
      if (generation === loadGenerationRef.current) {
        setLoading(false)
      }
    }
  }, [getHandle])

  useEffect(() => {
    if (folderStatus !== "open" || !folderKey) {
      if (folderStatus === "none" || folderStatus === "error") {
        loadGenerationRef.current += 1
        setData(null)
        setLoading(false)
      }
      return
    }

    void reload()
  }, [folderKey, folderStatus, reload])

  const issues = data?.issues ?? EMPTY_ISSUES

  const value = useMemo(
    () => ({
      loading,
      data,
      issues,
      reload,
    }),
    [loading, data, issues, reload],
  )

  return (
    <ProjectDataContext.Provider value={value}>{children}</ProjectDataContext.Provider>
  )
}

export function useProjectData(): ProjectDataContextValue {
  const context = useContext(ProjectDataContext)
  if (!context) {
    throw new Error("useProjectData must be used within ProjectDataProvider")
  }
  return context
}
