import type { SetupStepState } from "@/domain/meridian/types"
import { setupStepMeta, setupStepLegendOrder } from "@/features/monitor/monitor-theme"
import { setupStepStyles } from "@/features/monitor/setup-step-styles"
import { typeScale } from "@/features/monitor/monitor-typography"
import { cn } from "@/lib/utils"

export function SetupStateLegend({ className }: { className?: string }) {
  return (
    <section
      aria-label="Document state legend"
      className={cn("border-b border-border pb-4", className)}
    >
      <ul className="flex list-none flex-wrap gap-x-6 gap-y-2">
        {setupStepLegendOrder.map((state) => (
          <LegendItem key={state} state={state} />
        ))}
      </ul>
    </section>
  )
}

function LegendItem({ state }: { state: SetupStepState }) {
  const styles = setupStepStyles[state]
  const meta = setupStepMeta[state]

  return (
    <li className="flex items-center gap-1.5">
      <span
        aria-hidden
        className={cn("size-1.5 shrink-0 rounded-full", styles.legendDot)}
      />
      <span className={cn(typeScale.caption, "text-muted-foreground")}>
        <span className="font-medium text-foreground">{meta.shortLabel}</span>
        {" — "}
        {meta.legendHint}
      </span>
    </li>
  )
}
