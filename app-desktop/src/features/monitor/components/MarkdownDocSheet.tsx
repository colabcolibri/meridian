import { FileText, Loader2 } from "lucide-react"
import { useCallback, useEffect, useState, type ReactNode } from "react"

import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  type SheetStackLayer,
} from "@/components/ui/sheet"
import { readMarkdownDocFromFolder } from "@/features/folder/read-markdown-doc"
import { useProjectFolder } from "@/features/folder/ProjectFolderContext"
import { MarkdownContent } from "@/features/monitor/components/MarkdownContent"
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
  stackLayer = "base",
}: {
  docPath: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  subtitle?: string
  badges?: ReactNode
  summary?: ReactNode
  hideFrontmatter?: boolean
  stackLayer?: SheetStackLayer
}) {
  return (
    <Sheet modal={stackLayer === "base"} onOpenChange={onOpenChange} open={open}>
      <SheetContent
        className="flex h-full flex-col p-0"
        side="right"
        stackLayer={stackLayer}
      >
        {docPath ? (
          <MarkdownDocSheetBody
            badges={badges}
            docPath={docPath}
            hideFrontmatter={hideFrontmatter}
            subtitle={subtitle}
            summary={summary}
            title={title}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

function MarkdownDocSheetBody({
  docPath,
  title,
  subtitle,
  badges,
  summary,
  hideFrontmatter,
}: {
  docPath: string
  title: string
  subtitle?: string
  badges?: ReactNode
  summary?: ReactNode
  hideFrontmatter: boolean
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

  return (
    <>
      <SheetHeader className="shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          <FileText className="size-5 shrink-0 text-primary" aria-hidden />
          <SheetTitle className={typeScale.panelTitle}>{title}</SheetTitle>
          {badges}
        </div>
        <SheetDescription className={cn(typeScale.caption, "font-mono")}>
          {content?.relativePath ?? docPath}
          {folder ? ` · ${folder.name}` : null}
          {subtitle ? ` · ${subtitle}` : null}
        </SheetDescription>
      </SheetHeader>

      <ScrollArea className="min-h-0 w-full flex-1">
        {summary ? (
          <section className="w-full border-b bg-muted/30 px-6 py-4">{summary}</section>
        ) : null}

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
      </ScrollArea>
    </>
  )
}
