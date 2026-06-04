import { useRef, type ComponentProps, type ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { useProjectFolder } from "@/features/folder/ProjectFolderContext"

type OpenFolderButtonProps = Omit<ComponentProps<typeof Button>, "onClick" | "type"> & {
  children: ReactNode
}

/**
 * Opens the OS folder dialog via a hidden &lt;input webkitdirectory&gt;.
 * Unlike showDirectoryPicker, this survives React's async handler and does not
 * get stuck when transient user activation expires in the same tab.
 */
export function OpenFolderButton({
  children,
  disabled,
  ...buttonProps
}: OpenFolderButtonProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const {
    applyFolderFromFileList,
    cancelOpening,
    fsAccessSupported,
    isDemoBuild,
    openFolder,
    openFolderFromPicker,
  } = useProjectFolder()

  const handleClick = () => {
    if (isDemoBuild) {
      openFolder()
      return
    }

    cancelOpening()

    if (openFolderFromPicker()) {
      return
    }

    inputRef.current?.click()
  }

  const handleInputChange = () => {
    const input = inputRef.current
    if (!input?.files?.length) {
      return
    }

    const files = Array.from(input.files)
    input.value = ""
    applyFolderFromFileList(files)
  }

  return (
    <>
      {!isDemoBuild ? (
        <input
          type="file"
          className="sr-only"
          tabIndex={-1}
          aria-hidden
          multiple
          onChange={handleInputChange}
          ref={(element) => {
            inputRef.current = element
            if (element) {
              element.setAttribute("webkitdirectory", "")
              element.setAttribute("directory", "")
            }
          }}
        />
      ) : null}
      <Button
        type="button"
        disabled={disabled ?? (!isDemoBuild && !fsAccessSupported)}
        onClick={handleClick}
        {...buttonProps}
      >
        {children}
      </Button>
    </>
  )
}
