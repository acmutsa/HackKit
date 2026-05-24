import { createClient } from "@libsql/client";
import {
	createPluginRegistry,
	syncDrizzleStorage,
} from "@hackkit/core";
import { drizzle } from "drizzle-orm/libsql";
import type { HackkitConfig } from "./config";

export async function runDbSync(config: HackkitConfig): Promise<void> {
	const client = createClient({ url: config.databaseUrl });
	const db = drizzle(client);
	const registry = createPluginRegistry(config.plugins ?? []);

	await syncDrizzleStorage(db as any, registry.storage);

	if (config.auth?.syncStorage) {
		await config.auth.syncStorage(db);
	}

	console.log("HackKit database sync completed.");
}
