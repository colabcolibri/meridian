import type { SetupStepState } from "@/domain/meridian/types"

export const setupStepStyles: Record<
  SetupStepState,
  { ring: string; badge: string; dot: string }
> = {
  locked: {
    ring: "border-zinc-200 bg-zinc-50",
    badge: "bg-zinc-100 text-zinc-600",
    dot: "bg-zinc-300",
  },
  active: {
    ring: "border-teal-200 bg-teal-50/50",
    badge: "bg-teal-700 text-white",
    dot: "bg-teal-600",
  },
  complete: {
    ring: "border-emerald-200 bg-emerald-50/40",
    badge: "bg-emerald-700 text-white",
    dot: "bg-emerald-600",
  },
  alert: {
    ring: "border-red-200 bg-red-50/50",
    badge: "bg-red-700 text-white",
    dot: "bg-red-600",
  },
}
