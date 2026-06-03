/** Static demo: bundled copy of app-desktop/docs (see scripts/sync-demo-docs.mjs). */
export function isDemoMode(): boolean {
  return import.meta.env.VITE_DEMO_MODE === "true"
}

export function demoDocsBaseUrl(): string {
  const base = import.meta.env.BASE_URL
  return `${base.endsWith("/") ? base : `${base}/`}demo-docs/`
}
