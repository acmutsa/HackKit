import { createClient } from "@libsql/client";
import {
	createDrizzleDatabaseAdapter,
	createPluginRegistry,
} from "@hackkit/core";
import { drizzle } from "drizzle-orm/libsql";
import type { HackkitConfig } from "./config";
import { createConfigLogger } from "./logger";

export async function runDbSync(config: HackkitConfig): Promise<void> {
	const logger = createConfigLogger(config);
	const client = createClient({ url: config.databaseUrl });
	const db = drizzle(client);
	const registry = createPluginRegistry(config.plugins ?? []);
	const databaseAdapter = createDrizzleDatabaseAdapter(db as any);

	if (!databaseAdapter.schema?.sync) {
		throw new Error("Configured database adapter does not support schema sync.");
	}
	await databaseAdapter.schema.sync({ storage: registry.storage });

	if (config.auth?.syncStorage) {
		await config.auth.syncStorage(db);
	}

	logger.log("info", "HackKit database sync completed.");
}
