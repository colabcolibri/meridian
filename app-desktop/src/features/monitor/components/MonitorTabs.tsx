import { cn } from "@/lib/utils"
import { MONITOR_CONTAINER } from "@/features/monitor/monitor-layout"
import { typeScale } from "@/features/monitor/monitor-typography"
import type { MonitorView } from "@/features/monitor/monitor-views"

const tabs: { id: MonitorView; label: string; hint: string }[] = [
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

export function MonitorTabs({
  active,
  onChange,
  isTabDisabled,
}: {
  active: MonitorView
  onChange: (view: MonitorView) => void
  isTabDisabled?: (view: MonitorView) => boolean
}) {
  const activeTab = tabs.find((tab) => tab.id === active)

  return (
    <div className="border-b border-border bg-card">
      <nav
        aria-label="Monitor views"
        className={cn(MONITOR_CONTAINER, "flex gap-0 overflow-x-auto")}
      >
        {tabs.map((tab) => {
          const disabled = isTabDisabled?.(tab.id) ?? false

          return (
            <button
              aria-current={active === tab.id ? "page" : undefined}
              className={cn(
                "shrink-0 rounded-none border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                disabled && "pointer-events-none opacity-40",
                active === tab.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground",
              )}
              disabled={disabled}
              key={tab.id}
              onClick={() => onChange(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          )
        })}
      </nav>
      {activeTab ? (
        <p className={cn(MONITOR_CONTAINER, typeScale.caption, "py-1.5")}>
          {activeTab.hint}
        </p>
      ) : null}
    </div>
  )
}
