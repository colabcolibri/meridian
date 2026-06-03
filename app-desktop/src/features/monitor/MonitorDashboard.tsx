import { useCallback, useState } from "react"

import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  ProjectDataProvider,
  useProjectData,
} from "@/features/folder/ProjectDataContext"
import {
  ProjectFolderProvider,
  useProjectFolder,
} from "@/features/folder/ProjectFolderContext"
import { AdvancedToolsPanel } from "@/features/monitor/components/AdvancedToolsPanel"
import { ConceptsView } from "@/features/monitor/components/ConceptsView"
import { DecisionsView } from "@/features/monitor/components/DecisionsView"
import { DeliverablesView } from "@/features/monitor/components/DeliverablesView"
import { KanbanView } from "@/features/monitor/components/KanbanView"
import { MonitorHeader } from "@/features/monitor/components/MonitorHeader"
import { isGuideView, type MonitorView } from "@/features/monitor/monitor-views"
import { MonitorIssuesBanner } from "@/features/monitor/components/MonitorIssuesBanner"
import { SetupMonitorView } from "@/features/monitor/components/SetupMonitorView"
import { UsageGuideView } from "@/features/monitor/components/UsageGuideView"
import { WelcomeScreen } from "@/features/monitor/components/WelcomeScreen"
import { MonitorVersionFilterProvider } from "@/features/monitor/MonitorVersionFilterContext"
import { MONITOR_CONTAINER } from "@/features/monitor/monitor-layout"
import {
  readStoredMonitorView,
  writeStoredMonitorView,
} from "@/features/monitor/monitor-view-storage"

function MonitorProjectContent() {
  const [view, setView] = useState<MonitorView>(
    () => readStoredMonitorView() ?? "concepts",
  )
  const changeView = useCallback((next: MonitorView) => {
    setView(next)
    writeStoredMonitorView(next)
  }, [])
  const {
    folder,
    status: folderStatus,
    isDemoActive,
    cancelOpening,
  } = useProjectFolder()
  const { loading, loadingSupplement, data, issues, documentationBadges } =
    useProjectData()

  const phaseDocuments = data?.phaseDocuments ?? []
  const userStories = data?.userStories ?? []
  const epics = data?.epics ?? []
  const versions = data?.versions ?? []
  const sprints = data?.sprints ?? []
  const decisionDays = data?.decisionDays ?? []

  return (
    <MonitorVersionFilterProvider stories={userStories} versions={versions}>
      <MonitorHeader
        active={view}
        isTabDisabled={(tab) => !folder && !isGuideView(tab)}
        onChange={changeView}
      />

      {!folder && folderStatus === "opening" && !isGuideView(view) ? (
        <div
          className={`${MONITOR_CONTAINER} flex flex-col items-center justify-center gap-3 py-16 text-sm text-muted-foreground`}
        >
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading project from disk…</span>
          <Button size="sm" variant="outline" onClick={cancelOpening}>
            Cancel
          </Button>
        </div>
      ) : null}

      {!folder && folderStatus !== "opening" && !isGuideView(view) ? (
        <WelcomeScreen />
      ) : null}

      {isGuideView(view) ? (
        <div className={`${MONITOR_CONTAINER} py-6`}>
          {view === "concepts" ? <ConceptsView /> : null}
          {view === "usage" ? <UsageGuideView /> : null}
        </div>
      ) : null}

      {folder && !isGuideView(view) ? (
        <div className={`${MONITOR_CONTAINER} space-y-5 py-6`}>
          <MonitorIssuesBanner issues={issues} />

          {loading ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading user stories…
            </div>
          ) : null}

          {!loading && view === "setup" ? (
            <>
              <AdvancedToolsPanel
                folderName={folder.name}
                isDemoActive={isDemoActive}
              />
              <SetupMonitorView documents={phaseDocuments} issues={issues} />
            </>
          ) : null}

          {!loading && view === "decisions" ? (
            <DecisionsView decisionDays={decisionDays} />
          ) : null}

          {!loading && view === "epics" ? (
            <>
              {loadingSupplement ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading deliverables…
                </div>
              ) : null}
              <DeliverablesView
                epics={epics}
                issues={issues}
                sprints={sprints}
                stories={userStories}
                versions={versions}
              />
            </>
          ) : null}

          {!loading && view === "kanban" ? (
            <KanbanView
              documentationBadges={documentationBadges}
              epics={epics}
              issues={issues}
              stories={userStories}
              versions={versions}
            />
          ) : null}
        </div>
      ) : null}

      {folder &&
      !isGuideView(view) &&
      !loading &&
      view !== "setup" &&
      phaseDocuments.length === 0 ? (
        <p className={`${MONITOR_CONTAINER} py-8 text-sm text-muted-foreground`}>
          Could not read the documents. Go back to the Setup tab or change the folder.
        </p>
      ) : null}
    </MonitorVersionFilterProvider>
  )
}

export function MonitorDashboard() {
  return (
    <main>
      <ProjectFolderProvider>
        <ProjectDataProvider>
          <MonitorProjectContent />
        </ProjectDataProvider>
      </ProjectFolderProvider>
    </main>
  )
}
