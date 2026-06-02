import {
  BookOpen,
  FileText,
  FolderOpen,
  GitBranch,
  Layers,
  ListChecks,
  Loader2,
  Sparkles,
  Users,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useProjectFolder } from "@/features/folder/ProjectFolderContext"
import { SetupStateLegend } from "@/features/monitor/components/SetupStateLegend"
import {
  appIntro,
  corePrinciples,
  dependencyOrder,
  meridianIntro,
  monitorTabsGuide,
  phaseDocuments,
  workflowConcepts,
  type ConceptBlock,
} from "@/features/monitor/content/meridian-concepts"
import { typeScale } from "@/features/monitor/monitor-typography"
import { cn } from "@/lib/utils"

const principleIcons: Record<string, typeof BookOpen> = {
  "docs-first": FileText,
  "human-manager": Users,
  "audit-status": ListChecks,
  "derived-board": GitBranch,
}

const workflowIcons: Record<string, typeof BookOpen> = {
  epics: Layers,
  versions: GitBranch,
  "user-stories": ListChecks,
  kanban: Sparkles,
}

function Prose({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="w-full max-w-none space-y-3">
      {paragraphs.map((paragraph) => (
        <p className={typeScale.body} key={paragraph}>
          {paragraph}
        </p>
      ))}
    </div>
  )
}

function ConceptCard({
  block,
  icon: Icon,
}: {
  block: ConceptBlock
  icon: typeof BookOpen
}) {
  return (
    <Card className="h-full">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 shrink-0 text-meridian" aria-hidden />
          <CardTitle className={typeScale.cardTitle}>{block.title}</CardTitle>
        </div>
        <CardDescription className={cn(typeScale.bodySm, "text-muted-foreground")}>
          {block.summary}
        </CardDescription>
      </CardHeader>
      {block.bullets?.length ? (
        <CardContent>
          <ul className={cn(typeScale.bodySm, "list-disc space-y-1.5 pl-5")}>
            {block.bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </CardContent>
      ) : null}
    </Card>
  )
}

function OpenFolderCallout() {
  const { folder, openFolder, fsAccessSupported, status } = useProjectFolder()
  const isOpening = status === "opening"

  if (folder) {
    return null
  }

  return (
    <section className="rounded-xl border border-meridian-border bg-meridian-muted/30 p-5 sm:p-6">
      <h3 className={typeScale.sectionTitle}>Próximo passo</h3>
      <p className={cn(typeScale.body, "mt-2")}>
        Abra a pasta <strong className="font-medium text-foreground">docs</strong> do
        seu projeto (ex.:{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
          app-desktop/docs
        </code>
        ) para ver seus documentos, entregas e quadro aqui no app.
      </p>
      <Button
        className="mt-4"
        disabled={!fsAccessSupported || isOpening}
        onClick={() => void openFolder()}
      >
        {isOpening ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <FolderOpen className="mr-2 h-4 w-4" />
        )}
        Abrir pasta do projeto
      </Button>
      {!fsAccessSupported ? (
        <p className={cn(typeScale.caption, "mt-3 text-amber-800")}>
          Use Chrome ou Edge em localhost para abrir pastas no computador.
        </p>
      ) : null}
    </section>
  )
}

export function ConceptsView() {
  const phases = [...new Set(phaseDocuments.map((doc) => doc.phase))]

  return (
    <div className="w-full max-w-none space-y-10">
      <header className="space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-meridian" aria-hidden />
          <h2 className={typeScale.pageTitle}>{meridianIntro.title}</h2>
        </div>
        <Prose paragraphs={meridianIntro.paragraphs} />
      </header>

      <OpenFolderCallout />

      <section className="space-y-4">
        <h3 className={typeScale.sectionTitle}>{appIntro.title}</h3>
        <Prose paragraphs={appIntro.paragraphs} />
        <div className="grid gap-3 sm:grid-cols-3">
          {monitorTabsGuide.map((tab) => (
            <div
              className="rounded-lg border border-border bg-muted/30 px-4 py-3"
              key={tab.label}
            >
              <p className={typeScale.label}>{tab.label}</p>
              <p className={cn(typeScale.caption, "mt-1")}>{tab.hint}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className={typeScale.sectionTitle}>Regras de ouro</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {corePrinciples.map((block) => (
            <ConceptCard
              block={block}
              icon={principleIcons[block.id] ?? BookOpen}
              key={block.id}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className={typeScale.sectionTitle}>Os 12 documentos base</h3>
        <p className={typeScale.bodySm}>
          Cada arquivo na pasta <code className="font-mono text-xs">docs/</code> passa
          por três estados: <Badge variant="outline">draft</Badge> (rascunho),{" "}
          <Badge variant="outline">review</Badge> (revisão) e{" "}
          <Badge variant="outline">approved</Badge> (aprovado).
        </p>
        <SetupStateLegend />
        <div className="space-y-6">
          {phases.map((phase) => (
            <div className="space-y-3" key={phase}>
              <h4 className={typeScale.label}>{phase}</h4>
              <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {phaseDocuments
                  .filter((doc) => doc.phase === phase)
                  .map((doc) => (
                    <li
                      className="rounded-lg border border-border bg-card px-3 py-2.5"
                      key={doc.id}
                    >
                      <p className={typeScale.docId}>{doc.id}</p>
                      <p className={cn(typeScale.caption, "mt-1")}>{doc.description}</p>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className={typeScale.sectionTitle}>Como o trabalho é organizado</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {workflowConcepts.map((block) => (
            <ConceptCard
              block={block}
              icon={workflowIcons[block.id] ?? BookOpen}
              key={block.id}
            />
          ))}
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-border bg-muted/20 p-5">
        <h3 className={typeScale.sectionTitle}>Ordem recomendada</h3>
        <ul className={cn(typeScale.bodySm, "list-disc space-y-2 pl-5")}>
          {dependencyOrder.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
