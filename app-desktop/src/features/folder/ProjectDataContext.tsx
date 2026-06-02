import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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

const ProjectDataContext = createContext<ProjectDataContextValue | null>(null)

export function ProjectDataProvider({ children }: { children: ReactNode }) {
  const { folder, status: folderStatus, getHandle } = useProjectFolder()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<MeridianProjectData | null>(null)

  const reload = useCallback(async () => {
    const handle = await getHandle()
    if (!handle) {
      setData(null)
      return
    }

    setLoading(true)
    try {
      const loaded = await loadMeridianProject(handle)
      setData(loaded)
    } catch (error) {
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
      setLoading(false)
    }
  }, [getHandle])

  useEffect(() => {
    if (folderStatus === "open" && folder) {
      void reload()
      return
    }
    if (folderStatus === "none" || folderStatus === "error") {
      setData(null)
    }
  }, [folder, folderStatus, reload])

  const issues = data?.issues ?? []

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
