import { drizzle as drizzleLibsql } from "drizzle-orm/libsql";
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";
import { createClient as createClientEdge } from "@libsql/client/web";
import { createClient as createClientNodeServerless } from "@libsql/client";
import Database from "better-sqlite3";
import * as schema from "./schema.sqlite";

export * from "drizzle-orm";
export * as zod from "./zod";

// Decide which DB to use for Node/serverless
const provider = (process.env.DB_PROVIDER ?? "turso").toLowerCase() as
	| "turso"
	| "sqlite";

// --- Turso clients (Edge + Node) ---

const tursoEdge = createClientEdge({
	url: process.env.TURSO_DATABASE_URL!,
	authToken: process.env.TURSO_AUTH_TOKEN,
});

const tursoNodeServerless = createClientNodeServerless({
	url: process.env.TURSO_DATABASE_URL!,
	authToken: process.env.TURSO_AUTH_TOKEN,
});

// Edge runtime: always Turso (no SQLite/Postgres on edge)
export const db = drizzleLibsql(tursoEdge, { schema });

// Node / serverless: switchable
function createNodeDb() {
	if (provider === "sqlite") {
		const filePath = process.env.SQLITE_DB_FILE || "hackkit-dev.sqlite";
		const sqlite = new Database(filePath);
		return drizzleSqlite(sqlite, { schema });
	}

	// default: Turso/libSQL
	return drizzleLibsql(tursoNodeServerless, { schema });
}

export const dbNodeServerless = createNodeDb();

console.log("DB provider is:", provider);
