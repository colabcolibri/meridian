import { FileText, Loader2, X } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { PhaseDocument } from "@/domain/meridian/types"
import { useProjectFolder } from "@/features/folder/ProjectFolderContext"
import {
  readPhaseDocFromFolder,
  type PhaseDocContent,
} from "@/features/folder/read-phase-doc"

export function PhaseDocReader({
  document,
  onClose,
}: {
  document: PhaseDocument
  onClose: () => void
}) {
  const { folder, getHandle } = useProjectFolder()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [content, setContent] = useState<PhaseDocContent | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    setContent(null)

    const handle = await getHandle()
    if (!handle) {
      setError("Abra a pasta docs do projeto para ler os arquivos .md.")
      setLoading(false)
      return
    }

    try {
      const result = await readPhaseDocFromFolder(handle, document.id)
      setContent(result)
    } catch {
      setError(
        `Não foi possível ler ${document.id}.md. Confirme que o arquivo existe na pasta docs aberta.`,
      )
    } finally {
      setLoading(false)
    }
  }, [document.id, getHandle])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <Card className="overflow-hidden border-teal-200 shadow-md">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 border-b bg-teal-50/50">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-teal-800">
            <FileText className="h-4 w-4 shrink-0" />
            <CardTitle className="text-base">
              {document.id} — {document.title}
            </CardTitle>
          </div>
          <CardDescription className="mt-1">
            {content?.filename ?? `${document.id}.md`}
            {folder ? ` · pasta ${folder.name}` : null}
          </CardDescription>
        </div>
        <Button aria-label="Fechar leitor" onClick={onClose} size="sm" variant="ghost">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="max-h-[min(70vh,640px)] overflow-y-auto p-0">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-zinc-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Carregando markdown…
          </div>
        ) : null}

        {error ? <p className="px-6 py-8 text-sm text-red-800">{error}</p> : null}

        {content && !loading && !error ? (
          <div className="space-y-0">
            {content.frontmatter ? (
              <section className="border-b bg-zinc-50 px-6 py-4">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Frontmatter
                </h3>
                <pre className="overflow-x-auto rounded-md border bg-white p-3 font-mono text-xs leading-5 text-zinc-700">
                  {content.frontmatter}
                </pre>
              </section>
            ) : null}
            <article className="px-6 py-5">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Conteúdo
              </h3>
              <div className="prose prose-zinc max-w-none prose-headings:font-semibold prose-p:leading-relaxed prose-pre:overflow-x-auto prose-pre:text-sm">
                <MarkdownPlain body={content.body} />
              </div>
            </article>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

/** Renderização leve de markdown até US-010 centralizar o parser. */
function MarkdownPlain({ body }: { body: string }) {
  const lines = body.split("\n")
  return (
    <div className="space-y-2 text-sm text-zinc-800">
      {lines.map((line, index) => {
        if (line.startsWith("# ")) {
          return (
            <h1 className="mt-4 text-xl font-semibold text-zinc-950" key={index}>
              {line.slice(2)}
            </h1>
          )
        }
        if (line.startsWith("## ")) {
          return (
            <h2 className="mt-3 text-lg font-semibold text-zinc-950" key={index}>
              {line.slice(3)}
            </h2>
          )
        }
        if (line.startsWith("### ")) {
          return (
            <h3 className="mt-2 text-base font-semibold text-zinc-900" key={index}>
              {line.slice(4)}
            </h3>
          )
        }
        if (line.startsWith("- ")) {
          return (
            <li className="ml-4 list-disc" key={index}>
              {line.slice(2)}
            </li>
          )
        }
        if (line.trim() === "") {
          return <div className="h-2" key={index} />
        }
        if (line.startsWith("```")) {
          return null
        }
        return (
          <p className="leading-6" key={index}>
            {line}
          </p>
        )
      })}
    </div>
  )
}
