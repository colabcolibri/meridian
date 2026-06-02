import { useState } from "react"

import { AlertTriangle, CheckCircle2, Eye, Lock, Pencil } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { PhaseDocument, SetupStepState } from "@/domain/meridian/types"
import {
  getSetupProgress,
  getSetupStepLabel,
  getSetupStepState,
} from "@/domain/meridian/validators"
import { PhaseDocReader } from "@/features/monitor/components/PhaseDocReader"
import { issuesForTarget } from "@/domain/meridian/protocol-validators"
import type { MonitorIssue } from "@/domain/meridian/monitor-issues"
import { useProjectFolder } from "@/features/folder/ProjectFolderContext"
import { setupStepStyles } from "@/features/monitor/setup-step-styles"

const stepIcons: Record<SetupStepState, typeof CheckCircle2> = {
  locked: Lock,
  active: Pencil,
  complete: CheckCircle2,
  alert: AlertTriangle,
}

const SETUP_PHASE_ORDER = ["Fase 0", "Fase 1", "Fase 2", "Fase 3", "Contínuo"] as const

function groupByPhase(documents: PhaseDocument[]) {
  return SETUP_PHASE_ORDER.map((phase) => ({
    phase,
    documents: documents.filter((document) => document.phase === phase),
  })).filter((group) => group.documents.length > 0)
}

function SetupStepRow({
  document,
  documents,
  docIssues,
  onRead,
  canRead,
}: {
  document: PhaseDocument
  documents: PhaseDocument[]
  docIssues: MonitorIssue[]
  onRead: () => void
  canRead: boolean
}) {
  const state = getSetupStepState(document, documents)
  const label = getSetupStepLabel(document, documents)
  const styles = setupStepStyles[state]
  const Icon = stepIcons[state]

  return (
    <li className={`flex gap-4 rounded-lg border p-4 ${styles.ring}`} key={document.id}>
      <div
        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${styles.dot}`}
      >
        <Icon className="h-4 w-4 text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-zinc-500">{document.id}</span>
          <span className="font-medium text-zinc-950">{document.title}</span>
          <Badge className={styles.badge}>{label}</Badge>
        </div>
        <p className="mt-1 text-sm text-zinc-600">{document.purpose}</p>
        {docIssues.length > 0 ? (
          <ul className="mt-2 space-y-1 text-xs text-red-800">
            {docIssues.map((issue) => (
              <li key={issue.message}>{issue.message}</li>
            ))}
          </ul>
        ) : null}
        <Button
          className="mt-3 h-8"
          disabled={!canRead}
          onClick={onRead}
          size="sm"
          type="button"
          variant="outline"
        >
          <Eye className="mr-2 h-3.5 w-3.5" />
          Ler .md
        </Button>
      </div>
    </li>
  )
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
  const { complete, total } = getSetupProgress(documents)
  const groups = groupByPhase(documents)
  const nextStep = documents.find(
    (document) => getSetupStepState(document, documents) === "active",
  )
  const canRead = Boolean(folder)

  if (canRead && documents.length === 0) {
    return (
      <p className="text-sm text-zinc-600">
        Nenhum documento de fase carregado. Verifique erros acima ou se a pasta aberta
        contém os arquivos 00–11 na raiz.
      </p>
    )
  }

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Progresso da configuração</CardTitle>
          <CardDescription>
            Uma etapa = um estado legível. Clique em <strong>Ler .md</strong> para abrir
            o arquivo correspondente na pasta docs monitorada.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-3xl font-semibold text-zinc-950">
              {complete}/{total}
            </div>
            <p className="mt-1 text-sm text-zinc-600">etapas concluídas no protocolo</p>
          </div>
          {nextStep ? (
            <div className="rounded-md border border-teal-200 bg-teal-50 px-4 py-3 text-sm">
              <span className="font-medium text-teal-900">Próximo passo sugerido:</span>{" "}
              <span className="text-teal-800">
                {nextStep.id} — {nextStep.title}
              </span>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {readingDoc ? (
        <PhaseDocReader document={readingDoc} onClose={() => setReadingDoc(null)} />
      ) : null}

      <div className="grid gap-6 lg:grid-cols-1">
        {groups.map(({ phase, documents: phaseDocs }) => (
          <section key={phase}>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
              {phase}
            </h2>
            <ul className="space-y-3">
              {phaseDocs.map((document) => (
                <SetupStepRow
                  canRead={canRead}
                  docIssues={issuesForTarget(issues, document.id)}
                  document={document}
                  documents={documents}
                  key={document.id}
                  onRead={() => setReadingDoc(document)}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
