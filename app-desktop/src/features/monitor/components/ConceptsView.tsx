import {
  BookOpen,
  FileText,
  FolderOpen,
  FolderTree,
  GitBranch,
  Layers,
  ListChecks,
  Loader2,
  Map,
  Route,
  Users,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useProjectFolder } from "@/features/folder/ProjectFolderContext"
import { SetupStateLegend } from "@/features/monitor/components/SetupStateLegend"
import {
  appIntro,
  corePrinciples,
  epicsVersionsStories,
  firstSteps,
  folderStructure,
  journeyPhases,
  meridianIntro,
  monitorTabsGuide,
  phaseDocuments,
  statusGuide,
  userStoryAnatomy,
  type ConceptBlock,
  type GuideSubsection,
  type JourneyPhase,
} from "@/features/monitor/content/meridian-concepts"
import { typeScale } from "@/features/monitor/monitor-typography"
import { cn } from "@/lib/utils"

const principleIcons: Record<string, typeof BookOpen> = {
  "docs-first": FileText,
  "human-manager": Users,
  "audit-status": ListChecks,
  "derived-board": GitBranch,
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
    </Card>
  )
}

function GuideBlock({ section }: { section: GuideSubsection }) {
  return (
    <article className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <h4 className={typeScale.cardTitle}>{section.title}</h4>
      <div className="mt-3 space-y-3">
        {section.paragraphs.map((p) => (
          <p className={typeScale.body} key={p}>
            {p}
          </p>
        ))}
      </div>
      {section.bullets?.length ? (
        <ul className={cn(typeScale.bodySm, "mt-4 list-disc space-y-2 pl-5")}>
          {section.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
    </article>
  )
}

function JourneyCard({ phase }: { phase: JourneyPhase }) {
  return (
    <article className="relative rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <h4 className={typeScale.cardTitle}>{phase.label}</h4>
        <span className={typeScale.caption}>— {phase.subtitle}</span>
      </div>
      <p className={cn(typeScale.body, "mt-3")}>{phase.purpose}</p>
      <ul className={cn(typeScale.bodySm, "mt-4 space-y-2")}>
        {phase.documents.map((doc) => (
          <li className="flex gap-2" key={doc}>
            <span aria-hidden className="text-meridian">
              →
            </span>
            <span>{doc}</span>
          </li>
        ))}
      </ul>
      {phase.note ? (
        <p
          className={cn(
            typeScale.caption,
            "mt-4 rounded-lg bg-amber-50 px-3 py-2 text-amber-950",
          )}
        >
          {phase.note}
        </p>
      ) : null}
    </article>
  )
}

function OpenFolderCallout({ className }: { className?: string }) {
  const { folder, openFolder, fsAccessSupported, status } = useProjectFolder()
  const isOpening = status === "opening"

  if (folder) {
    return null
  }

  return (
    <section
      className={cn(
        "rounded-xl border border-meridian-border bg-meridian-muted/30 p-5 sm:p-6",
        className,
      )}
    >
      <h3 className={typeScale.sectionTitle}>Experimente com seu projeto</h3>
      <p className={cn(typeScale.body, "mt-2")}>
        Abra a pasta <strong className="font-medium text-foreground">docs</strong> do
        repositório (ex.:{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
          app-desktop/docs
        </code>
        ) para ver documentos, épicos e user stories reais nas outras abas.
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
        Abrir pasta docs
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
    <div className="w-full max-w-none space-y-12">
      <header className="space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-meridian" aria-hidden />
          <h2 className={typeScale.pageTitle}>{meridianIntro.title}</h2>
        </div>
        <Prose paragraphs={meridianIntro.paragraphs} />
      </header>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <FolderTree className="h-5 w-5 text-meridian" aria-hidden />
          <h3 className={typeScale.sectionTitle}>{folderStructure.title}</h3>
        </div>
        <Prose paragraphs={folderStructure.intro} />
        <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-3">
          {folderStructure.items.map((item) => (
            <div
              className="rounded-xl border border-border bg-muted/20 p-4"
              key={item.path}
            >
              <code className="font-mono text-xs text-meridian">{item.path}</code>
              <p className={cn(typeScale.label, "mt-2")}>{item.label}</p>
              <p className={cn(typeScale.bodySm, "mt-1.5")}>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Route className="h-5 w-5 text-meridian" aria-hidden />
          <h3 className={typeScale.sectionTitle}>O fluxo do projeto (fases)</h3>
        </div>
        <p className={typeScale.body}>
          Meridian não joga tudo de uma vez. Você amadurece documentos em fases — da
          fundação até a execução com user stories. A ordem importa: documentos
          bloqueados aparecem cinza na aba Configuração até os anteriores serem
          aprovados.
        </p>
        <div className="space-y-4">
          {journeyPhases.map((phase) => (
            <JourneyCard key={phase.id} phase={phase} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-meridian" aria-hidden />
          <h3 className={typeScale.sectionTitle}>Épicos, versões e user stories</h3>
        </div>
        <p className={typeScale.body}>
          Três conceitos que se encaixam assim:{" "}
          <strong className="text-foreground">épico</strong> define o bloco de produto →{" "}
          <strong className="text-foreground">versão</strong> define em qual release
          entra → <strong className="text-foreground">user story</strong> é a tarefa
          concreta que alguém implementa.
        </p>
        <div className="grid gap-4 lg:grid-cols-1">
          {epicsVersionsStories.map((section) => (
            <GuideBlock key={section.title} section={section} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className={typeScale.sectionTitle}>{userStoryAnatomy.title}</h3>
        <p className={typeScale.body}>{userStoryAnatomy.intro}</p>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[320px] border-collapse text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left">
                <th className="px-4 py-3 font-medium">Campo</th>
                <th className="px-4 py-3 font-medium">Significado</th>
              </tr>
            </thead>
            <tbody>
              {userStoryAnatomy.fields.map((row) => (
                <tr className="border-b last:border-0" key={row.field}>
                  <td className="px-4 py-3 font-mono text-xs">{row.field}</td>
                  <td className={cn(typeScale.bodySm, "px-4 py-3 text-foreground")}>
                    {row.meaning}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-xl border border-meridian-border bg-meridian-muted/20 p-5">
          <p className={typeScale.label}>{userStoryAnatomy.exampleTitle}</p>
          <p className={cn(typeScale.bodySm, "mt-2")}>{userStoryAnatomy.exampleBody}</p>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className={typeScale.sectionTitle}>{statusGuide.title}</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border p-5">
            <p className={typeScale.label}>Documentos de fase (00–11)</p>
            <ul className="mt-3 space-y-3">
              {statusGuide.documentStatuses.map((s) => (
                <li className="flex gap-2" key={s.label}>
                  <Badge variant="outline">{s.label}</Badge>
                  <span className={typeScale.bodySm}>{s.meaning}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t pt-4">
              <SetupStateLegend />
            </div>
          </div>
          <div className="rounded-xl border border-border p-5">
            <p className={typeScale.label}>User stories</p>
            <ul className="mt-3 space-y-3">
              {statusGuide.storyStatuses.map((s) => (
                <li className="flex gap-3" key={s.emoji}>
                  <span aria-hidden className="text-lg leading-none">
                    {s.emoji}
                  </span>
                  <div>
                    <p className={typeScale.label}>{s.label}</p>
                    <p className={typeScale.bodySm}>{s.meaning}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className={typeScale.body}>{statusGuide.kanbanNote}</p>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Map className="h-5 w-5 text-meridian" aria-hidden />
          <h3 className={typeScale.sectionTitle}>Referência: os 12 documentos</h3>
        </div>
        <div className="space-y-8">
          {phases.map((phase) => {
            const intro =
              phaseDocuments.find((d) => d.phase === phase)?.phaseIntro ?? ""
            return (
              <div className="space-y-3" key={phase}>
                <div>
                  <h4 className={typeScale.label}>{phase}</h4>
                  {intro ? (
                    <p className={cn(typeScale.bodySm, "mt-1")}>{intro}</p>
                  ) : null}
                </div>
                <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {phaseDocuments
                    .filter((doc) => doc.phase === phase)
                    .map((doc) => (
                      <li
                        className="rounded-lg border border-border bg-card px-3 py-2.5"
                        key={doc.id}
                      >
                        <p className={typeScale.docId}>{doc.id}</p>
                        <p className={cn(typeScale.caption, "mt-1")}>
                          {doc.description}
                        </p>
                      </li>
                    ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className={typeScale.sectionTitle}>{appIntro.title}</h3>
        <Prose paragraphs={appIntro.paragraphs} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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

      <section className="space-y-3 rounded-xl border border-border bg-muted/20 p-5">
        <h3 className={typeScale.sectionTitle}>Por onde começar na prática</h3>
        <ol className={cn(typeScale.body, "list-decimal space-y-2 pl-5")}>
          {firstSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <OpenFolderCallout />
    </div>
  )
}
