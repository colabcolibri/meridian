import { BookOpen, FileText, GitBranch, ListChecks, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { SetupStateLegend } from "@/features/monitor/components/SetupStateLegend"
import {
  AnatomyCard,
  ConceptAccordion,
  ConceptCard,
  GuideBlock,
  OpenFolderCallout,
  Prose,
} from "@/features/monitor/components/guide-components"
import {
  appIntro,
  corePrinciples,
  docFlowNote,
  epicAnatomy,
  epicsVersionsStories,
  folderStructure,
  journeyPhases,
  meridianIntro,
  monitorTabsGuide,
  nextStepsAfterConcepts,
  statusGuide,
  userStoryAnatomy,
  versionAnatomy,
  type JourneyPhase,
} from "@/features/monitor/content/meridian-concepts"
import { monitorPanelClass } from "@/features/monitor/monitor-ui"
import { typeScale } from "@/features/monitor/monitor-typography"
import { cn } from "@/lib/utils"

const principleIcons = {
  "docs-first": FileText,
  "human-manager": Users,
  "audit-status": ListChecks,
  "derived-board": GitBranch,
} as const

function JourneyCard({ phase }: { phase: JourneyPhase }) {
  return (
    <article className={cn(monitorPanelClass, "p-5 sm:p-6")}>
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

export function ConceptsView() {
  return (
    <div className="w-full max-w-none space-y-8">
      <header className="space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-meridian" aria-hidden />
          <h2 className={typeScale.pageTitle}>{meridianIntro.title}</h2>
        </div>
        <Prose paragraphs={meridianIntro.paragraphs} />
      </header>

      <ConceptAccordion
        defaultOpen
        subtitle="Documentos de fase na raiz e pastas de entrega"
        title={folderStructure.title}
      >
        <Prose paragraphs={folderStructure.intro} />
        <div className="mt-4 grid gap-3 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
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
      </ConceptAccordion>

      <ConceptAccordion
        subtitle="Dois eixos: sistema (Configuração) → entrega (pastas + Quadro)"
        title="O fluxo do projeto (fases)"
      >
        <p className={typeScale.body}>
          Meridian amadurece documentos em dois eixos: primeiro o sistema (fundação →
          princípios → arquitetura → detalhe na aba Configuração), depois a entrega nas
          pastas epics/, versions/, sprints/ e us/ (Entregas e Quadro).
        </p>
        <p className={cn(typeScale.bodySm, "mt-3 text-muted-foreground")}>
          {docFlowNote}
        </p>
        <div className="mt-4 space-y-4">
          {journeyPhases.map((phase) => (
            <JourneyCard key={phase.id} phase={phase} />
          ))}
        </div>
      </ConceptAccordion>

      <ConceptAccordion
        subtitle="Conceitos, campos do arquivo e exemplos de leitura"
        title="Épicos, versões e user stories"
      >
        <p className={typeScale.body}>
          Três conceitos encadeados: <strong className="text-foreground">épico</strong>{" "}
          (capacidade de produto) → <strong className="text-foreground">versão</strong>{" "}
          (release) → <strong className="text-foreground">user story</strong> (tarefa
          executável).
        </p>
        <div className="mt-4 grid gap-4">
          {epicsVersionsStories.map((section) => (
            <GuideBlock key={section.title} section={section} />
          ))}
        </div>
        <div className="mt-6 space-y-4">
          <p className={typeScale.label}>Como ler cada arquivo</p>
          <AnatomyCard guide={epicAnatomy} />
          <AnatomyCard guide={versionAnatomy} />
          <AnatomyCard guide={userStoryAnatomy} />
        </div>
      </ConceptAccordion>

      <ConceptAccordion
        subtitle="Docs de fase, épico, versão e US"
        title={statusGuide.title}
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-border p-5">
            <p className={typeScale.label}>Documentos de fase (00–08 e 11)</p>
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
          <div className="space-y-4">
            <div className="rounded-xl border border-border p-5">
              <p className={typeScale.label}>Épicos (docs/epics/)</p>
              <ul className="mt-3 space-y-3">
                {statusGuide.epicStatuses.map((s) => (
                  <li className="flex gap-2" key={s.label}>
                    <Badge variant="outline">{s.label}</Badge>
                    <span className={typeScale.bodySm}>{s.meaning}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-border p-5">
              <p className={typeScale.label}>Versões (docs/versions/)</p>
              <ul className="mt-3 space-y-3">
                {statusGuide.versionStatuses.map((s) => (
                  <li className="flex gap-2" key={s.label}>
                    <Badge variant="outline">{s.label}</Badge>
                    <span className={typeScale.bodySm}>{s.meaning}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-border p-5">
          <p className={typeScale.label}>User stories</p>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
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
        <p className={cn(typeScale.body, "mt-4")}>{statusGuide.kanbanNote}</p>
      </ConceptAccordion>

      <ConceptAccordion
        subtitle="Navegação depois de abrir docs/"
        title={appIntro.title}
      >
        <Prose paragraphs={appIntro.paragraphs} />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
      </ConceptAccordion>

      <ConceptAccordion
        subtitle="Quatro regras que governam todo o fluxo"
        title="Regras de ouro"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {corePrinciples.map((block) => (
            <ConceptCard
              block={block}
              icon={principleIcons[block.id as keyof typeof principleIcons] ?? BookOpen}
              key={block.id}
            />
          ))}
        </div>
      </ConceptAccordion>

      <section className="space-y-3 rounded-xl border border-meridian-border bg-meridian-muted/20 p-5">
        <h3 className={typeScale.sectionTitle}>{nextStepsAfterConcepts.title}</h3>
        <Prose paragraphs={nextStepsAfterConcepts.paragraphs} />
      </section>

      <OpenFolderCallout />
    </div>
  )
}
