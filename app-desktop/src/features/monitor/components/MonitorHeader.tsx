import { Blocks } from "lucide-react"

export function MonitorHeader() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-teal-800">
          <Blocks className="h-4 w-4" />
          Meridian Desktop
        </div>
        <h1 className="text-2xl font-semibold text-zinc-950 sm:text-3xl">
          Monitor do projeto Meridian
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
          Três visões: configurar a pasta (docs 00–11), acompanhar épicos e operar o
          kanban de user stories ligado a cada epic.
        </p>
      </div>
    </header>
  )
}
