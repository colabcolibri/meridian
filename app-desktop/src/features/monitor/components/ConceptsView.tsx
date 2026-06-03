import {
  BookOpen,
  FileText,
  GitBranch,
  ListChecks,
  Milestone,
  Rocket,
  Settings,
  Users,
  Zap,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { SetupStateLegend } from "@/features/monitor/components/SetupStateLegend"
import {
  AnatomyCard,
  ConceptAccordion,
  ConceptCard,
  OpenFolderCallout,
  Prose,
} from "@/features/monitor/components/guide-components"
import {
  appIntro,
  corePrinciples,
  decisionLogAnatomy,
  docFlowNote,
  epicAnatomy,
  epicsVersionsStories,
  folderStructure,
  journeyPhases,
  meridianIntro,
  monitorTabsGuide,
  nextStepsAfterConcepts,
  sprintAnatomy,
  statusGuide,
  userStoryAnatomy,
  versionAnatomy,
  type JourneyPhase,
} from "@/features/monitor/content/meridian-concepts"
import { monitorPanelClass } from "@/features/monitor/monitor-ui"
import { typeScale } from "@/features/monitor/monitor-typography"
import { cn } from "@/lib/utils"

const phaseIcons = [Settings, FileText, Milestone, Rocket]

const principleIcons = {
  "docs-first": FileText,
  "human-manager": Users,
  "audit-status": ListChecks,
  "refine-before-code": GitBranch,
  "derived-board": GitBranch,
} as const

function PhaseCard({ phase, index }: { phase: JourneyPhase; index: number }) {
  const Icon = phaseIcons[index] ?? Zap
  return (
    <article className={cn(monitorPanelClass, "flex flex-col gap-3 p-5")}>
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-meridian-muted">
          <Icon className="h-4 w-4 text-meridian" aria-hidden />
        </div>
        <div className="min-w-0">
          <h3 className={typeScale.cardTitle}>{phase.label}</h3>
          <p className={cn(typeScale.caption, "mt-0.5")}>{phase.subtitle}</p>
        </div>
      </div>
      <p className={typeScale.bodySm}>{phase.purpose}</p>
      <ul className="space-y-1.5">
        {phase.documents.map((doc) => (
          <li className="flex gap-2" key={doc}>
            <span aria-hidden className="shrink-0 text-meridian text-sm">
              →
            </span>
            <span className={typeScale.bodySm}>{doc}</span>
          </li>
        ))}
      </ul>
      {phase.gate ? (
        <p className="mt-auto rounded-lg bg-meridian-muted/40 px-3 py-2 text-xs font-medium text-meridian">
          Gate: {phase.gate}
        </p>
      ) : null}
      {phase.note ? (
        <p
          className={cn(
            typeScale.caption,
            "rounded-lg bg-amber-50 px-3 py-2 text-amber-900",
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
    <div className="w-full max-w-none space-y-10">
      {/* ── 1. Introduction ─────────────────────────────────────── */}
      <header className="space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-meridian" aria-hidden />
          <h2 className={typeScale.pageTitle}>{meridianIntro.title}</h2>
        </div>
        <Prose paragraphs={meridianIntro.paragraphs} />
      </header>

      {/* ── 2. Golden rules — visible, not collapsed ─────────────── */}
      <section className="space-y-4">
        <div>
          <h3 className={typeScale.sectionTitle}>Five rules that govern everything</h3>
          <p className={cn(typeScale.bodySm, "mt-1")}>
            These are not suggestions. Every workflow, every gate, every command exists
            because of these.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {corePrinciples.map((block) => (
            <ConceptCard
              block={block}
              icon={principleIcons[block.id as keyof typeof principleIcons] ?? BookOpen}
              key={block.id}
            />
          ))}
        </div>
      </section>

      {/* ── 3. Four phases — visible, not collapsed ───────────────── */}
      <section className="space-y-4">
        <div>
          <h3 className={typeScale.sectionTitle}>The four phases</h3>
          <p className={cn(typeScale.bodySm, "mt-1")}>
            Every project goes through these phases in order. Each one unlocks the next
            — you cannot skip.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {journeyPhases.map((phase, index) => (
            <PhaseCard index={index} key={phase.id} phase={phase} />
          ))}
        </div>
      </section>

      {/* ── 4. Document structure (collapsed) ────────────────────── */}
      <ConceptAccordion
        subtitle="The docs/ folder and what lives where"
        title={folderStructure.title}
      >
        <Prose paragraphs={folderStructure.intro} />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
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
        <p className={cn(typeScale.caption, "mt-4 rounded-lg bg-muted/40 px-3 py-2")}>
          {docFlowNote}
        </p>
      </ConceptAccordion>

      {/* ── 5. Epics / versions / sprints / stories relationship ──── */}
      <ConceptAccordion
        subtitle="How the four delivery artifacts connect"
        title="Epics, versions, sprints, and user stories"
      >
        <p className={typeScale.body}>
          Four linked artifacts: <strong className="text-foreground">epic</strong>{" "}
          (product capability) → <strong className="text-foreground">version</strong>{" "}
          (release) → <strong className="text-foreground">sprint</strong> (time box) →{" "}
          <strong className="text-foreground">user story</strong> (executable task).
        </p>
        <div className="mt-4 grid gap-4">
          {epicsVersionsStories.map((section) => (
            <article className={cn(monitorPanelClass, "p-5")} key={section.title}>
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
          ))}
        </div>
      </ConceptAccordion>

      {/* ── 6. Anatomy of each artifact (collapsed) ──────────────── */}
      <ConceptAccordion
        subtitle="Every field and section explained — open when you need the detail"
        title="Anatomy of each artifact"
      >
        <p className={cn(typeScale.bodySm, "mb-4")}>
          Each artifact is a Markdown file with YAML frontmatter and a structured body.
          Here is what every field and section means.
        </p>
        <div className="space-y-4">
          <AnatomyCard guide={epicAnatomy} />
          <AnatomyCard guide={versionAnatomy} />
          <AnatomyCard guide={sprintAnatomy} />
          <AnatomyCard guide={userStoryAnatomy} />
          <AnatomyCard guide={decisionLogAnatomy} />
        </div>
      </ConceptAccordion>

      {/* ── 7. Status reference (collapsed) ──────────────────────── */}
      <ConceptAccordion
        subtitle="Phase docs, epics, versions, sprints, and user stories"
        title={statusGuide.title}
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="rounded-xl border border-border p-5">
              <p className={typeScale.label}>Phase documents (00–08 and 11)</p>
              <ul className="mt-3 space-y-3">
                {statusGuide.documentStatuses.map((s) => (
                  <li className="flex gap-3 items-start" key={s.label}>
                    <Badge variant="outline" className="shrink-0 mt-0.5">
                      {s.label}
                    </Badge>
                    <span className={typeScale.bodySm}>{s.meaning}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 border-t pt-4">
                <SetupStateLegend />
              </div>
            </div>
            <div className="rounded-xl border border-border p-5">
              <p className={typeScale.label}>Epics (docs/epics/)</p>
              <ul className="mt-3 space-y-3">
                {statusGuide.epicStatuses.map((s) => (
                  <li className="flex gap-3 items-start" key={s.label}>
                    <Badge variant="outline" className="shrink-0 mt-0.5">
                      {s.label}
                    </Badge>
                    <span className={typeScale.bodySm}>{s.meaning}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-xl border border-border p-5">
              <p className={typeScale.label}>Versions (docs/versions/)</p>
              <ul className="mt-3 space-y-3">
                {statusGuide.versionStatuses.map((s) => (
                  <li className="flex gap-3 items-start" key={s.label}>
                    <Badge variant="outline" className="shrink-0 mt-0.5">
                      {s.label}
                    </Badge>
                    <span className={typeScale.bodySm}>{s.meaning}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-border p-5">
              <p className={typeScale.label}>Sprints (docs/sprints/)</p>
              <ul className="mt-3 space-y-3">
                {statusGuide.sprintStatuses.map((s) => (
                  <li className="flex gap-3 items-start" key={s.label}>
                    <Badge variant="outline" className="shrink-0 mt-0.5">
                      {s.label}
                    </Badge>
                    <span className={typeScale.bodySm}>{s.meaning}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-border p-5">
              <p className={typeScale.label}>User stories</p>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {statusGuide.storyStatuses.map((s) => (
                  <li className="flex gap-3" key={s.emoji}>
                    <span aria-hidden className="text-lg leading-none shrink-0">
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
        </div>
        <p className={cn(typeScale.bodySm, "mt-4 rounded-lg bg-muted/40 px-3 py-2")}>
          {statusGuide.kanbanNote}
        </p>
      </ConceptAccordion>

      {/* ── 8. App tabs (collapsed) ───────────────────────────────── */}
      <ConceptAccordion
        subtitle="What each tab shows after opening docs/"
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

      {/* ── 9. Next step ─────────────────────────────────────────── */}
      <section className="space-y-3 rounded-xl border border-meridian-border bg-meridian-muted/20 p-5 sm:p-6">
        <h3 className={typeScale.sectionTitle}>{nextStepsAfterConcepts.title}</h3>
        <Prose paragraphs={nextStepsAfterConcepts.paragraphs} />
      </section>

      <OpenFolderCallout />
    </div>
  )
}
