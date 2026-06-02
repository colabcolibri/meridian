import type { DocStatus, SetupStepState } from "@/domain/meridian/types"

export const setupStepStyles: Record<
  SetupStepState,
  {
    tile: string
    statusText: string
    legendDot: string
  }
> = {
  locked: {
    tile: "bg-zinc-100 text-zinc-500",
    statusText: "text-zinc-600",
    legendDot: "bg-zinc-400",
  },
  active: {
    tile: "bg-meridian-muted text-meridian",
    statusText: "text-meridian",
    legendDot: "bg-meridian",
  },
  complete: {
    tile: "bg-meridian-success-muted text-meridian-success",
    statusText: "text-meridian-success-foreground",
    legendDot: "bg-meridian-success",
  },
  alert: {
    tile: "bg-red-50 text-destructive",
    statusText: "text-destructive",
    legendDot: "bg-destructive",
  },
}

export const docStatusStyles: Record<DocStatus, { label: string; className: string }> =
  {
    draft: { label: "Rascunho", className: "bg-zinc-100 text-zinc-700" },
    review: { label: "Em revisão", className: "bg-amber-50 text-amber-900" },
    approved: {
      label: "Aprovado",
      className: "bg-meridian-success-muted text-meridian-success-foreground",
    },
  }
