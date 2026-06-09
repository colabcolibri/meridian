#!/usr/bin/env bash
# Sync Meridian kit → IDE adapters (Cursor .cursor/, Claude Code .claude/).
#
# .agent-native IDEs (Antigravity, ag-kit, etc.) read .agent/ directly — no sync needed.
# Use install-meridian-kit.sh --no-sync or skip this script for those tools.
#
# Run from project root:
#   ./.agent/scripts/sync_cursor_kit.sh
#   ./.agent/scripts/sync_cursor_kit.sh --cursor-only
#   ./.agent/scripts/sync_cursor_kit.sh --dry-run

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
AGENT="${ROOT}/.agent"
CURSOR="${ROOT}/.cursor"
CLAUDE="${ROOT}/.claude"
REGISTRY="${AGENT}/references/templates"
DOCS_TPL="${ROOT}/app-desktop/docs/templates"

SYNC_CURSOR=1
SYNC_CLAUDE=1
DRY_RUN=0
PRUNE=1

usage() {
  cat <<'EOF'
sync_cursor_kit.sh — symlink .agent/ into Cursor and Claude Code adapters

Usage:
  sync_cursor_kit.sh [options]

Options:
  --cursor-only   Sync .cursor/ only
  --claude-only   Sync .claude/ only
  --no-prune      Create/update links but do not remove orphan Meridian symlinks
  --dry-run       Print actions without writing
  -h, --help      This help

Policy:
  - Never deletes .cursor/ or .claude/ wholesale
  - Replaces Meridian symlinks (targets under .agent/)
  - Removes orphan Meridian symlinks (removed from kit)
  - Leaves real files and non-Meridian symlinks untouched

Antigravity and other .agent-native tools: skip this script; .agent/ is enough.
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --cursor-only) SYNC_CURSOR=1; SYNC_CLAUDE=0; shift ;;
    --claude-only) SYNC_CURSOR=0; SYNC_CLAUDE=1; shift ;;
    --no-prune) PRUNE=0; shift ;;
    --dry-run) DRY_RUN=1; shift ;;
    -h | --help) usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage >&2; exit 1 ;;
  esac
done

if [[ ! -d "${AGENT}" ]]; then
  echo "ERROR: missing .agent at ${AGENT}" >&2
  exit 1
fi

if [[ "${SYNC_CURSOR}" -eq 1 && ! -d "${REGISTRY}" ]]; then
  echo "ERROR: missing template registry at ${REGISTRY}" >&2
  exit 1
fi

declare -a EXPECTED=()

register_expected() {
  EXPECTED+=("$1")
}

is_meridian_symlink() {
  local item="$1"
  [[ -L "${item}" ]] || return 1
  local target
  target="$(readlink "${item}")"
  [[ "${target}" == *".agent/"* || "${target}" == *".agent" ]]
}

link() {
  local target="$1"
  local linkpath="$2"
  register_expected "${linkpath}"
  if [[ "${DRY_RUN}" -eq 1 ]]; then
    echo "[dry-run] link ${linkpath} -> ${target}"
    return 0
  fi
  mkdir -p "$(dirname "${linkpath}")"
  rm -f "${linkpath}"
  ln -s "${target}" "${linkpath}"
  echo "link ${linkpath} -> ${target}"
}

prune_orphans() {
  local adapter_root="$1"
  local label="$2"
  [[ -d "${adapter_root}" ]] || return 0

  while IFS= read -r -d '' item; do
    is_meridian_symlink "${item}" || continue
    local found=0 exp
    for exp in "${EXPECTED[@]}"; do
      if [[ "${item}" == "${exp}" ]]; then
        found=1
        break
      fi
    done
    if [[ "${found}" -eq 0 ]]; then
      if [[ "${DRY_RUN}" -eq 1 ]]; then
        echo "[dry-run] remove orphan ${label}: ${item}"
      else
        rm -f "${item}"
        echo "removed orphan ${label}: ${item}"
      fi
    fi
  done < <(find "${adapter_root}" -type l -print0 2>/dev/null)
}

