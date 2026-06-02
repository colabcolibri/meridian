import type { SetupStepState } from "@/domain/meridian/types"

/** Metadados de fluxo — rótulos curtos para legenda e acordeão. */
export const setupStepMeta: Record<
  SetupStepState,
  {
    shortLabel: string
    legendHint: string
  }
> = {
  complete: {
    shortLabel: "Pronto",
    legendHint: "Aprovado e dependências satisfeitas",
  },
  active: {
    shortLabel: "Em andamento",
    legendHint: "Pode ser editado ou revisado agora",
  },
  locked: {
    shortLabel: "Não iniciado",
    legendHint: "Aguardando documentos anteriores",
  },
  alert: {
    shortLabel: "Atenção",
    legendHint: "Aprovado fora de ordem ou inconsistência",
  },
}

/** Ordem fixa na legenda. */
export const setupStepLegendOrder: SetupStepState[] = [
  "complete",
  "active",
  "locked",
  "alert",
]
