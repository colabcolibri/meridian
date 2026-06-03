import { AlertTriangle, CheckCircle2, Lock, Pencil } from "lucide-react"

import type { MonitorIssue } from "@/domain/meridian/monitor-issues"
import type { PhaseDocument, SetupStepState } from "@/domain/meridian/types"
import { getSetupStepState } from "@/domain/meridian/validators"
import { setupStepMeta } from "@/features/monitor/monitor-theme"
import { setupStepStyles } from "@/features/monitor/setup-step-styles"
import { cn } from "@/lib/utils"

const stepIcons: Record<SetupStepState, typeof CheckCircle2> = {
  locked: Lock,
  active: Pencil,
  complete: CheckCircle2,
  alert: AlertTriangle,
}

export function PhaseStepCard({
  document,
  documents,
  docIssues,
  canRead,
  onRead,
}: {
  document: PhaseDocument
  documents: PhaseDocument[]
  docIssues: MonitorIssue[]
  canRead: boolean
  onRead: () => void
}) {
  const state = getSetupStepState(document, documents)
  const styles = setupStepStyles[state]
  const Icon = stepIcons[state]
  const hasIssues = docIssues.length > 0

  return (
    <button
      className={cn(
        "flex h-full w-full min-w-0 flex-col items-center rounded-lg border border-border bg-card px-3 py-3.5 text-center shadow-sm transition-colors",
        "hover:border-meridian-border hover:bg-meridian-muted/40",
        "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        "disabled:pointer-events-none disabled:opacity-50",
        state === "active" && "border-meridian-border/80 bg-meridian-muted/25",
        hasIssues && "border-destructive/40",
      )}
      disabled={!canRead}
      onClick={onRead}
      type="button"
      title={hasIssues ? docIssues[0]?.message : document.title}
    >
      <div
        className={cn(
          "flex size-9 items-center justify-center rounded-md",
          styles.tile,
        )}
      >
        <Icon className="size-4" aria-hidden />
      </div>

      <p className="mt-2.5 font-mono text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        {document.id}
      </p>

      <p className="mt-1 line-clamp-2 text-sm font-medium leading-snug text-foreground">
        {document.title}
      </p>

      <p className={cn("mt-1.5 text-[11px] font-medium", styles.statusText)}>
        {setupStepMeta[state].shortLabel}
      </p>

      {hasIssues ? (
        <p className="mt-1 line-clamp-1 text-[10px] text-destructive">Alert</p>
      ) : null}
    </button>
  )
}
