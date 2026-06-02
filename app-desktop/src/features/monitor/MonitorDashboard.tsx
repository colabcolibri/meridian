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
import { EpicsView } from "@/features/monitor/components/EpicsView"
import { FolderToolbar } from "@/features/monitor/components/FolderToolbar"
import { KanbanView } from "@/features/monitor/components/KanbanView"
import { MonitorHeader } from "@/features/monitor/components/MonitorHeader"
import {
  MonitorTabs,
  type MonitorView,
} from "@/features/monitor/components/MonitorTabs"
import { OpenFolderPrompt } from "@/features/monitor/components/OpenFolderPrompt"
import { MonitorIssuesBanner } from "@/features/monitor/components/MonitorIssuesBanner"
import { ScriptValidationPanel } from "@/features/monitor/components/ScriptValidationPanel"
import { SetupMonitorView } from "@/features/monitor/components/SetupMonitorView"

function MonitorViews() {
  const [view, setView] = useState<MonitorView>("setup")
  const { folder } = useProjectFolder()
  const { loading, data, issues } = useProjectData()

  const phaseDocuments = data?.phaseDocuments ?? []
  const userStories = data?.userStories ?? []
  const epics = data?.epics ?? []

  return (
    <>
      <MonitorHeader />
      <FolderToolbar />
      <MonitorTabs active={view} onChange={setView} />

      <div className="mx-auto max-w-7xl space-y-5 px-6 py-6">
        <OpenFolderPrompt />
        <MonitorIssuesBanner issues={issues} />
        {folder ? <ScriptValidationPanel folderName={folder.name} /> : null}

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-zinc-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Lendo documentos da pasta{folder ? ` ${folder.name}` : ""}…
          </div>
        ) : null}

        {!loading && folder && view === "setup" ? (
          <SetupMonitorView documents={phaseDocuments} issues={issues} />
        ) : null}

        {!loading && folder && view === "epics" ? (
          <EpicsView epics={epics} stories={userStories} />
        ) : null}

        {!loading && folder && view === "kanban" ? (
          <KanbanView epics={epics} issues={issues} stories={userStories} />
        ) : null}

        {!loading && !folder && view !== "setup" ? (
          <p className="text-sm text-zinc-600">
            Abra a pasta docs do projeto para carregar esta visão.
          </p>
        ) : null}
      </div>
    </>
  )
}

export function MonitorDashboard() {
  return (
    <main className="min-h-screen bg-zinc-50">
      <ProjectFolderProvider>
        <ProjectDataProvider>
          <MonitorViews />
        </ProjectDataProvider>
      </ProjectFolderProvider>
    </main>
  )
}
