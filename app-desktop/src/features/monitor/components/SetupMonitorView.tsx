import { useMemo, useState } from "react"

import type { PhaseDocument } from "@/domain/meridian/types"
import { getSetupStepState } from "@/domain/meridian/validators"
import { PhaseDocReaderSheet } from "@/features/monitor/components/PhaseDocReader"
import { PhaseSection } from "@/features/monitor/components/PhaseSection"
import { SetupProgressHeader } from "@/features/monitor/components/SetupProgressHeader"
import type { MonitorIssue } from "@/domain/meridian/monitor-issues"
import { useProjectFolder } from "@/features/folder/ProjectFolderContext"
import { typeScale } from "@/features/monitor/monitor-typography"
import { cn } from "@/lib/utils"

const SETUP_PHASE_ORDER = [
  "Phase 0",
  "Phase 1",
  "Phase 2",
  "Phase 3",
  "Continuous",
] as const

const phaseLabels: Record<string, string> = {
  "Phase 0": "Project foundation",
  "Phase 1": "Code principles",
  "Phase 2": "Architecture",
  "Phase 3": "Technical detail",
  Continuous: "Continuous record",
}

function groupByPhase(documents: PhaseDocument[]) {
  return SETUP_PHASE_ORDER.map((phase) => ({
    phase,
    subtitle: phaseLabels[phase] ?? phase,
    documents: documents.filter((document) => document.phase === phase),
  })).filter((group) => group.documents.length > 0)
}

function defaultPhaseOpen(
  phase: string,
  phaseDocs: PhaseDocument[],
  allDocuments: PhaseDocument[],
) {
  const hasActive = phaseDocs.some(
    (doc) => getSetupStepState(doc, allDocuments) === "active",
  )
  const hasAlert = phaseDocs.some(
    (doc) => getSetupStepState(doc, allDocuments) === "alert",
  )
  return hasActive || hasAlert || phase === "Phase 0"
}

export function SetupMonitorView({
  documents,
  issues,
}: {
  documents: PhaseDocument[]
  issues: MonitorIssue[]
}) {
  const { folder } = useProjectFolder()
  const [readingDoc, setReadingDoc] = useState<PhaseDocument | null>(null)
  const groups = useMemo(() => groupByPhase(documents), [documents])
  const nextStep = documents.find(
    (document) => getSetupStepState(document, documents) === "active",
  )
  const canRead = Boolean(folder)

  if (canRead && documents.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center">
        <p className={typeScale.label}>No documents loaded</p>
        <p className={cn(typeScale.bodySm, "mt-2")}>
          Check the alerts above or whether the open folder contains files 00–08 and 11
          at the root.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SetupProgressHeader documents={documents} nextStep={nextStep} />

      <div className="space-y-4">
        {groups.map(({ phase, subtitle, documents: phaseDocs }) => (
          <PhaseSection
            allDocuments={documents}
            canRead={canRead}
            defaultOpen={defaultPhaseOpen(phase, phaseDocs, documents)}
            issues={issues}
            key={phase}
            onReadDocument={setReadingDoc}
            phase={phase}
            phaseDocs={phaseDocs}
            subtitle={subtitle}
          />
        ))}
      </div>

      <PhaseDocReaderSheet
        document={readingDoc}
        onOpenChange={(open) => {
          if (!open) {
            setReadingDoc(null)
          }
        }}
        open={readingDoc !== null}
      />
    </div>
  )
}
