import path from "node:path"
import { fileURLToPath } from "node:url"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

import { meridianFileServerPlugin } from "./vite-file-server"
import { meridianValidateApi } from "./vite-meridian-validate"

const appDesktopRoot = path.dirname(fileURLToPath(import.meta.url))

/** Vite must not watch the monorepo outside app-desktop (avoids page reload on extension/kit edits). */
function isInsideAppDesktop(watchPath: string): boolean {
  const resolved = path.resolve(watchPath)
  return (
    resolved === appDesktopRoot || resolved.startsWith(`${appDesktopRoot}${path.sep}`)
  )
}

export default defineConfig({
  // GitHub Pages project site: https://<org>.github.io/<repo>/ — set VITE_BASE_PATH=/repo/ in CI
  base: process.env.VITE_BASE_PATH ?? "/",
  root: appDesktopRoot,
  envDir: appDesktopRoot,
  plugins: [meridianFileServerPlugin(), meridianValidateApi(), react(), tailwindcss()],
  server: {
    port: 5173,
    strictPort: false,
    watch: {
      ignored: [
        "**/node_modules/**",
        "**/.git/**",
        (watchPath) => !isInsideAppDesktop(watchPath),
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(appDesktopRoot, "./src"),
    },
  },
})
