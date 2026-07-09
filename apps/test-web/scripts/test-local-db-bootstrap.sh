#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VERIFY_DIR="$ROOT/.data/verify-local-db-init"
DATABASE_PATH="$VERIFY_DIR/test-web.db"

cleanup() {
	rm -rf "$VERIFY_DIR"
}
trap cleanup EXIT

rm -rf "$VERIFY_DIR"
mkdir -p "$VERIFY_DIR"

DATABASE_URL="file:$DATABASE_PATH" \
	HACKKIT_LOCAL_BLOB_BASE_DIR="$VERIFY_DIR/uploads" \
	bash "$ROOT/scripts/bootstrap-local-db.sh"

if [[ ! -f "$DATABASE_PATH" ]]; then
	echo "Expected first-run initialization to create $DATABASE_PATH." >&2
	exit 1
fi

initialized_tables="$(
	node --input-type=module -e "
		import { createClient } from '@libsql/client';
		const client = createClient({ url: 'file:$DATABASE_PATH' });
		const result = await client.execute(\"SELECT name FROM sqlite_master WHERE type = 'table' AND name IN ('user', 'teams_team') ORDER BY name\");
		console.log(result.rows.map((row) => row.name).join(','));
		await client.close();
	"
)"
if [[ "$initialized_tables" != "teams_team,user" ]]; then
	echo "Expected Better Auth and plugin tables after initialization." >&2
	exit 1
fi

marker="$(date +%s)"
node --input-type=module -e "
	import { createClient } from '@libsql/client';
	const client = createClient({ url: 'file:$DATABASE_PATH' });
	await client.execute('CREATE TABLE verify_marker (value TEXT NOT NULL)');
	await client.execute({ sql: 'INSERT INTO verify_marker (value) VALUES (?)', args: ['$marker'] });
	await client.close();
"

DATABASE_URL="file:$DATABASE_PATH" \
	HACKKIT_LOCAL_BLOB_BASE_DIR="$VERIFY_DIR/uploads" \
	bash "$ROOT/scripts/bootstrap-local-db.sh"

persisted_marker="$(
	node --input-type=module -e "
		import { createClient } from '@libsql/client';
		const client = createClient({ url: 'file:$DATABASE_PATH' });
		const result = await client.execute('SELECT value FROM verify_marker');
		console.log(result.rows[0].value);
		await client.close();
	"
)"

if [[ "$persisted_marker" != "$marker" ]]; then
	echo "Existing local database data was not preserved." >&2
	exit 1
fi

echo "Verified missing-database initialization and existing-data preservation."
