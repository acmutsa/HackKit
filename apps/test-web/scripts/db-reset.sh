#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DATA_DIR="$ROOT/.data"
UPLOADS_DIR="$DATA_DIR/uploads"

rm -f \
	"$DATA_DIR/test-web.db" \
	"$DATA_DIR/ci.db" \
	"$DATA_DIR/test-web.db-wal" \
	"$DATA_DIR/test-web.db-shm" \
	"$DATA_DIR/ci.db-wal" \
	"$DATA_DIR/ci.db-shm"

rm -rf "$UPLOADS_DIR"
mkdir -p "$UPLOADS_DIR"

cd "$ROOT"

pnpm db:sync

DATABASE_URL="file:.data/ci.db" \
	NEXT_PUBLIC_APP_URL="http://localhost:3000" \
	BETTER_AUTH_URL="http://localhost:3000" \
	BETTER_AUTH_SECRET="ci-test-web-secret-at-least-32-chars" \
	HACKKIT_BLOB_ADAPTER="local" \
	pnpm db:sync

echo "Reset complete: test-web.db, ci.db, and local uploads."
