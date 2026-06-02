import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

import { meridianValidateApi } from "./vite-meridian-validate"

export default defineConfig({
  plugins: [react(), tailwindcss(), meridianValidateApi()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
