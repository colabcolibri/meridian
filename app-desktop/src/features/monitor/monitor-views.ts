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

export const MONITOR_HEADER_TABS: { id: MonitorView; label: string; hint: string }[] = [
  {
    id: "concepts",
    label: "Learn",
    hint: "Harness concepts, loop, Scrum map, and artifact reference",
  },
  {
    id: "usage",
    label: "Commands",
    hint: "Day-to-day in the IDE — /init-meridian, /status, /complete-us…",
  },
  {
    id: "setup",
    label: "Setup",
    hint: "Phase documents 00–11 — what is left to approve before the backlog",
  },
  {
    id: "decisions",
    label: "Decisions",
    hint: "Decision log by date — docs/decisions/YYYY-MM-DD.json",
  },
  {
    id: "epics",
    label: "Deliverables",
    hint: "Epics and versions for the product",
  },
  {
    id: "kanban",
    label: "Board",
    hint: "Kanban derived from user stories",
  },
]
