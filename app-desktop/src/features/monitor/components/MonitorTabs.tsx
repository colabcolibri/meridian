import { cn } from "@/lib/utils"
import { MONITOR_CONTAINER } from "@/features/monitor/monitor-layout"

export type MonitorView = "setup" | "epics" | "kanban"

const tabs: { id: MonitorView; label: string; hint: string }[] = [
  {
    id: "setup",
    label: "Configuração",
    hint: "Progresso dos documentos iniciais do projeto",
  },
  {
    id: "epics",
    label: "Entregas",
    hint: "Grandes blocos de capacidade do produto",
  },
  {
    id: "kanban",
    label: "Quadro",
    hint: "Status de cada user story",
  },
]

export function MonitorTabs({
  active,
  onChange,
  disabled,
}: {
  active: MonitorView
  onChange: (view: MonitorView) => void
  disabled?: boolean
}) {
  const activeTab = tabs.find((tab) => tab.id === active)

  return (
    <div className="border-b border-zinc-200/80 bg-white">
      <nav
        aria-label="Visões do monitor"
        className={cn(MONITOR_CONTAINER, "flex gap-1 overflow-x-auto py-2")}
      >
        {tabs.map((tab) => (
          <button
            aria-current={active === tab.id ? "page" : undefined}
            className={cn(
              "shrink-0 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
              disabled && "pointer-events-none opacity-50",
              active === tab.id
                ? "bg-teal-700 text-white shadow-sm"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
            )}
            disabled={disabled}
            key={tab.id}
            onClick={() => onChange(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </nav>
      {activeTab ? (
        <p
          className={cn(
            MONITOR_CONTAINER,
            "hidden border-t border-zinc-100 pb-2 pt-2 text-xs text-zinc-500 sm:block",
          )}
        >
          {activeTab.hint}
        </p>
      ) : null}
    </div>
  )
}
