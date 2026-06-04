import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

import { meridianFileServerPlugin } from "./vite-file-server"
import { meridianValidateApi } from "./vite-meridian-validate"

export default defineConfig({
  // GitHub Pages project site: https://<org>.github.io/<repo>/ — set VITE_BASE_PATH=/repo/ in CI
  base: process.env.VITE_BASE_PATH ?? "/",
  plugins: [meridianFileServerPlugin(), meridianValidateApi(), react(), tailwindcss()],
  server: {
    port: 5173,
    strictPort: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
