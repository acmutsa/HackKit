#!/usr/bin/env node
import { Command } from "commander";
import { createJiti } from "jiti";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
//#region src/cli.ts
const jiti = createJiti(fileURLToPath(import.meta.url));
async function loadConfig(configFile) {
	const configPath = resolve(process.cwd(), configFile);
	const module = await jiti.import(configPath);
	const config = module.default ?? module;
	if (!config?.databaseUrl) throw new Error(`No HackKit config with databaseUrl found at ${configPath}`);
	return config;
}
const program = new Command().name("hackkit").description("Manage HackKit projects").option("-c, --config <path>", "path to HackKit config", "hackkit.config.ts");
program.command("db").description("Manage HackKit database resources").command("sync").description("Synchronize registered HackKit storage models").option("-c, --config <path>", "path to HackKit config").action(async (commandOptions) => {
	const globalOptions = program.opts();
	const config = await loadConfig(commandOptions.config ?? globalOptions.config);
	const { runDbSync } = await import("./db-sync-CD0uKRb9.js").then((n) => n.t);
	await runDbSync(config);
});
program.parseAsync(process.argv).catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
//#endregion
export {};

//# sourceMappingURL=cli.js.map