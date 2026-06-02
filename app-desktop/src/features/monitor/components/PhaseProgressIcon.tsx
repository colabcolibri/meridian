import { cn } from "@/lib/utils"

const R = 16
const CIRCUMFERENCE = 2 * Math.PI * R

export function PhaseProgressIcon({
  complete,
  total,
  hasAlert,
}: {
  complete: number
  total: number
  hasAlert: boolean
}) {
  const safeTotal = Math.max(total, 1)
  const ratio = complete / safeTotal
  const offset = CIRCUMFERENCE * (1 - ratio)
  const done = complete === total && total > 0

  const ringStroke = done
    ? "stroke-meridian-success"
    : ratio > 0
      ? "stroke-meridian"
      : "stroke-zinc-300"

  return (
    <div
      className="relative size-11 shrink-0"
      aria-label={`${complete} de ${total} documentos prontos nesta fase`}
      role="img"
    >
      <svg className="size-11 -rotate-90" viewBox="0 0 40 40" aria-hidden>
        <circle
          className="stroke-muted"
          cx="20"
          cy="20"
          fill="none"
          r={R}
          strokeWidth="3"
        />
        <circle
          className={cn("transition-[stroke-dashoffset] duration-300", ringStroke)}
          cx="20"
          cy="20"
          fill="none"
          r={R}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth="3"
        />
      </svg>
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center font-mono text-[11px] font-semibold tabular-nums",
          done
            ? "text-meridian-success"
            : ratio > 0
              ? "text-meridian"
              : "text-muted-foreground",
        )}
      >
        {complete}/{total}
      </span>
      {hasAlert ? (
        <span
          aria-hidden
          className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-card bg-destructive"
        />
      ) : null}
    </div>
  )
}
