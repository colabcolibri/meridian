import { useState } from "react"
import { FolderOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface OpenFolderDialogProps {
  initialPath?: string
  onSubmit: (path: string) => void
  disabled?: boolean
  children: React.ReactNode
}

export function OpenFolderDialog({
  initialPath = "",
  onSubmit,
  disabled,
  children,
}: OpenFolderDialogProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(initialPath)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    onSubmit(trimmed)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Open project folder</DialogTitle>
          <DialogDescription>
            Paste the absolute path to your project's <strong>docs</strong> folder (e.g.{" "}
            <span className="font-mono text-xs">/Users/you/project/docs</span>). The
            path is saved and restored on every reload.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            autoFocus
            type="text"
            placeholder="/Users/you/project/docs"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={disabled}
            className="font-mono text-sm"
          />
          <DialogFooter>
            <Button type="submit" disabled={disabled || !value.trim()}>
              <FolderOpen className="mr-2 h-4 w-4" />
              Open
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
