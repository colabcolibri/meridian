import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PhaseDocument } from "@/domain/meridian/types"
import { getSetupProgress } from "@/domain/meridian/validators"
import { SetupStateLegend } from "@/features/monitor/components/SetupStateLegend"
import { typeScale } from "@/features/monitor/monitor-typography"
import { cn } from "@/lib/utils"

export function SetupProgressHeader({
  documents,
  nextStep,
}: {
  documents: PhaseDocument[]
  nextStep: PhaseDocument | undefined
}) {
  const { complete, total } = getSetupProgress(documents)
  const percent = total > 0 ? Math.round((complete / total) * 100) : 0

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <CardTitle className={typeScale.pageTitle}>Project setup</CardTitle>
            <p className={cn(typeScale.caption, "mt-1")}>
              {complete} of {total} documents ready in the Meridian protocol
            </p>
          </div>
          {nextStep ? (
            <div className="shrink-0 rounded-lg border-2 border-meridian bg-meridian-muted px-4 py-3 sm:max-w-xs">
              <p className="text-xs font-medium uppercase tracking-wide text-meridian">
                Next focus
              </p>
              <p className={cn(typeScale.label, "mt-1 font-semibold text-foreground")}>
                {nextStep.title}
              </p>
              <p className={cn(typeScale.docId, "mt-0.5")}>{nextStep.id}.md</p>
            </div>
          ) : (
            <div
              className={cn(
                typeScale.bodySm,
                "shrink-0 rounded-lg border border-meridian-success/30 bg-meridian-success-muted px-4 py-3 text-meridian-success-foreground",
              )}
            >
              All documents are up to date in the flow.
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className={cn(typeScale.label, "tabular-nums")}>
              {percent}% complete
            </span>
            <span className={typeScale.caption}>
              {complete} / {total}
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                percent === 100 ? "bg-meridian-success" : "bg-meridian",
              )}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
        <SetupStateLegend className="border-0 pb-0 pt-1" />
      </CardContent>
    </Card>
  )
}
