import { useState } from "react"

import { ChevronDown } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import type { MonitorIssue } from "@/domain/meridian/monitor-issues"
import type { PhaseDocument } from "@/domain/meridian/types"
import { countSetupStepsByState } from "@/domain/meridian/validators"
import { PhaseProgressIcon } from "@/features/monitor/components/PhaseProgressIcon"
import { PhaseStepCard } from "@/features/monitor/components/PhaseStepCard"
import { issuesForTarget } from "@/domain/meridian/protocol-validators"
import { typeScale } from "@/features/monitor/monitor-typography"
import { cn } from "@/lib/utils"

export function PhaseSection({
  phase,
  subtitle,
  phaseDocs,
  allDocuments,
  issues,
  canRead,
  defaultOpen = true,
  onReadDocument,
}: {
  phase: string
  subtitle: string
  phaseDocs: PhaseDocument[]
  allDocuments: PhaseDocument[]
  issues: MonitorIssue[]
  canRead: boolean
  defaultOpen?: boolean
  onReadDocument: (document: PhaseDocument) => void
}) {
  const [open, setOpen] = useState(defaultOpen)
  const counts = countSetupStepsByState(phaseDocs, allDocuments)
  const complete = counts.complete
  const total = phaseDocs.length
  const hasAlert = counts.alert > 0

  return (
    <Collapsible
      className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
      onOpenChange={setOpen}
      open={open}
    >
      <CollapsibleTrigger
        className={cn(
          "group flex w-full items-center gap-4 px-4 py-3.5 text-left transition-colors sm:px-5",
          "hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          "data-[state=open]:border-b data-[state=open]:border-border",
        )}
      >
        <PhaseProgressIcon complete={complete} hasAlert={hasAlert} total={total} />

        <div className="min-w-0 flex-1">
          <h2 className={typeScale.sectionTitle}>{phase}</h2>
          <p className={cn(typeScale.caption, "mt-0.5")}>{subtitle}</p>
        </div>

        <ChevronDown
          className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
          aria-hidden
        />
      </CollapsibleTrigger>

      <CollapsibleContent>
        <ul className="grid list-none grid-cols-2 gap-3 p-4 sm:grid-cols-3 lg:grid-cols-4">
          {phaseDocs.map((document) => (
            <li className="min-w-0" key={document.id}>
              <PhaseStepCard
                canRead={canRead}
                docIssues={issuesForTarget(issues, document.id)}
                document={document}
                documents={allDocuments}
                onRead={() => onReadDocument(document)}
              />
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}
