import { useMemo, useState } from "react"

import type { PhaseDocument } from "@/domain/meridian/types"
import { getSetupStepState } from "@/domain/meridian/validators"
import { PhaseDocReaderSheet } from "@/features/monitor/components/PhaseDocReader"
import { PhaseSection } from "@/features/monitor/components/PhaseSection"
import { SetupProgressHeader } from "@/features/monitor/components/SetupProgressHeader"
import { SetupStateLegend } from "@/features/monitor/components/SetupStateLegend"
import type { MonitorIssue } from "@/domain/meridian/monitor-issues"
import { useProjectFolder } from "@/features/folder/ProjectFolderContext"
import { typeScale } from "@/features/monitor/monitor-typography"
import { cn } from "@/lib/utils"

const SETUP_PHASE_ORDER = ["Fase 0", "Fase 1", "Fase 2", "Fase 3", "Contínuo"] as const

const phaseLabels: Record<string, string> = {
  "Fase 0": "Fundação do projeto",
  "Fase 1": "Princípios de código",
  "Fase 2": "Arquitetura",
  "Fase 3": "Detalhe técnico",
  Contínuo: "Registro contínuo",
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
  return hasActive || hasAlert || phase === "Fase 0"
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
        <p className={typeScale.label}>Nenhum documento carregado</p>
        <p className={cn(typeScale.bodySm, "mt-2")}>
          Confira os alertas acima ou se a pasta aberta contém os arquivos 00–08 e 11 na
          raiz.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SetupProgressHeader documents={documents} nextStep={nextStep} />

      <SetupStateLegend />

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
