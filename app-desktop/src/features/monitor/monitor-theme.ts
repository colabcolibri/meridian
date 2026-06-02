import type { SetupStepState } from "@/domain/meridian/types"

/** Flow metadata — short labels for legend and accordion. */
export const setupStepMeta: Record<
  SetupStepState,
  {
    shortLabel: string
    legendHint: string
  }
> = {
  complete: {
    shortLabel: "Ready",
    legendHint: "Approved and dependencies satisfied",
  },
  active: {
    shortLabel: "In progress",
    legendHint: "Can be edited or reviewed now",
  },
  locked: {
    shortLabel: "Not started",
    legendHint: "Waiting for earlier documents",
  },
  alert: {
    shortLabel: "Attention",
    legendHint: "Approved out of order or inconsistent",
  },
}

/** Fixed order in the legend. */
export const setupStepLegendOrder: SetupStepState[] = [
  "complete",
  "active",
  "locked",
  "alert",
]
