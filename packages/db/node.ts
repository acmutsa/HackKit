import { drizzle } from "drizzle-orm/libsql";
import { createClient as createClientNodeServerless } from "@libsql/client";
import * as schema from "./schema";

const tursoNodeServerless = createClientNodeServerless({
	url: process.env.TURSO_DATABASE_URL!,
	authToken: process.env.TURSO_AUTH_TOKEN,
});

export const dbNodeServerless = drizzle(tursoNodeServerless, { schema });
