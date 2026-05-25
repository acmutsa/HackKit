#!/usr/bin/env node
import { Command } from "commander";
import { createJiti } from "jiti";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { HackkitConfig } from "./config";

const jiti = createJiti(fileURLToPath(import.meta.url));

async function loadConfig(configFile: string): Promise<HackkitConfig> {
	const configPath = resolve(process.cwd(), configFile);
	const module = await jiti.import(configPath);
	const config = ((module as { default?: HackkitConfig }).default ??
		module) as HackkitConfig;
	if (!config?.databaseUrl) {
		throw new Error(
			`No HackKit config with databaseUrl found at ${configPath}`,
		);
	}
	return config;
}

const program = new Command()
	.name("hackkit")
	.description("Manage HackKit projects")
	.option(
		"-c, --config <path>",
		"path to HackKit config",
		"hackkit.config.ts",
	);

const db = program
	.command("db")
	.description("Manage HackKit database resources");

db.command("sync")
	.description("Synchronize registered HackKit storage models")
	.option("-c, --config <path>", "path to HackKit config")
	.action(async (commandOptions: { config?: string }) => {
		const globalOptions = program.opts<{ config: string }>();
		const config = await loadConfig(
			commandOptions.config ?? globalOptions.config,
		);
		const { runDbSync } = await import("./db-sync");
		await runDbSync(config);
	});

program.parseAsync(process.argv).catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
