// packages/db/client.ts
import dotenv from "dotenv";
dotenv.config({ path: "../../.env.local" });

import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { drizzle as drizzleTurso } from "drizzle-orm/libsql";

import { Pool } from "pg";
import { createClient as createLibSQLClient } from "@libsql/client";

import { pgSchema, sqliteSchema } from "./schema";

type DbDriver = "turso" | "postgres";

const rawDbType = process.env.DB_TYPE;
let DB_DRIVER: DbDriver;
let db: any = null;
let schema: any = null;

if (rawDbType === "turso") {
  DB_DRIVER = "turso";

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    throw new Error('TURSO_DATABASE_URL and TURSO_AUTH_TOKEN are required');
  }

  const client = createLibSQLClient({ url, authToken });

  schema = sqliteSchema; 
  db = drizzleTurso(client, { schema });


} else if (rawDbType === "postgres") {
  DB_DRIVER = "postgres";

  const connectionString = process.env.POSTGRES_URL;
  if (!connectionString) {
    throw new Error('POSTGRES_URL is required when DB_TYPE="postgres"');
  }

  const pool = new Pool({ connectionString });

  schema = pgSchema;
  db = drizzlePg(pool, { schema });


} else {
  throw new Error(
    `Invalid DB_TYPE "${rawDbType}". Must be one of: turso | postgres`
  );
}

export { db, schema, DB_DRIVER };
