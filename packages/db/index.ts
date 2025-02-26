import { drizzle } from "drizzle-orm/libsql";
import { createClient as createClientEdge } from "@libsql/client/web";
import { createClient as createClientNodeServerless } from "@libsql/client";
import * as schema from "./schema";

export * from "drizzle-orm";
export * as zod from "./zod";
const tursoEdge = createClientEdge({
	url: process.env.TURSO_DATABASE_URL!,
	authToken: process.env.TURSO_AUTH_TOKEN,
});

const tursoNodeServerless = createClientNodeServerless({
	url: process.env.TURSO_DATABASE_URL!,
	authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(tursoEdge, { schema });
export const dbNodeServerless = drizzle(tursoNodeServerless, { schema });
