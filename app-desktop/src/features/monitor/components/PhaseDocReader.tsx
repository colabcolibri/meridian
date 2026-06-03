import { Loader2 } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

import type { PhaseDocument } from "@/domain/meridian/types"
import { useProjectFolder } from "@/features/folder/ProjectFolderContext"
import {
  readPhaseDocFromFolder,
  type PhaseDocContent,
} from "@/features/folder/read-phase-doc"
import { MarkdownContent } from "@/features/monitor/components/MarkdownContent"
import { MonitorSheet } from "@/features/monitor/components/monitor-sheet"
import { typeScale } from "@/features/monitor/monitor-typography"
import { docStatusStyles } from "@/features/monitor/setup-step-styles"
import { cn } from "@/lib/utils"

export function PhaseDocReaderSheet({
  document,
  open,
  onOpenChange,
}: {
  document: PhaseDocument | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!document) {
    return null
  }

  return (
    <PhaseDocReaderSheetInner
      document={document}
      onOpenChange={onOpenChange}
      open={open}
    />
  )
}

function PhaseDocReaderSheetInner({
  document,
  open,
  onOpenChange,
}: {
  document: PhaseDocument
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { folder, getDocsRoot } = useProjectFolder()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [content, setContent] = useState<PhaseDocContent | null>(null)
  const docStatus = docStatusStyles[document.status]

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    setContent(null)

    const docsRoot = await getDocsRoot()
    if (!docsRoot) {
      setError("Open the project docs folder to read files.")
      setLoading(false)
      return
    }

    try {
      const result = await readPhaseDocFromFolder(docsRoot, document.id)
      setContent(result)
    } catch {
      setError(
        `Could not read ${document.id}.md. Confirm the file exists in the open folder.`,
      )
    } finally {
      setLoading(false)
    }
  }, [document.id, getDocsRoot])

  useEffect(() => {
    void load()
  }, [load])

  const subtitle = [
    content?.filename ?? `${document.id}.md`,
    folder ? folder.name : null,
  ]
    .filter(Boolean)
    .join(" · ")

  return (
    <MonitorSheet
      badges={
        <span
          className={cn(
            "inline-flex rounded-md px-2.5 py-1",
            typeScale.badge,
            docStatus.className,
          )}
        >
          {docStatus.label}
        </span>
      }
      onOpenChange={onOpenChange}
      open={open}
      subtitle={subtitle}
      title={document.title}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-20 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          <span className={typeScale.bodySm}>Loading document…</span>
        </div>
      ) : null}

      {error ? (
        <p className={cn(typeScale.body, "px-6 py-10 text-destructive")}>{error}</p>
      ) : null}

      {content && !loading && !error ? (
        <div className="w-full pb-8">
          {content.frontmatter ? (
            <section className="w-full border-b bg-muted/40 px-6 py-4">
              <h3 className={cn(typeScale.label, "mb-2 uppercase tracking-wide")}>
                Metadata
              </h3>
              <pre className="w-full overflow-x-auto rounded-lg border bg-background p-3 font-mono text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                {content.frontmatter}
              </pre>
            </section>
          ) : null}
          <article className="w-full px-6 py-5">
            <h3 className={cn(typeScale.label, "mb-3 uppercase tracking-wide")}>
              Content
            </h3>
            <MarkdownContent body={content.body} />
          </article>
        </div>
      ) : null}
    </MonitorSheet>
  )
}
