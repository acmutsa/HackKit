/*
  Simple schema comparison test.

  This test imports both dialect schema modules and compares the set of table names
  and column names for each table. It prints differences and exits with code 1
  if any mismatches are detected.

  Run from repo root:
    pnpm --filter @your-workspace/db test:compare-schemas

  (If your workspace package name differs, run the file with ts-node or node after building.)
*/

import * as sqliteSchema from "../schema.sqlite";
import * as pgSchema from "../schema.pg";

function getTables(schemaModule: any) {
  // Drizzle schema exports are table objects; consider exports that have a `name` property
  return Object.entries(schemaModule)
    .filter(([, v]) => v && typeof v === "object" && "name" in (v as any))
    .map(([k, v]) => ({
      key: k,
      name: (v as any).name as string,
      columns: Object.keys(((v as any).columns) ?? {}),
    }));
}

function mapByName(arr: Array<{ key: string; name: string; columns: string[] }>) {
  const m: Record<string, { key: string; columns: string[] }> = {};
  for (const t of arr) m[t.name] = { key: t.key, columns: t.columns };
  return m;
}

const sqliteTables = getTables(sqliteSchema);
const pgTables = getTables(pgSchema);

const sqliteMap = mapByName(sqliteTables);
const pgMap = mapByName(pgTables);

let failed = false;

console.log(`SQLite tables: ${Object.keys(sqliteMap).length}`);
console.log(`Postgres tables: ${Object.keys(pgMap).length}`);

// Compare table presence
for (const tName of Object.keys(sqliteMap)) {
  if (!pgMap[tName]) {
    console.error(`Table present in sqlite but missing in pg: ${tName}`);
    failed = true;
  }
}
for (const tName of Object.keys(pgMap)) {
  if (!sqliteMap[tName]) {
    console.error(`Table present in pg but missing in sqlite: ${tName}`);
    failed = true;
  }
}

// Compare columns for common tables
for (const tName of Object.keys(sqliteMap)) {
  if (!pgMap[tName]) continue;
  const sCols = new Set(sqliteMap[tName].columns);
  const pCols = new Set(pgMap[tName].columns);
  Array.from(sCols).forEach((c) => {
    if (!pCols.has(c)) {
      console.error(`Column ${c} in table ${tName} exists in sqlite but missing in pg`);
      failed = true;
    }
  });
  Array.from(pCols).forEach((c) => {
    if (!sCols.has(c)) {
      console.error(`Column ${c} in table ${tName} exists in pg but missing in sqlite`);
      failed = true;
    }
  });
}

if (failed) {
  console.error("Schema comparison FAILED");
  process.exitCode = 1;
} else {
  console.log("Schema comparison passed: table names and column names match");
}
