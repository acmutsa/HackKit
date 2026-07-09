#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DATABASE_URL="${DATABASE_URL:-file:.data/test-web.db}"

# Remote databases and custom adapters are owned by their deployment workflow.
# This guard only bootstraps a missing file-backed database for local development.
if [[ "$DATABASE_URL" != file:* ]]; then
	echo "Skipping local database initialization for $DATABASE_URL."
	exit 0
fi

DATABASE_PATH="${DATABASE_URL#file:}"
DATABASE_PATH="${DATABASE_PATH%%\?*}"
if [[ "$DATABASE_PATH" != /* ]]; then
	DATABASE_PATH="$ROOT/$DATABASE_PATH"
fi

if [[ -e "$DATABASE_PATH" ]]; then
	echo "Local database already exists; preserving $DATABASE_PATH."
	exit 0
fi

echo "Initializing missing local database at $DATABASE_PATH."
cd "$ROOT"
pnpm sync
