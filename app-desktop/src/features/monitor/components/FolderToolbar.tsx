import { AlertCircle, FolderOpen, Loader2, RefreshCw } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { countIssuesBySeverity } from "@/domain/meridian/protocol-validators"
import { useProjectData } from "@/features/folder/ProjectDataContext"
import { useProjectFolder } from "@/features/folder/ProjectFolderContext"

export function FolderToolbar() {
  const { status, folder, hints, error, fsAccessSupported, openFolder, clearFolder } =
    useProjectFolder()
  const { issues } = useProjectData()
  const { errors, warnings } = countIssuesBySeverity(issues)

  const isOpening = status === "opening"

  return (
    <div className="border-b bg-zinc-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          {folder ? (
            <>
              <Badge className="bg-teal-700 text-white hover:bg-teal-700/90">
                Pasta: {folder.name}
              </Badge>
              {folder.validation.hasScopeDoc ? (
                <Badge variant="outline">00_scope.md</Badge>
              ) : null}
              {folder.validation.hasUsDir ? <Badge variant="outline">us/</Badge> : null}
              {folder.validation.hasKanban ? (
                <Badge variant="outline">kanban/</Badge>
              ) : null}
              {errors + warnings > 0 ? (
                <Badge className="bg-red-700 text-white hover:bg-red-700/90">
                  {errors + warnings} problema{errors + warnings === 1 ? "" : "s"}
                </Badge>
              ) : null}
            </>
          ) : (
            <span className="text-sm text-zinc-600">
              Nenhuma pasta aberta — abra a pasta docs para carregar as abas.
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            disabled={isOpening || !fsAccessSupported}
            onClick={() => void openFolder()}
            size="sm"
          >
            {isOpening ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FolderOpen className="mr-2 h-4 w-4" />
            )}
            {folder ? "Trocar pasta" : "Abrir pasta docs"}
          </Button>
          {folder ? (
            <Button
              disabled={isOpening}
              onClick={() => void clearFolder()}
              size="sm"
              variant="outline"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Fechar
            </Button>
          ) : null}
        </div>
      </div>

      {!fsAccessSupported ? (
        <p className="mx-auto max-w-7xl px-6 pb-3 text-sm text-amber-800">
          File System Access API indisponível neste navegador. Use Chrome ou Edge em{" "}
          <code className="rounded bg-amber-100 px-1">localhost</code> para abrir a
          pasta docs do projeto.
        </p>
      ) : null}

      {error ? (
        <div className="mx-auto flex max-w-7xl items-start gap-2 px-6 pb-3 text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      {folder && hints.length > 0 ? (
        <p className="mx-auto max-w-7xl px-6 pb-3 text-xs text-zinc-500">
          {hints.join(" ")}
        </p>
      ) : null}

      {folder ? (
        <p className="mx-auto max-w-7xl px-6 pb-3 text-xs text-teal-800">
          Pasta docs validada. As abas leem os arquivos reais desta pasta (00–11, us/,
          kanban/).
        </p>
      ) : null}
    </div>
  )
}
