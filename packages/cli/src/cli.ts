#!/usr/bin/env node
import { Command } from "commander";
import { loadConfig } from "./cli-config";

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

const plugins = program
	.command("plugin")
	.description("Manage HackKit plugins in this web app");

plugins
	.command("sync")
	.description("Sync plugin routes, actions, lockfile, and database schema")
	.option("-c, --config <path>", "path to HackKit config")
	.action(async (commandOptions: { config?: string }) => {
		const globalOptions = program.opts<{ config: string }>();
		const config = await loadConfig(
			commandOptions.config ?? globalOptions.config,
		);
		const { runPluginSyncAll } = await import("./plugin-commands");
		await runPluginSyncAll({
			projectRoot: process.cwd(),
			config,
		});
	});

plugins
	.command("add")
	.description("Add a HackKit plugin to this web app")
	.argument("<plugin>", "plugin id, e.g. teams")
	.option("-c, --config <path>", "path to HackKit config")
	.action(async (pluginId: string, commandOptions: { config?: string }) => {
		const globalOptions = program.opts<{ config: string }>();
		const config = await loadConfig(
			commandOptions.config ?? globalOptions.config,
		);
		const { runPluginAdd } = await import("./plugin-commands");
		await runPluginAdd({ projectRoot: process.cwd(), config }, pluginId);
	});

plugins
	.command("remove")
	.description("Remove a HackKit plugin from this web app")
	.argument("<plugin>", "plugin id, e.g. teams")
	.option("-c, --config <path>", "path to HackKit config")
	.action(async (pluginId: string, commandOptions: { config?: string }) => {
		const globalOptions = program.opts<{ config: string }>();
		const config = await loadConfig(
			commandOptions.config ?? globalOptions.config,
		);
		const { runPluginRemove } = await import("./plugin-commands");
		await runPluginRemove({ projectRoot: process.cwd(), config }, pluginId);
	});

program.parseAsync(process.argv).catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
