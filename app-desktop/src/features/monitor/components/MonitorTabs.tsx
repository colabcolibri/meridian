import { cn } from "@/lib/utils"
import { MONITOR_CONTAINER } from "@/features/monitor/monitor-layout"
import { typeScale } from "@/features/monitor/monitor-typography"
import type { MonitorView } from "@/features/monitor/monitor-views"

const tabs: { id: MonitorView; label: string; hint: string }[] = [
  {
    id: "concepts",
    label: "Start here",
    hint: "What Meridian is, folders, phases, and concepts",
  },
  {
    id: "usage",
    label: "Usage guide",
    hint: "Step-by-step: document, backlog, implement, close, commit.",
  },
  {
    id: "setup",
    label: "Setup",
    hint: "Progress of the project's initial documents",
  },
  {
    id: "decisions",
    label: "Decisions",
    hint: "History by date — docs/decisions/YYYY-MM-DD.json",
  },
  {
    id: "epics",
    label: "Deliverables",
    hint: "Large product capability blocks",
  },
  {
    id: "kanban",
    label: "Board",
    hint: "Status of each user story",
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
