import { ChevronDown, Wrench } from "lucide-react"
import { useState } from "react"

import { ScriptValidationPanel } from "@/features/monitor/components/ScriptValidationPanel"
import { cn } from "@/lib/utils"

export function AdvancedToolsPanel({ folderName }: { folderName?: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50">
      <button
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm text-zinc-700"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <span className="inline-flex items-center gap-2 font-medium">
          <Wrench className="h-4 w-4 text-zinc-500" />
          Ferramentas avançadas
        </span>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 transition-transform", open && "rotate-180")}
        />
      </button>
      {open ? (
        <div className="border-t border-zinc-200 px-2 pb-2 pt-1">
          <ScriptValidationPanel folderName={folderName} />
        </div>
      ) : null}
    </div>
  )
}
