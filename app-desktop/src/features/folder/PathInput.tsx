import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface PathInputProps {
  initialPath?: string
  onSubmit: (path: string) => void
  disabled?: boolean
}

export function PathInput({ initialPath = "", onSubmit, disabled }: PathInputProps) {
  const [value, setValue] = useState(initialPath)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed) onSubmit(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm gap-2">
      <Input
        type="text"
        placeholder="/absolute/path/to/docs"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        className="font-mono text-sm"
      />
      <Button type="submit" disabled={disabled || !value.trim()} variant="outline">
        Open
      </Button>
    </form>
  )
}
