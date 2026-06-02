import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

import { meridianValidateApi } from "./vite-meridian-validate"

export default defineConfig({
  plugins: [meridianValidateApi(), react(), tailwindcss()],
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
