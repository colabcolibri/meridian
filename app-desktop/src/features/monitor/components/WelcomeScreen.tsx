import { FolderOpen, FolderTree, LayoutDashboard, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useProjectFolder } from "@/features/folder/ProjectFolderContext"
import { MONITOR_CONTAINER } from "@/features/monitor/monitor-layout"

const steps = [
  {
    icon: FolderTree,
    title: "Escolha a pasta docs do seu projeto",
    body: "É a pasta onde ficam escopo, versões, user stories e o quadro — a mesma que você edita com agentes no Cursor.",
  },
  {
    icon: LayoutDashboard,
    title: "Acompanhe configuração, entregas e quadro",
    body: "Três visões: progresso dos documentos iniciais, épicos do produto e status de cada entrega.",
  },
  {
    icon: Sparkles,
    title: "Use Chrome ou Edge em localhost",
    body: "O navegador precisa permitir abrir a pasta no seu computador (uma vez por sessão).",
  },
]

export function WelcomeScreen() {
  const { folder, openFolder, fsAccessSupported, status, error } = useProjectFolder()

  if (folder) {
    return null
  }

  const isOpening = status === "opening"

  return (
    <section className={`${MONITOR_CONTAINER} py-10 sm:py-14`}>
      <div className="mx-auto max-w-xl text-center">
        <p className="text-sm font-medium text-meridian-muted-foreground">
          Meridian Desktop
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
          Gerencie seu projeto pela pasta docs
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          Abra a pasta <strong className="font-medium text-zinc-800">docs</strong> do
          projeto (ex.: <span className="font-mono text-xs">app-desktop/docs</span>)
          para ver o mesmo conteúdo que seus agentes usam.
        </p>
      </div>

      <ol className="mx-auto mt-10 grid max-w-2xl gap-4 sm:gap-5">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <li
              className="flex gap-4 rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm sm:p-5"
              key={step.title}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-meridian-muted text-sm font-semibold text-meridian-muted-foreground">
                {index + 1}
              </div>
              <div className="min-w-0 text-left">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 shrink-0 text-meridian" aria-hidden />
                  <h3 className="text-sm font-semibold text-zinc-950">{step.title}</h3>
                </div>
                <p className="mt-1.5 text-sm leading-6 text-zinc-600">{step.body}</p>
              </div>
            </li>
          )
        })}
      </ol>

      <div className="mx-auto mt-10 flex max-w-xl flex-col items-center gap-3">
        <Button
          className="h-11 w-full max-w-sm text-base sm:w-auto sm:min-w-[240px]"
          disabled={!fsAccessSupported || isOpening}
          onClick={() => void openFolder()}
          size="lg"
        >
          <FolderOpen className="mr-2 h-5 w-5" />
          Abrir pasta do projeto
        </Button>
        {!fsAccessSupported ? (
          <p className="text-center text-xs text-amber-800">
            Seu navegador não suporta abertura de pasta. Use Chrome ou Edge em
            localhost.
          </p>
        ) : null}
        {error ? (
          <p className="text-center text-sm text-red-800" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </section>
  )
}
