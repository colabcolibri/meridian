import { cn } from "@/lib/utils"
import { MONITOR_CONTAINER } from "@/features/monitor/monitor-layout"
import { typeScale } from "@/features/monitor/monitor-typography"

export type MonitorView =
  | "concepts"
  | "usage"
  | "setup"
  | "decisions"
  | "epics"
  | "kanban"

const GUIDE_VIEWS: MonitorView[] = ["concepts", "usage"]

export { GUIDE_VIEWS }

const tabs: { id: MonitorView; label: string; hint: string }[] = [
  {
    id: "concepts",
    label: "Comece aqui",
    hint: "O que é o Meridian, pastas, fases e conceitos",
  },
  {
    id: "usage",
    label: "Guia de uso",
    hint: "Três fases: documentar, backlog, executar.",
  },
  {
    id: "setup",
    label: "Configuração",
    hint: "Progresso dos documentos iniciais do projeto",
  },
  {
    id: "decisions",
    label: "Decisões",
    hint: "Histórico por data — docs/decisions/YYYY-MM-DD.json",
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
        aria-label="Visões do monitor"
        className={cn(MONITOR_CONTAINER, "flex gap-2 overflow-x-auto py-3")}
      >
        {tabs.map((tab) => {
          const disabled = isTabDisabled?.(tab.id) ?? false

          return (
            <button
              aria-current={active === tab.id ? "page" : undefined}
              className={cn(
                typeScale.tab,
                "shrink-0 rounded-lg px-4 py-2.5 transition-all",
                disabled && "pointer-events-none opacity-50",
                active === tab.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
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
        <p
          className={cn(
            MONITOR_CONTAINER,
            typeScale.caption,
            "hidden border-t py-2.5 sm:block",
          )}
        >
          {activeTab.hint}
        </p>
      ) : null}
    </div>
  )
}
