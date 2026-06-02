import { cn } from "@/lib/utils"

export type MonitorView = "setup" | "epics" | "kanban"

const tabs: { id: MonitorView; label: string; description: string }[] = [
  {
    id: "setup",
    label: "Configuração inicial",
    description: "Documentos 00–11 da pasta docs aberta",
  },
  {
    id: "epics",
    label: "Épicos",
    description: "Capacidades do produto (04_epics)",
  },
  {
    id: "kanban",
    label: "Kanban",
    description: "User stories por status e epic",
  },
]

export function MonitorTabs({
  active,
  onChange,
}: {
  active: MonitorView
  onChange: (view: MonitorView) => void
}) {
  return (
    <nav
      aria-label="Visões do monitor"
      className="mx-auto max-w-7xl border-b bg-white px-6"
    >
      <div className="flex gap-1 overflow-x-auto py-2">
        {tabs.map((tab) => (
          <button
            className={cn(
              "min-w-[140px] shrink-0 rounded-md px-4 py-3 text-left transition-colors",
              active === tab.id
                ? "bg-teal-50 ring-1 ring-teal-200"
                : "hover:bg-zinc-50",
            )}
            key={tab.id}
            onClick={() => onChange(tab.id)}
            type="button"
          >
            <div
              className={cn(
                "text-sm font-medium",
                active === tab.id ? "text-teal-900" : "text-zinc-800",
              )}
            >
              {tab.label}
            </div>
            <div className="mt-0.5 text-xs text-zinc-500">{tab.description}</div>
          </button>
        ))}
      </div>
    </nav>
  )
}
