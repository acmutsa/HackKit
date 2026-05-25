import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";
import type { HackkitConfig } from "./config";
import { runDbSync } from "./db-sync";
import { PLUGIN_PACKAGE_BY_ID, loadPluginFactory } from "./plugin-manifest";
import { runPluginSync } from "./plugin-sync";

export type PluginCommandContext = {
	projectRoot: string;
	config: HackkitConfig;
};

function readJson(path: string): Record<string, unknown> {
	return JSON.parse(readFileSync(path, "utf8")) as Record<string, unknown>;
}

function writeJson(path: string, value: Record<string, unknown>): void {
	writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function ensurePluginInConfig(
	configPath: string,
	pluginId: string,
	packageName: string,
	importName: string,
): void {
	let source = readFileSync(configPath, "utf8");
	if (source.includes(`${importName}()`)) return;

	if (!source.includes(`from "${packageName}"`)) {
		source = source.replace(
			/(import[^\n]+\n)/,
			`import { ${importName} } from "${packageName}";\n$1`,
		);
	}

	source = source.replace(
		/plugins:\s*\[\s*\]/,
		`plugins: [${importName}()]`,
	);
	source = source.replace(
		/plugins:\s*\[([^\]]*)\]/,
		(match, current: string) => {
			if (current.includes(`${importName}()`)) return match;
			const trimmed = current.trim();
			const next = trimmed ? `${trimmed}, ${importName}()` : importName();
			return `plugins: [${next}]`;
		},
	);

	writeFileSync(configPath, source, "utf8");
}

function removePluginFromConfig(
	configPath: string,
	importName: string,
	packageName: string,
): void {
	let source = readFileSync(configPath, "utf8");
	source = source.replace(new RegExp(`${importName}\\(\\),\\s*`, "g"), "");
	source = source.replace(new RegExp(`,\\s*${importName}\\(\\)`, "g"), "");
	source = source.replace(new RegExp(`${importName}\\(\\)`, "g"), "");
	source = source.replace(new RegExp(`plugins:\\s*\\[\\s*\\]`), "plugins: []");
	source = source.replace(
		new RegExp(`import \\{ ${importName} \\} from "${packageName}";\\n`, "g"),
		"",
	);
	writeFileSync(configPath, source, "utf8");
}

export async function runPluginAdd(
	context: PluginCommandContext,
	pluginId: string,
): Promise<void> {
	const manifest = PLUGIN_PACKAGE_BY_ID[pluginId];
	if (!manifest) {
		throw new Error(
			`Unknown plugin '${pluginId}'. Known plugins: ${Object.keys(PLUGIN_PACKAGE_BY_ID).join(", ")}`,
		);
	}

	const packageJsonPath = join(context.projectRoot, "package.json");
	const packageJson = readJson(packageJsonPath);
	const dependencies =
		(packageJson.dependencies as Record<string, string> | undefined) ?? {};
	if (!dependencies[manifest.packageName]) {
		dependencies[manifest.packageName] = "workspace:*";
		packageJson.dependencies = dependencies;
		writeJson(packageJsonPath, packageJson);
		execSync("pnpm install", {
			cwd: context.projectRoot,
			stdio: "inherit",
		});
	}

	const configPath = join(context.projectRoot, "hackkit.config.ts");
	ensurePluginInConfig(
		configPath,
		pluginId,
		manifest.packageName,
		manifest.importName,
	);

	const { loadConfig } = await import("./cli-config");
	const refreshedConfig = await loadConfig("hackkit.config.ts");
	await runPluginSyncAll({
		projectRoot: context.projectRoot,
		config: refreshedConfig,
	});
}

export async function runPluginRemove(
	context: PluginCommandContext,
	pluginId: string,
): Promise<void> {
	const manifest = PLUGIN_PACKAGE_BY_ID[pluginId];
	if (!manifest) {
		throw new Error(`Unknown plugin '${pluginId}'.`);
	}

	const configPath = join(context.projectRoot, "hackkit.config.ts");
	removePluginFromConfig(
		configPath,
		manifest.importName,
		manifest.packageName,
	);

	const packageJsonPath = join(context.projectRoot, "package.json");
	const packageJson = readJson(packageJsonPath);
	const dependencies =
		(packageJson.dependencies as Record<string, string> | undefined) ?? {};
	delete dependencies[manifest.packageName];
	packageJson.dependencies = dependencies;
	writeJson(packageJsonPath, packageJson);

	const nextConfig = {
		...context.config,
		plugins: (context.config.plugins ?? []).filter(
			(plugin) => plugin.id !== pluginId,
		),
	};
	await runPluginSync({
		projectRoot: context.projectRoot,
		plugins: nextConfig.plugins ?? [],
	});
	await runDbSync(nextConfig);
}

export async function runPluginSyncAll(
	context: PluginCommandContext,
): Promise<void> {
	const result = await runPluginSync({
		projectRoot: context.projectRoot,
		plugins: context.config.plugins ?? [],
	});
	await runDbSync(context.config);
	console.log(
		`HackKit plugin sync completed (${result.routesWritten} routes, ${result.actionsWritten} actions, ${result.stubsRemoved} removed).`,
	);
}
