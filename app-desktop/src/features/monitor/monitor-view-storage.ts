import type { MonitorView } from "@/features/monitor/monitor-views"

const STORAGE_KEY = "meridian.monitor.activeView"

const VALID_VIEWS: MonitorView[] = [
  "concepts",
  "usage",
  "setup",
  "decisions",
  "epics",
  "kanban",
]

export function readStoredMonitorView(): MonitorView | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw || !VALID_VIEWS.includes(raw as MonitorView)) {
      return null
    }
    return raw as MonitorView
  } catch {
    return null
  }
}

export function writeStoredMonitorView(view: MonitorView): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, view)
  } catch {
    // sessionStorage unavailable (private mode, quota, etc.)
  }
}
