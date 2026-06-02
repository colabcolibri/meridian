import { FileText, Loader2 } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { PhaseDocument } from "@/domain/meridian/types"
import { useProjectFolder } from "@/features/folder/ProjectFolderContext"
import {
  readPhaseDocFromFolder,
  type PhaseDocContent,
} from "@/features/folder/read-phase-doc"
import { MarkdownContent } from "@/features/monitor/components/MarkdownContent"
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
  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetContent className="flex h-full flex-col p-0" side="right">
        {document ? <PhaseDocReaderBody document={document} /> : null}
      </SheetContent>
    </Sheet>
  )
}

function PhaseDocReaderBody({ document }: { document: PhaseDocument }) {
  const { folder, getHandle } = useProjectFolder()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [content, setContent] = useState<PhaseDocContent | null>(null)
  const docStatus = docStatusStyles[document.status]

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    setContent(null)

    const handle = await getHandle()
    if (!handle) {
      setError("Abra a pasta docs do projeto para ler os arquivos.")
      setLoading(false)
      return
    }

    try {
      const result = await readPhaseDocFromFolder(handle, document.id)
      setContent(result)
    } catch {
      setError(
        `Não foi possível ler ${document.id}.md. Confirme que o arquivo existe na pasta aberta.`,
      )
    } finally {
      setLoading(false)
    }
  }, [document.id, getHandle])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <>
      <SheetHeader className="shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          <FileText className="size-5 shrink-0 text-primary" aria-hidden />
          <SheetTitle className={typeScale.panelTitle}>{document.title}</SheetTitle>
          <span
            className={cn(
              "inline-flex rounded-md px-2.5 py-1",
              typeScale.badge,
              docStatus.className,
            )}
          >
            {docStatus.label}
          </span>
        </div>
        <SheetDescription className={cn(typeScale.caption, "font-mono")}>
          {content?.filename ?? `${document.id}.md`}
          {folder ? ` · ${folder.name}` : null}
        </SheetDescription>
      </SheetHeader>

      <ScrollArea className="min-h-0 w-full flex-1">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
            <span className={typeScale.bodySm}>Carregando documento…</span>
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
                  Metadados
                </h3>
                <pre className="w-full overflow-x-auto rounded-lg border bg-background p-3 font-mono text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                  {content.frontmatter}
                </pre>
              </section>
            ) : null}
            <article className="w-full px-6 py-5">
              <h3 className={cn(typeScale.label, "mb-3 uppercase tracking-wide")}>
                Conteúdo
              </h3>
              <MarkdownContent body={content.body} />
            </article>
          </div>
        ) : null}
      </ScrollArea>
    </>
  )
}