sync_cursor() {
  mkdir -p "${CURSOR}/rules" "${CURSOR}/skills" "${CURSOR}/agents" "${CURSOR}/commands" "${CURSOR}/references/templates"

  for tpl_file in "${REGISTRY}"/*.md; do
    [[ -f "${tpl_file}" ]] || continue
    name="$(basename "${tpl_file}")"
    link "../../../.agent/references/templates/${name}" "${CURSOR}/references/templates/${name}"
  done

  if [[ -d "${ROOT}/app-desktop/docs" ]]; then
    mkdir -p "${DOCS_TPL}"
    for tpl_file in "${REGISTRY}"/*.md; do
      [[ -f "${tpl_file}" ]] || continue
      name="$(basename "${tpl_file}")"
      [[ "${name}" == "README.md" ]] && continue
      link "../../../.agent/references/templates/${name}" "${DOCS_TPL}/${name}"
    done
    echo "Synced human mirror: ${DOCS_TPL}"
  fi

  for skill_dir in "${AGENT}"/skills/*/; do
    [[ -d "${skill_dir}" ]] || continue
    name="$(basename "${skill_dir}")"
    link "../../.agent/skills/${name}" "${CURSOR}/skills/${name}"
  done

  mkdir -p "${CURSOR}/skills/meridian-authoring"
  link "../../../.agent/skills/doc.md" "${CURSOR}/skills/meridian-authoring/SKILL.md"

  for agent_file in "${AGENT}"/agents/*.md; do
    [[ -f "${agent_file}" ]] || continue
    name="$(basename "${agent_file}")"
    link "../../.agent/agents/${name}" "${CURSOR}/agents/${name}"
  done

  for workflow_file in "${AGENT}"/workflows/*.md; do
    [[ -f "${workflow_file}" ]] || continue
    name="$(basename "${workflow_file}")"
    link "../../.agent/workflows/${name}" "${CURSOR}/commands/${name}"
  done

  link "../../.agent/rules/meridian.mdc" "${CURSOR}/rules/meridian.mdc"
  link "../../.agent/IDE_ADAPTERS.md" "${CURSOR}/README.md"

  if [[ "${PRUNE}" -eq 1 ]]; then
    prune_orphans "${CURSOR}" "cursor"
  fi
}

sync_claude() {
  mkdir -p "${CLAUDE}/commands" "${CLAUDE}/agents"

  for workflow_file in "${AGENT}"/workflows/*.md; do
    [[ -f "${workflow_file}" ]] || continue
    name="$(basename "${workflow_file}")"
    link "../../.agent/workflows/${name}" "${CLAUDE}/commands/${name}"
  done

  for agent_file in "${AGENT}"/agents/*.md; do
    [[ -f "${agent_file}" ]] || continue
    name="$(basename "${agent_file}")"
    link "../../.agent/agents/${name}" "${CLAUDE}/agents/${name}"
  done

  link "../../.agent/IDE_ADAPTERS.md" "${CLAUDE}/README.md"

  if [[ "${PRUNE}" -eq 1 ]]; then
    prune_orphans "${CLAUDE}" "claude"
  fi
}

if [[ "${SYNC_CURSOR}" -eq 1 ]]; then
  sync_cursor
fi

if [[ "${SYNC_CLAUDE}" -eq 1 ]]; then
  sync_claude
fi

echo ""
if [[ "${SYNC_CURSOR}" -eq 1 ]]; then
  echo "Cursor adapter: ${CURSOR}"
fi
if [[ "${SYNC_CLAUDE}" -eq 1 ]]; then
  echo "Claude Code adapter: ${CLAUDE}"
fi
if [[ "${SYNC_CURSOR}" -eq 0 && "${SYNC_CLAUDE}" -eq 0 ]]; then
  echo "Nothing synced (both adapters disabled)."
fi
echo "Source: .agent/ (committed) → local symlinks (gitignored)"
echo "Other IDEs: use .agent/ directly — no adapter sync required."
