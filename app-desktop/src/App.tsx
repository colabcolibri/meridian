import {
  Activity,
  Blocks,
  CheckCircle2,
  CircleDashed,
  FileText,
  GitBranch,
  FolderOpen,
  ShieldCheck,
} from "lucide-react"
import type { ReactNode } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { phaseDocuments, userStories } from "@/domain/meridian/data"
import {
  canStartStory,
  getApprovedCount,
  getBlockedCount,
  isDocumentBlocked,
} from "@/domain/meridian/validators"
import type { DocStatus, StoryStatus } from "@/domain/meridian/types"

const statusLabels: Record<DocStatus, string> = {
  approved: "approved",
  review: "review",
  draft: "draft",
  pending: "pending",
}

const statusVariant: Record<DocStatus, "default" | "secondary" | "outline"> = {
  approved: "default",
  review: "secondary",
  draft: "secondary",
  pending: "outline",
}

const statusClassName: Record<DocStatus, string> = {
  approved: "bg-teal-700 text-white hover:bg-teal-700/90",
  review: "bg-amber-100 text-amber-900 hover:bg-amber-100",
  draft: "bg-zinc-100 text-zinc-700 hover:bg-zinc-100",
  pending: "text-zinc-600",
}

const storyStatusLabel: Record<StoryStatus, string> = {
  "✅": "concluída",
  "🔶": "em andamento",
  "❌": "pendente",
  "🧊": "congelada",
}

function App() {
  const approvedCount = getApprovedCount(phaseDocuments)
  const blockedCount = getBlockedCount(phaseDocuments)
  const nextDocuments = phaseDocuments.filter(
    (document) =>
      document.status !== "approved" && !isDocumentBlocked(document, phaseDocuments),
  )

  return (
    <main className="min-h-screen bg-zinc-50">
      <section className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-teal-800">
              <Blocks className="h-4 w-4" />
              Meridian Desktop
            </div>
            <h1 className="text-3xl font-semibold tracking-normal text-zinc-950">
              Monitore uma pasta Meridian sem perder o controle do processo.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
              Este app é a camada visual do protocolo: abre um projeto que contém
              `meridian.md` e `docs/`, lê documentos, decisões, user stories e
              `board.json`, reconhece `.agent/` para agentes e mostra o que está pronto,
              bloqueado ou desalinhado.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Ver protocolo
            </Button>
            <Button size="sm">
              <FolderOpen className="mr-2 h-4 w-4" />
              Abrir pasta
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-6 py-6 md:grid-cols-3">
        <MetricCard
          icon={<CheckCircle2 className="h-4 w-4" />}
          label="Docs aprovados"
          value={`${approvedCount}/${phaseDocuments.length}`}
          detail="No projeto monitorado"
        />
        <MetricCard
          icon={<ShieldCheck className="h-4 w-4" />}
          label="Kit de agentes"
          value=".agent/"
          detail="Agents, skills, rules e workflows"
        />
        <MetricCard
          icon={<Activity className="h-4 w-4" />}
          label="Bloqueios"
          value={String(blockedCount)}
          detail="Dependências ainda não liberadas"
        />
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-6 pb-8 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>Documentos de fase</CardTitle>
                <CardDescription>
                  Leitura da pasta `docs/` do projeto monitorado.
                </CardDescription>
              </div>
              <Badge variant="secondary">{nextDocuments.length} próximos</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-md border">
              <div className="grid grid-cols-[120px_1fr_110px_120px] gap-3 border-b bg-zinc-100 px-4 py-2 text-xs font-medium uppercase text-zinc-500">
                <span>Fase</span>
                <span>Documento</span>
                <span>Status</span>
                <span>Estado</span>
              </div>
              <div className="divide-y">
                {phaseDocuments.map((document) => {
                  const blocked = isDocumentBlocked(document, phaseDocuments)

                  return (
                    <div
                      className="grid grid-cols-[120px_1fr_110px_120px] gap-3 px-4 py-3 text-sm"
                      key={document.id}
                    >
                      <span className="text-zinc-500">{document.phase}</span>
                      <div>
                        <div className="font-medium text-zinc-950">
                          {document.title}
                        </div>
                        <div className="mt-1 text-xs text-zinc-500">
                          {document.purpose}
                        </div>
                        {document.dependsOn.length > 0 ? (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {document.dependsOn.map((dependency) => (
                              <Badge
                                className="font-mono"
                                key={dependency}
                                variant="outline"
                              >
                                {dependency}
                              </Badge>
                            ))}
                          </div>
                        ) : null}
                      </div>
                      <div>
                        <Badge
                          className={statusClassName[document.status]}
                          variant={statusVariant[document.status]}
                        >
                          {statusLabels[document.status]}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-600">
                        {blocked ? (
                          <>
                            <CircleDashed className="h-4 w-4 text-amber-600" />
                            bloqueado
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            liberado
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <aside className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>v0 Sprint</CardTitle>
              <CardDescription>
                Visão derivada dos arquivos em `docs/us/`.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {userStories.map((story) => {
                const ready = canStartStory(story, userStories)

                return (
                  <div className="rounded-md border p-3" key={story.id}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-mono text-xs text-zinc-500">
                          {story.id}
                        </div>
                        <div className="mt-1 text-sm font-medium">{story.title}</div>
                      </div>
                      <Badge
                        className={
                          ready
                            ? "bg-teal-700 text-white hover:bg-teal-700/90"
                            : "bg-amber-100 text-amber-900 hover:bg-amber-100"
                        }
                        variant={ready ? "default" : "secondary"}
                      >
                        {ready ? "pronta" : "aguarda"}
                      </Badge>
                    </div>
                    <Separator className="my-3" />
                    <div className="space-y-2 text-xs text-zinc-600">
                      <div className="flex items-center justify-between">
                        <span>Status</span>
                        <span>{storyStatusLabel[story.status]}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>MoSCoW</span>
                        <span>{story.moscow}</span>
                      </div>
                      <p className="leading-5">{story.doneWhen}</p>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Princípio operacional</CardTitle>
              <CardDescription>
                A ferramenta monitora; a pasta continua sendo a fonte de verdade.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 rounded-md border bg-zinc-50 p-3 text-sm leading-6 text-zinc-700">
                <GitBranch className="mt-1 h-4 w-4 shrink-0 text-teal-700" />
                <p>
                  O protocolo Meridian orienta agentes de IA. O app desktop apenas torna
                  visíveis decisões, bloqueios, status e inconsistências para quem
                  gerencia o processo.
                </p>
              </div>
            </CardContent>
          </Card>
        </aside>
      </section>
    </main>
  )
}

function MetricCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: ReactNode
  label: string
  value: string
  detail: string
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <div className="text-sm text-zinc-500">{label}</div>
          <div className="mt-1 text-2xl font-semibold">{value}</div>
          <div className="mt-1 text-xs text-zinc-500">{detail}</div>
        </div>
        <div className="rounded-md border bg-zinc-50 p-2 text-teal-700">{icon}</div>
      </CardContent>
    </Card>
  )
}

export default App
