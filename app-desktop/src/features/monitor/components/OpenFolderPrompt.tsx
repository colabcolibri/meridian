import { FolderOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useProjectFolder } from "@/features/folder/ProjectFolderContext"

export function OpenFolderPrompt() {
  const { folder, openFolder, fsAccessSupported, status } = useProjectFolder()

  if (folder) {
    return null
  }

  return (
    <Card className="border-dashed border-teal-200 bg-teal-50/30">
      <CardHeader>
        <CardTitle className="text-base">Abra a pasta docs do projeto</CardTitle>
        <CardDescription>
          Escolha a pasta <code className="rounded bg-white px-1">docs/</code> do
          projeto Meridian (ex.:{" "}
          <code className="rounded bg-white px-1">app-desktop/docs/</code>
          ). Nela ficam os arquivos 00–11,{" "}
          <code className="rounded bg-white px-1">us/</code> e{" "}
          <code className="rounded bg-white px-1">kanban/</code>. O handle fica salvo
          nesta sessão do navegador até você fechar ou recarregar sem permissão.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          disabled={!fsAccessSupported || status === "opening"}
          onClick={() => void openFolder()}
          size="sm"
        >
          <FolderOpen className="mr-2 h-4 w-4" />
          Abrir pasta docs
        </Button>
      </CardContent>
    </Card>
  )
}
