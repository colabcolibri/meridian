import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { PhaseDocument } from "@/domain/meridian/types"
import { getSetupProgress } from "@/domain/meridian/validators"
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
      <CardHeader>
        <CardTitle className={typeScale.pageTitle}>Project setup</CardTitle>
        <CardDescription className={typeScale.bodySm}>
          {complete} of {total} documents ready in the Meridian protocol
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className={typeScale.stat}>
            {complete}
            <span className="text-xl font-normal text-muted-foreground">
              {" "}
              / {total}
            </span>
          </p>
          <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300",
                percent === 100 ? "bg-meridian-success" : "bg-meridian",
              )}
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className={cn(typeScale.caption, "mt-2")}>{percent}% complete</p>
        </div>

        {nextStep ? (
          <div className="shrink-0 rounded-lg border border-meridian-border bg-meridian-muted px-5 py-4 sm:max-w-sm">
            <p className={cn(typeScale.label, "text-meridian-muted-foreground")}>
              Next focus
            </p>
            <p className={cn(typeScale.cardTitle, "mt-2 text-foreground")}>
              {nextStep.title}
            </p>
            <p className={cn(typeScale.docId, "mt-1 text-meridian-muted-foreground")}>
              {nextStep.id}.md
            </p>
          </div>
        ) : (
          <div
            className={cn(
              typeScale.bodySm,
              "shrink-0 rounded-lg border border-meridian-success/30 bg-meridian-success-muted px-5 py-4 text-meridian-success-foreground",
            )}
          >
            All documents are up to date in the flow.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
