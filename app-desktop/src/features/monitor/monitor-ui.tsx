import { cn } from "@/lib/utils"

/** Painel elevado reutilizado em filtros, alertas e cards do monitor. */
export const monitorPanelClass =
  "rounded-xl border border-border bg-card text-card-foreground shadow-sm"

/** Panel with dashed border (secondary tools). */
export const monitorDashedPanelClass =
  "rounded-xl border border-dashed border-border bg-muted/30"

/** Inline `<code>` inside monitor paragraphs. */
export const inlineCodeClass = "rounded bg-muted px-1.5 py-0.5 font-mono text-xs"

/** Filter chip (version, epic, etc.). */
export function filterChipClass(active: boolean) {
  return cn(
    "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
    active
      ? "bg-primary text-primary-foreground shadow-sm"
      : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  )
}

/** Barra de progresso simples (0–100). */
export function ProgressBar({
  value,
  className,
}: {
  value: number
  className?: string
}) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={clamped}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", className)}
      role="progressbar"
    >
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-300"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
