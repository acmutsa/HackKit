import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { env } from "../env";

const client = createClient({
	url: env.databaseUrl,
	authToken: env.tursoAuthToken,
});

export const db = drizzle(client);
