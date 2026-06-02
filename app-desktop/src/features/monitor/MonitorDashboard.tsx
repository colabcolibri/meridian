import { useState } from "react"

import { Loader2 } from "lucide-react"

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
import { MonitorIssuesBanner } from "@/features/monitor/components/MonitorIssuesBanner"
import {
  GUIDE_VIEWS,
  MonitorTabs,
  type MonitorView,
} from "@/features/monitor/components/MonitorTabs"
import { MonitorTopBar } from "@/features/monitor/components/MonitorTopBar"
import { SetupMonitorView } from "@/features/monitor/components/SetupMonitorView"
import { UsageGuideView } from "@/features/monitor/components/UsageGuideView"
import { WelcomeScreen } from "@/features/monitor/components/WelcomeScreen"
import { MonitorVersionFilterProvider } from "@/features/monitor/MonitorVersionFilterContext"
import { MONITOR_CONTAINER } from "@/features/monitor/monitor-layout"

const emptyStoryBodies = new Map<string, string>()

function isGuideView(view: MonitorView): boolean {
  return GUIDE_VIEWS.includes(view)
}

function MonitorProjectContent() {
  const [view, setView] = useState<MonitorView>("concepts")
  const { folder } = useProjectFolder()
  const { loading, data, issues } = useProjectData()

  const phaseDocuments = data?.phaseDocuments ?? []
  const userStories = data?.userStories ?? []
  const epics = data?.epics ?? []
  const versions = data?.versions ?? []
  const sprints = data?.sprints ?? []
  const decisionDays = data?.decisionDays ?? []
  const storyBodies = data?.storyBodies ?? emptyStoryBodies

  return (
    <MonitorVersionFilterProvider stories={userStories} versions={versions}>
      <MonitorTopBar />
      <MonitorTabs
        active={view}
        isTabDisabled={(tab) => !folder && !isGuideView(tab)}
        onChange={setView}
      />

      {!folder && !isGuideView(view) ? <WelcomeScreen /> : null}

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
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading project…
            </div>
          ) : null}

          {!loading && view === "setup" ? (
            <>
              <AdvancedToolsPanel folderName={folder.name} />
              <SetupMonitorView documents={phaseDocuments} issues={issues} />
            </>
          ) : null}

          {!loading && view === "decisions" ? (
            <DecisionsView decisionDays={decisionDays} />
          ) : null}

          {!loading && view === "epics" ? (
            <DeliverablesView
              epics={epics}
              sprints={sprints}
              stories={userStories}
              versions={versions}
            />
          ) : null}

          {!loading && view === "kanban" ? (
            <KanbanView
              epics={epics}
              issues={issues}
              stories={userStories}
              storyBodies={storyBodies}
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
