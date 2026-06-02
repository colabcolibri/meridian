import type { ProductVersion } from "@/domain/meridian/types"
import { useMonitorVersionFilter } from "@/features/monitor/MonitorVersionFilterContext"
import { filterChipClass } from "@/features/monitor/monitor-ui"
import { typeScale } from "@/features/monitor/monitor-typography"
import { cn } from "@/lib/utils"

export function VersionFilterBar({ versions }: { versions: ProductVersion[] }) {
  const {
    versionIds,
    selectedVersionIds,
    allSelected,
    toggleVersion,
    selectAllVersions,
    deselectAllVersions,
  } = useMonitorVersionFilter()

  const selectedCount = selectedVersionIds.size
  const canSelectAll = versionIds.length > 0 && !allSelected
  const canDeselectAll = selectedCount > 0
  const sortedVersions = [...versions].sort((a, b) =>
    b.id.localeCompare(a.id, undefined, { numeric: true }),
  )

  return (
    <div className="space-y-3" onClick={(event) => event.stopPropagation()}>
      <p className={typeScale.label}>
        Filtrar versões
        <span className="font-normal text-muted-foreground">
          {" · "}
          {selectedCount === 0
            ? "nenhuma selecionada"
            : `${selectedCount} de ${versionIds.length} no quadro`}
        </span>
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          className={cn(
            filterChipClass(false),
            "disabled:pointer-events-none disabled:opacity-50",
          )}
          disabled={!canSelectAll}
          onClick={(event) => {
            event.stopPropagation()
            selectAllVersions()
          }}
          type="button"
        >
          Marcar todas
        </button>
        <button
          className={cn(
            filterChipClass(false),
            "disabled:pointer-events-none disabled:opacity-50",
          )}
          disabled={!canDeselectAll}
          onClick={(event) => {
            event.stopPropagation()
            deselectAllVersions()
          }}
          type="button"
        >
          Desmarcar todas
        </button>

        {sortedVersions.map((version) => {
          const selected = selectedVersionIds.has(version.id)

          return (
            <button
              aria-pressed={selected}
              className={cn(filterChipClass(selected), "max-w-[220px] truncate")}
              key={version.id}
              onClick={(event) => {
                event.stopPropagation()
                toggleVersion(version.id)
              }}
              title={`${selected ? "Ocultar" : "Mostrar"} ${version.id} no quadro — ${version.title}`}
              type="button"
            >
              <span className="font-mono">{version.id}</span>
              {version.status === "planned" ? (
                <span
                  className={cn(
                    "ml-1.5 inline-flex rounded-full px-1.5 py-0.5 text-[9px] font-medium leading-none",
                    selected
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "border border-border bg-background text-muted-foreground",
                  )}
                >
                  planned
                </span>
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}
