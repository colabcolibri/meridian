export type MonitorView =
  | "concepts"
  | "usage"
  | "setup"
  | "decisions"
  | "epics"
  | "kanban"

export const GUIDE_VIEWS: MonitorView[] = ["concepts", "usage"]

export function isGuideView(view: MonitorView): boolean {
  return GUIDE_VIEWS.includes(view)
}

export const MONITOR_HEADER_TABS: { id: MonitorView; label: string }[] = [
  { id: "concepts", label: "Start here" },
  { id: "usage", label: "Usage guide" },
  { id: "setup", label: "Setup" },
  { id: "decisions", label: "Decisions" },
  { id: "epics", label: "Deliverables" },
  { id: "kanban", label: "Board" },
]
