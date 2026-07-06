import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { existsSync, readFileSync } from "node:fs";
import type { HackKitPlugin } from "@hackkit/core";
import { discoverPluginRouteFiles } from "./protected-paths";

function findPackageRoot(resolvedPath: string, packageName: string): string {
	let dir = dirname(resolvedPath);
	while (dir !== dirname(dir)) {
		const packageJsonPath = join(dir, "package.json");
		if (existsSync(packageJsonPath)) {
			const packageJson = JSON.parse(
				readFileSync(packageJsonPath, "utf8"),
			) as {
				name?: string;
			};
			if (packageJson.name === packageName) return dir;
		}
		dir = dirname(dir);
	}
	throw new Error(`Could not locate package root for '${packageName}'.`);
}

export type ResolvedPlugin = {
	plugin: HackKitPlugin;
	packageName: string;
	packageRoot: string;
	version: string;
	routes: { host: string; source: string; fileName: string }[];
};

export function resolvePluginPackage(
	plugin: HackKitPlugin,
	projectRoot: string,
): ResolvedPlugin {
	const packageName = plugin.packageName;
	if (!packageName) {
		throw new Error(
			`HackKit plugin '${plugin.id}' is missing packageName required for CLI sync.`,
		);
	}

	const require = createRequire(join(projectRoot, "package.json"));
	const entryPath = require.resolve(packageName);
	const packageRoot = findPackageRoot(entryPath, packageName);
	const packageJsonPath = join(packageRoot, "package.json");
	const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
		version?: string;
	};
	const appDir = join(packageRoot, "app");
	const routeFiles = existsSync(appDir)
		? discoverPluginRouteFiles(appDir)
		: [];

	return {
		plugin,
		packageName,
		packageRoot,
		version: packageJson.version ?? "0.0.0",
		routes: routeFiles.map(({ relativePath, fileName }) => {
			const host = join("app", relativePath);
			const modulePath = relativePath.replace(/\.(tsx?|jsx?)$/, "");
			return {
				host,
				source: `${packageName}/app/${modulePath}`,
				fileName,
			};
		}),
	};
}

export const PLUGIN_PACKAGE_BY_ID: Record<
	string,
	{ packageName: string; importName: string }
> = {
	teams: {
		packageName: "@hackkit/plugin-teams",
		importName: "teamsPlugin",
	},
	discord: {
		packageName: "@hackkit/plugin-discord",
		importName: "discordPlugin",
	},
	notificationsEmail: {
		packageName: "@hackkit/plugin-notifications-email",
		importName: "emailNotificationsPlugin",
	},
};

export function loadPluginFactory(
	projectRoot: string,
	pluginId: string,
): () => HackKitPlugin {
	const manifest = PLUGIN_PACKAGE_BY_ID[pluginId];
	if (!manifest) {
		throw new Error(`Unknown plugin '${pluginId}'.`);
	}
	const require = createRequire(join(projectRoot, "package.json"));
	const module = require(manifest.packageName) as Record<string, unknown>;
	const factory = module[manifest.importName];
	if (typeof factory !== "function") {
		throw new Error(
			`Plugin '${pluginId}' does not export ${manifest.importName}().`,
		);
	}
	return factory as () => HackKitPlugin;
}
