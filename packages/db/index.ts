import { drizzle } from "drizzle-orm/libsql";
import { createClient as createClientEdge } from "@libsql/client/web";
import { createClient as createClientNodeServerless } from "@libsql/client";
import * as schema from "./schema";
import "server-only";

export * from "drizzle-orm";
export * as zod from "./zod";

// Run turso dev to fire up local db
const tursoDummy = createClientNodeServerless({
	url: "http://127.0.0.1:8080",
});

/**
const tursoEdge = createClientEdge({
	url: process.env.TURSO_DATABASE_URL!,
	authToken: process.env.TURSO_AUTH_TOKEN,
}); 

const tursoNodeServerless = createClientNodeServerless({
	url: process.env.TURSO_DATABASE_URL!,
	authToken: process.env.TURSO_AUTH_TOKEN,
});
*/

export const db = drizzle(tursoDummy, {schema});
//export const db = drizzle(tursoEdge, { schema });
//export const dbNodeServerless = drizzle(tursoNodeServerless, { schema });
