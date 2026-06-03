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
import type { StoryDocumentationBadge } from "@/domain/meridian/story-body"
import {
  enrichUserStoryValidation,
  loadMeridianProjectCore,
  loadMeridianProjectSupplement,
  mergeMeridianProject,
  type MeridianProjectData,
} from "@/features/folder/project-loader"
import { useProjectFolder } from "@/features/folder/ProjectFolderContext"

interface ProjectDataContextValue {
  loading: boolean
  loadingSupplement: boolean
  enrichingStories: boolean
  data: MeridianProjectData | null
  issues: MonitorIssue[]
  documentationBadges: ReadonlyMap<string, StoryDocumentationBadge | null>
  reload: () => Promise<void>
}

const emptyData: MeridianProjectData = {
  phaseDocuments: [],
  userStories: [],
  epics: [],
  versions: [],
  sprints: [],
  decisionDays: [],
  board: [],
  issues: [],
}

const EMPTY_ISSUES: MonitorIssue[] = []
const EMPTY_BADGES = new Map<string, StoryDocumentationBadge | null>()

const ENRICH_IDLE_DELAY_MS = 400

function scheduleIdleWork(callback: () => void): void {
  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(() => callback(), { timeout: 3000 })
    return
  }
  setTimeout(callback, ENRICH_IDLE_DELAY_MS)
}

const ProjectDataContext = createContext<ProjectDataContextValue | null>(null)

export function ProjectDataProvider({ children }: { children: ReactNode }) {
  const { folderKey, status: folderStatus, getHandle } = useProjectFolder()
  const [loading, setLoading] = useState(false)
  const [loadingSupplement, setLoadingSupplement] = useState(false)
  const [enrichingStories, setEnrichingStories] = useState(false)
  const [data, setData] = useState<MeridianProjectData | null>(null)
  const [bodyIssues, setBodyIssues] = useState<MonitorIssue[]>([])
  const [documentationBadges, setDocumentationBadges] = useState(
    EMPTY_BADGES as Map<string, StoryDocumentationBadge | null>,
  )
  const loadGenerationRef = useRef(0)
  const enrichGenerationRef = useRef(0)

  const startStoryEnrichment = useCallback(
    (
      handle: FileSystemDirectoryHandle,
      stories: MeridianProjectData["userStories"],
    ) => {
      const enrichGeneration = ++enrichGenerationRef.current
      setEnrichingStories(true)

      const run = () => {
        void enrichUserStoryValidation(handle, stories)
          .then((enrichment) => {
            if (enrichGeneration !== enrichGenerationRef.current) {
              return
            }
            setBodyIssues(enrichment.bodyIssues)
            setDocumentationBadges(enrichment.documentationBadges)
          })
          .catch(() => {
            if (enrichGeneration !== enrichGenerationRef.current) {
              return
            }
            setBodyIssues([])
          })
          .finally(() => {
            if (enrichGeneration === enrichGenerationRef.current) {
              setEnrichingStories(false)
            }
          })
      }

      scheduleIdleWork(run)
    },
    [],
  )

  const reload = useCallback(async () => {
    const handle = await getHandle()
    if (!handle) {
      setData(null)
      setBodyIssues([])
      setDocumentationBadges(new Map())
      setEnrichingStories(false)
      setLoadingSupplement(false)
      setLoading(false)
      enrichGenerationRef.current += 1
      return
    }

    const generation = ++loadGenerationRef.current
    enrichGenerationRef.current += 1
    setLoading(true)
    setLoadingSupplement(false)
    setEnrichingStories(false)
    setBodyIssues([])
    setDocumentationBadges(new Map())

    try {
      const core = await loadMeridianProjectCore(handle)
      if (generation !== loadGenerationRef.current) {
        return
      }

      setData({
        ...core,
        epics: [],
        versions: [],
        sprints: [],
        decisionDays: [],
      })
      setLoading(false)
      setLoadingSupplement(true)

      void loadMeridianProjectSupplement(handle)
        .then((supplement) => {
          if (generation !== loadGenerationRef.current) {
            return
          }
          setData(mergeMeridianProject(core, supplement))
          setLoadingSupplement(false)
          startStoryEnrichment(handle, core.userStories)
        })
        .catch(() => {
          if (generation !== loadGenerationRef.current) {
            return
          }
          setLoadingSupplement(false)
          startStoryEnrichment(handle, core.userStories)
        })
    } catch (error) {
      if (generation !== loadGenerationRef.current) {
        return
      }
      setData({
        ...emptyData,
        issues: [
          {
            file: ".",
            message: error instanceof Error ? error.message : "Failed to load project.",
            severity: "error",
            scope: "parse",
          },
        ],
      })
      setLoading(false)
      setLoadingSupplement(false)
      setEnrichingStories(false)
    }
  }, [getHandle, startStoryEnrichment])

  useEffect(() => {
    if (folderStatus !== "open" || !folderKey) {
      if (
        folderStatus === "none" ||
        folderStatus === "error" ||
        folderStatus === "permission_required" ||
        folderStatus === "opening"
      ) {
        loadGenerationRef.current += 1
        enrichGenerationRef.current += 1
        if (folderStatus !== "opening") {
          setData(null)
          setBodyIssues([])
          setDocumentationBadges(new Map())
        }
        setLoading(false)
        setLoadingSupplement(false)
        setEnrichingStories(false)
      }
      return
    }

    void reload()
  }, [folderKey, folderStatus, reload])

  const indexIssues = data?.issues ?? EMPTY_ISSUES
  const issues = useMemo(
    () => (bodyIssues.length === 0 ? indexIssues : [...indexIssues, ...bodyIssues]),
    [bodyIssues, indexIssues],
  )

  const value = useMemo(
    () => ({
      loading,
      loadingSupplement,
      enrichingStories,
      data,
      issues,
      documentationBadges,
      reload,
    }),
    [
      loading,
      loadingSupplement,
      enrichingStories,
      data,
      issues,
      documentationBadges,
      reload,
    ],
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
