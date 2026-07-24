#!/usr/bin/env bash
# Carrega app-visual-studio/.env e publica na Marketplace (VSCE_PAT).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="${ROOT}/.env"

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "ERROR: missing ${ENV_FILE} — copy .env.example to .env and set VSCE_PAT" >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "${ENV_FILE}"
set +a

if [[ -z "${VSCE_PAT:-}" ]]; then
  echo "ERROR: VSCE_PAT is empty in .env" >&2
  exit 1
fi

cd "${ROOT}"
node scripts/bundle-kit.mjs
node esbuild.mjs
node scripts/copy-mermaid.mjs
pnpm exec vsce publish --no-dependencies
