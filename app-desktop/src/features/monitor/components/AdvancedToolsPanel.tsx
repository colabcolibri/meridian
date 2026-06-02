import { ChevronDown, Wrench } from "lucide-react"
import { useState } from "react"

import { ScriptValidationPanel } from "@/features/monitor/components/ScriptValidationPanel"
import { monitorDashedPanelClass } from "@/features/monitor/monitor-ui"
import { typeScale } from "@/features/monitor/monitor-typography"
import { cn } from "@/lib/utils"

export function AdvancedToolsPanel({ folderName }: { folderName?: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={monitorDashedPanelClass}>
      <button
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm text-foreground"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <span className={cn(typeScale.label, "inline-flex items-center gap-2")}>
          <Wrench className="h-4 w-4 text-muted-foreground" />
          Ferramentas avançadas
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open ? (
        <div className="border-t border-border px-2 pb-2 pt-1">
          <ScriptValidationPanel folderName={folderName} />
        </div>
      ) : null}
    </div>
  )
}
