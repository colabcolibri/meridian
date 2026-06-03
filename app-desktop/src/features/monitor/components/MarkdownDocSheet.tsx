import { Loader2 } from "lucide-react"
import { useCallback, useEffect, useState, type ReactNode } from "react"

import { readMarkdownDocFromFolder } from "@/features/folder/read-markdown-doc"
import { useProjectFolder } from "@/features/folder/ProjectFolderContext"
import { MarkdownContent } from "@/features/monitor/components/MarkdownContent"
import { MonitorSheet } from "@/features/monitor/components/monitor-sheet"
import { typeScale } from "@/features/monitor/monitor-typography"
import { cn } from "@/lib/utils"

export function MarkdownDocSheet({
  docPath,
  open,
  onOpenChange,
  title,
  subtitle,
  badges,
  summary,
  hideFrontmatter = false,
  onCloseClick,
  allowOutsideDismiss = true,
  modal = true,
}: {
  docPath: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  subtitle?: string
  badges?: ReactNode
  summary?: ReactNode
  hideFrontmatter?: boolean
  onCloseClick?: () => void
  allowOutsideDismiss?: boolean
  modal?: boolean
}) {
  if (!docPath) {
    return null
  }

  return (
    <MarkdownDocSheetInner
      allowOutsideDismiss={allowOutsideDismiss}
      badges={badges}
      docPath={docPath}
      hideFrontmatter={hideFrontmatter}
      modal={modal}
      onCloseClick={onCloseClick}
      onOpenChange={onOpenChange}
      open={open}
      subtitle={subtitle}
      summary={summary}
      title={title}
    />
  )
}

function MarkdownDocSheetInner({
  docPath,
  open,
  onOpenChange,
  title,
  subtitle,
  badges,
  summary,
  hideFrontmatter,
  onCloseClick,
  allowOutsideDismiss,
  modal,
}: {
  docPath: string
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  subtitle?: string
  badges?: ReactNode
  summary?: ReactNode
  hideFrontmatter: boolean
  onCloseClick?: () => void
  allowOutsideDismiss: boolean
  modal: boolean
}) {
  const { folder, getDocsRoot } = useProjectFolder()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [content, setContent] = useState<Awaited<
    ReturnType<typeof readMarkdownDocFromFolder>
  > | null>(null)

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
      const result = await readMarkdownDocFromFolder(docsRoot, docPath)
      setContent(result)
    } catch {
      setError(`Could not read ${docPath}. Confirm the file exists in the open folder.`)
    } finally {
      setLoading(false)
    }
  }, [docPath, getDocsRoot])

  useEffect(() => {
    void load()
  }, [load])

  const metaLine = [
    content?.relativePath ?? docPath,
    folder ? folder.name : null,
    subtitle ?? null,
  ]
    .filter(Boolean)
    .join(" · ")

  return (
    <MonitorSheet
      allowOutsideDismiss={allowOutsideDismiss}
      badges={badges}
      modal={modal}
      onCloseClick={onCloseClick}
      onOpenChange={onOpenChange}
      open={open}
      subtitle={metaLine}
      summary={summary}
      title={title}
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
          {!hideFrontmatter && content.frontmatter ? (
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
            <MarkdownContent body={content.body} />
          </article>
        </div>
      ) : null}
    </MonitorSheet>
  )
}
