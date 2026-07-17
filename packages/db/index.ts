import { drizzle } from "drizzle-orm/libsql";
import { createClient as createClientEdge } from "@libsql/client/web";
import * as schema from "./schema";
import "server-only";

export * from "drizzle-orm";
export * as zod from "./zod";
const tursoEdge = createClientEdge({
	url: process.env.TURSO_DATABASE_URL!,
	authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(tursoEdge, { schema });
