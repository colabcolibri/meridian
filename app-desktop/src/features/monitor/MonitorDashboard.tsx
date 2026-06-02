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
import { EpicsView } from "@/features/monitor/components/EpicsView"
import { KanbanView } from "@/features/monitor/components/KanbanView"
import { MonitorIssuesBanner } from "@/features/monitor/components/MonitorIssuesBanner"
import {
  MonitorTabs,
  type MonitorView,
} from "@/features/monitor/components/MonitorTabs"
import { MonitorTopBar } from "@/features/monitor/components/MonitorTopBar"
import { SetupMonitorView } from "@/features/monitor/components/SetupMonitorView"
import { WelcomeScreen } from "@/features/monitor/components/WelcomeScreen"
import { MONITOR_CONTAINER, MONITOR_PAGE } from "@/features/monitor/monitor-layout"

function MonitorViews() {
  const [view, setView] = useState<MonitorView>("concepts")
  const { folder } = useProjectFolder()
  const { loading, data, issues } = useProjectData()

  const phaseDocuments = data?.phaseDocuments ?? []
  const userStories = data?.userStories ?? []
  const epics = data?.epics ?? []

  return (
    <div className={MONITOR_PAGE}>
      <MonitorTopBar />
      <MonitorTabs
        active={view}
        isTabDisabled={(tab) => !folder && tab !== "concepts"}
        onChange={setView}
      />

      {!folder && view !== "concepts" ? <WelcomeScreen /> : null}

      {view === "concepts" ? (
        <div className={`${MONITOR_CONTAINER} py-6`}>
          <ConceptsView />
        </div>
      ) : null}

      {folder && view !== "concepts" ? (
        <div className={`${MONITOR_CONTAINER} space-y-5 py-6`}>
          <MonitorIssuesBanner issues={issues} />
          <AdvancedToolsPanel folderName={folder.name} />

          {loading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-zinc-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              Carregando projeto…
            </div>
          ) : null}

          {!loading && view === "setup" ? (
            <SetupMonitorView documents={phaseDocuments} issues={issues} />
          ) : null}

          {!loading && view === "epics" ? (
            <EpicsView epics={epics} stories={userStories} />
          ) : null}

          {!loading && view === "kanban" ? (
            <KanbanView epics={epics} issues={issues} stories={userStories} />
          ) : null}
        </div>
      ) : null}

      {folder &&
      view !== "concepts" &&
      !loading &&
      view !== "setup" &&
      phaseDocuments.length === 0 ? (
        <p className={`${MONITOR_CONTAINER} py-8 text-sm text-zinc-600`}>
          Não foi possível ler os documentos. Volte à aba Configuração ou troque a
          pasta.
        </p>
      ) : null}
    </div>
  )
}

export function MonitorDashboard() {
  return (
    <main>
      <ProjectFolderProvider>
        <ProjectDataProvider>
          <MonitorViews />
        </ProjectDataProvider>
      </ProjectFolderProvider>
    </main>
  )
}
