import { useMemo, useState } from "react"

import { ChevronDown, FileText, History } from "lucide-react"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { DecisionDay, DecisionEntry } from "@/domain/meridian/types"
import { typeScale } from "@/features/monitor/monitor-typography"
import { cn } from "@/lib/utils"

type DecisionSheetTarget = {
  day: DecisionDay
  entry: DecisionEntry
}

function DecisionField({ label, value }: { label: string; value: string }) {
  if (!value) {
    return null
  }

  return (
    <div className="space-y-1">
      <p className={typeScale.label}>{label}</p>
      <p className={cn(typeScale.bodySm, "whitespace-pre-wrap break-words")}>{value}</p>
    </div>
  )
}

function DecisionDetailSheet({
  target,
  open,
  onOpenChange,
}: {
  target: DecisionSheetTarget | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!target) {
    return null
  }

  const { day, entry } = target

  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetContent className="flex h-full flex-col p-0" side="right">
        <SheetHeader className="space-y-1 border-b border-border px-6 py-5 text-left">
          <SheetDescription className={typeScale.caption}>
            {day.date} · {entry.time}
          </SheetDescription>
          <SheetTitle className={typeScale.sectionTitle}>{entry.title}</SheetTitle>
          <p className={cn(typeScale.caption, "font-mono tabular-nums")}>
            decisions/{day.filename}
          </p>
        </SheetHeader>
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          <DecisionField label="Documento afetado" value={entry.affectedDocument} />
          <DecisionField label="O que mudou" value={entry.whatChanged} />
          <DecisionField label="Por que mudou" value={entry.whyChanged} />
          <DecisionField label="Impacto em outros docs" value={entry.impact} />
          <DecisionField label="Responsável" value={entry.responsible} />
        </div>
      </SheetContent>
    </Sheet>
  )
}

function DayBlock({
  day,
  expanded,
  onToggleExpanded,
  onOpenEntry,
}: {
  day: DecisionDay
  expanded: boolean
  onToggleExpanded: () => void
  onOpenEntry: (day: DecisionDay, entry: DecisionEntry) => void
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card transition-colors",
        !expanded && "bg-muted/20",
      )}
    >
      <button
        aria-expanded={expanded}
        className={cn(
          "flex w-full items-start gap-2 px-4 py-3 text-left transition-colors hover:opacity-90",
          expanded && "border-b border-border/80",
        )}
        onClick={onToggleExpanded}
        type="button"
      >
        <ChevronDown
          aria-hidden
          className={cn(
            "mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform duration-200",
            expanded ? "rotate-0" : "-rotate-90",
          )}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <History className="h-4 w-4 shrink-0 text-primary" aria-hidden />
            <h2 className={typeScale.sectionTitle}>{day.date}</h2>
          </div>
          <p className={cn(typeScale.caption, "mt-1 tabular-nums")}>
            {day.entries.length} decisão{day.entries.length === 1 ? "" : "ões"}
            {!expanded ? " · recolhido" : null}
          </p>
        </div>
      </button>

      {expanded ? (
        <div className="px-2 py-2">
          {day.entries.map((entry) => (
            <button
              className="flex w-full items-start justify-between gap-3 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-muted/40"
              key={`${day.date}-${entry.time}-${entry.title}`}
              onClick={() => onOpenEntry(day, entry)}
              type="button"
            >
              <div className="min-w-0 flex-1">
                <p className="font-mono text-xs font-semibold text-primary tabular-nums">
                  {entry.time}
                </p>
                <p className={cn(typeScale.bodySm, "text-foreground")}>{entry.title}</p>
                {entry.affectedDocument ? (
                  <p className={cn(typeScale.caption, "mt-1 truncate")}>
                    {entry.affectedDocument}
                  </p>
                ) : null}
                {entry.whatChanged ? (
                  <p className={cn(typeScale.caption, "mt-1 line-clamp-2")}>
                    {entry.whatChanged}
                  </p>
                ) : null}
              </div>
              <FileText
                aria-hidden
                className="mt-1 size-4 shrink-0 text-muted-foreground"
              />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  )
}

export function DecisionsView({ decisionDays }: { decisionDays: DecisionDay[] }) {
  const [expandedDates, setExpandedDates] = useState<Set<string>>(() => {
    const first = decisionDays[0]?.date
    return first ? new Set([first]) : new Set()
  })
  const [sheetTarget, setSheetTarget] = useState<DecisionSheetTarget | null>(null)

  const sortedDays = useMemo(
    () => [...decisionDays].sort((a, b) => b.date.localeCompare(a.date)),
    [decisionDays],
  )

  const toggleExpanded = (date: string) => {
    setExpandedDates((previous) => {
      const next = new Set(previous)
      if (next.has(date)) {
        next.delete(date)
        return next
      }
      next.add(date)
      return next
    })
  }

  if (sortedDays.length === 0) {
    return (
      <p className={typeScale.bodySm}>
        Nenhuma decisão em <code className="text-xs">docs/decisions/</code>. Crie{" "}
        <code className="text-xs">YYYY-MM-DD.json</code> com array{" "}
        <code className="text-xs">entries</code> (time, title, campos do log).
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {sortedDays.map((day) => (
        <DayBlock
          day={day}
          expanded={expandedDates.has(day.date)}
          key={day.date}
          onOpenEntry={(item, entry) => setSheetTarget({ day: item, entry })}
          onToggleExpanded={() => toggleExpanded(day.date)}
        />
      ))}

      <DecisionDetailSheet
        onOpenChange={(open) => {
          if (!open) {
            setSheetTarget(null)
          }
        }}
        open={sheetTarget !== null}
        target={sheetTarget}
      />
    </div>
  )
}
