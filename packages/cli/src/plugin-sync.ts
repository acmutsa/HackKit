import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import type { HackKitPlugin } from "@hackkit/core";
import {
	createEmptyLockfile,
	HACKKIT_LOCKFILE,
	readLockfile,
	serializeLockfile,
	type HackkitLockfile,
	type HackkitLockPlugin,
} from "./lockfile";
import { resolvePluginPackage } from "./plugin-manifest";
import {
	DEFAULT_PROTECTED_PATHS,
	isProtectedPath,
	normalizeAppPath,
} from "./protected-paths";

const GENERATED_HEADER = "// @hackkit-generated — do not edit";

const DEFAULT_EXPORT_ROUTE_FILES = new Set([
	"page.tsx",
	"page.ts",
	"page.jsx",
	"page.js",
	"layout.tsx",
	"layout.ts",
	"layout.jsx",
	"layout.js",
	"template.tsx",
	"template.ts",
	"default.tsx",
	"default.ts",
	"loading.tsx",
	"loading.ts",
	"error.tsx",
	"error.ts",
	"not-found.tsx",
	"not-found.ts",
	"global-error.tsx",
	"global-error.ts",
]);

export type PluginSyncOptions = {
	projectRoot: string;
	plugins: readonly HackKitPlugin[];
	protectedPaths?: readonly string[];
};

export type PluginSyncResult = {
	lockfile: HackkitLockfile;
	routesWritten: number;
	actionsWritten: number;
	stubsRemoved: number;
};

function renderRouteStub(
	plugin: HackkitLockPlugin,
	route: { host: string; source: string; fileName: string },
): string {
	const lines = [
		GENERATED_HEADER,
		`// Owner: ${plugin.id}@${plugin.version}`,
		`export * from "${route.source}";`,
	];
	if (DEFAULT_EXPORT_ROUTE_FILES.has(route.fileName)) {
		lines.push(`export { default } from "${route.source}";`);
	}
	lines.push("");
	return lines.join("\n");
}

function renderPluginActionsFile(
	plugins: readonly {
		id: string;
		packageName: string;
		actionFactory?: string;
		actionNames?: readonly string[];
	}[],
): string {
	const lines = [
		'"use server";',
		"",
		GENERATED_HEADER,
		"",
		'import { getRuntime } from "@/lib/runtime";',
	];

	for (const plugin of plugins) {
		if (!plugin.actionFactory || !plugin.actionNames?.length) continue;
		lines.push(
			`import { ${plugin.actionFactory} } from "${plugin.packageName}";`,
		);
	}

	lines.push("");

	for (const plugin of plugins) {
		if (!plugin.actionFactory || !plugin.actionNames?.length) continue;
		const factoryVar = `${plugin.id}ActionsPromise`;
		lines.push(
			`const ${factoryVar} = getRuntime().then((runtime) =>`,
			`	${plugin.actionFactory}(runtime),`,
			`);`,
			"",
		);
		for (const actionName of plugin.actionNames) {
			lines.push(
				`export async function ${actionName}(...args: Parameters<Awaited<ReturnType<typeof ${plugin.actionFactory}>>["${actionName}"]>) {`,
				`	const actions = await ${factoryVar};`,
				`	return actions.${actionName}(...args);`,
				`}`,
				"",
			);
		}
	}

	return lines.join("\n");
}

function collectRouteClaims(
	resolvedPlugins: ReturnType<typeof resolvePluginPackage>[],
	protectedPaths: readonly string[],
): Map<string, string> {
	const claims = new Map<string, string>();

	for (const resolved of resolvedPlugins) {
		for (const route of resolved.routes) {
			const host = normalizeAppPath(route.host);
			if (isProtectedPath(host, protectedPaths)) {
				throw new Error(
					`Plugin '${resolved.plugin.id}' route '${host}' conflicts with a protected host path.`,
				);
			}
			const existingOwner = claims.get(host);
			if (existingOwner && existingOwner !== resolved.plugin.id) {
				throw new Error(
					`Route '${host}' is claimed by both '${existingOwner}' and '${resolved.plugin.id}'.`,
				);
			}
			claims.set(host, resolved.plugin.id);
		}
	}

	return claims;
}

function writeGeneratedFile(path: string, content: string): void {
	mkdirSync(dirname(path), { recursive: true });
	writeFileSync(path, content, "utf8");
}

export async function runPluginSync(
	options: PluginSyncOptions,
): Promise<PluginSyncResult> {
	const projectRoot = options.projectRoot;
	const protectedPaths = options.protectedPaths ?? DEFAULT_PROTECTED_PATHS;
	const lockfilePath = join(projectRoot, HACKKIT_LOCKFILE);
	const previousLockfile = existsSync(lockfilePath)
		? readLockfile(readFileSync(lockfilePath, "utf8"))
		: createEmptyLockfile();

	const resolvedPlugins = options.plugins.map((plugin) =>
		resolvePluginPackage(plugin, projectRoot),
	);
	collectRouteClaims(resolvedPlugins, protectedPaths);

	const nextLockfile: HackkitLockfile = {
		version: 1,
		plugins: resolvedPlugins.map((resolved) => ({
			id: resolved.plugin.id,
			package: resolved.packageName,
			version: resolved.version,
			routes: resolved.routes.map(({ host, source }) => ({ host, source })),
			actions: [...(resolved.plugin.actionNames ?? [])],
		})),
	};

	const nextStubPaths = new Set<string>();
	let routesWritten = 0;

	for (const resolved of resolvedPlugins) {
		const lockPlugin = nextLockfile.plugins.find(
			(entry) => entry.id === resolved.plugin.id,
		);
		if (!lockPlugin) continue;

		for (const route of resolved.routes) {
			const hostPath = join(projectRoot, route.host);
			nextStubPaths.add(normalizeAppPath(route.host));
			writeGeneratedFile(
				hostPath,
				renderRouteStub(lockPlugin, route),
			);
			routesWritten += 1;
		}
	}

	let stubsRemoved = 0;
	for (const plugin of previousLockfile.plugins) {
		for (const route of plugin.routes) {
			const host = normalizeAppPath(route.host);
			if (nextStubPaths.has(host)) continue;
			const hostPath = join(projectRoot, route.host);
			if (!existsSync(hostPath)) continue;
			const content = readFileSync(hostPath, "utf8");
			if (!content.startsWith(GENERATED_HEADER)) continue;
			rmSync(hostPath);
			stubsRemoved += 1;
		}
	}

	const actionsPath = join(projectRoot, "app/hackkit-plugin-actions.ts");
	const actionsContent = renderPluginActionsFile(
		resolvedPlugins.map((resolved) => ({
			id: resolved.plugin.id,
			packageName: resolved.packageName,
			actionFactory: resolved.plugin.actionFactory,
			actionNames: resolved.plugin.actionNames,
		})),
	);
	writeGeneratedFile(actionsPath, actionsContent);

	writeFileSync(lockfilePath, serializeLockfile(nextLockfile), "utf8");

	return {
		lockfile: nextLockfile,
		routesWritten,
		actionsWritten: resolvedPlugins.reduce(
			(total, plugin) => total + (plugin.plugin.actionNames?.length ?? 0),
			0,
		),
		stubsRemoved,
	};
}
