import "server-only";

import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

function resolveDatabaseUrl(): string {
	const url = process.env.DATABASE_URL ?? "file:.data/test-web.db";
	if (!url.startsWith("file:")) return url;

	const filePath = url.slice("file:".length);
	if (filePath.startsWith("/") || filePath.includes("://")) return url;

	mkdirSync(dirname(filePath), { recursive: true });
	return url;
}

const client = createClient({ url: resolveDatabaseUrl() });

export const db = drizzle(client);
