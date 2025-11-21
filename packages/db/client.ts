import dotenv from "dotenv";
dotenv.config({ path: "../../.env.local" });

import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { drizzle as drizzleSqlite } from "drizzle-orm/libsql";
import { drizzle as drizzleLocalSqlite } from "drizzle-orm/better-sqlite3";

import { Pool } from "pg";
import Database from "better-sqlite3";
import { createClient as createLibSQLClient } from "@libsql/client";
import path from "path";

import * as pgSchema from "./schema.pg";
import * as sqliteSchema from "./schema.sqlite";

type DbDriver = "sqlite" | "turso" | "postgres";

const rawDbType = process.env.DB_TYPE;
let DB_DRIVER: DbDriver;
let db: any = null;

if (!rawDbType || rawDbType === "sqlite") {
  DB_DRIVER = "sqlite";

  const sqlitePath = path.join(__dirname, "local.db");
  const sqlite = new Database(sqlitePath);

  db = drizzleLocalSqlite(sqlite, {
    schema: sqliteSchema,
  });

} else if (rawDbType === "turso") {
  DB_DRIVER = "turso";

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    throw new Error(
      'TURSO_DATABASE_URL and TURSO_AUTH_TOKEN are required when DB_TYPE="turso"'
    );
  }

  const client = createLibSQLClient({ url, authToken });

  db = drizzleSqlite(client, {
    schema: sqliteSchema,
  });

} else if (rawDbType === "postgres") {
  DB_DRIVER = "postgres";

  const connectionString = process.env.POSTGRES_URL;
  if (!connectionString) {
    throw new Error(
      'POSTGRES_URL is required when DB_TYPE="postgres"'
    );
  }

  const pool = new Pool({ connectionString });

  db = drizzlePg(pool, {
    schema: pgSchema,
  });

} else {
  throw new Error(
    `Invalid DB_TYPE "${rawDbType}". Must be one of: sqlite | turso | postgres`
  );
}

export { db, DB_DRIVER };
