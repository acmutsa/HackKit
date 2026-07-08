import { readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROUTE_FILE_PATTERN =
	/^(page|layout|template|default|loading|error|not-found|route|global-error)\.(tsx?|jsx?)$/;

export const DEFAULT_PROTECTED_PATHS = [
	"app/layout.tsx",
	"app/globals.css",
	"app/providers.tsx",
	"app/page.tsx",
	"app/dashboard",
	"app/sign-in",
	"app/register",
	"app/pass",
	"app/schedule",
	"app/admin",
	"app/api",
] as const;

export function normalizeAppPath(path: string): string {
	return path.split(sep).join("/");
}

export function isRouteFile(fileName: string): boolean {
	return ROUTE_FILE_PATTERN.test(fileName);
}

function matchesProtectedPrefix(
	hostPath: string,
	protectedPath: string,
): boolean {
	if (protectedPath.endsWith("/")) {
		return hostPath.startsWith(protectedPath);
	}
	return hostPath === protectedPath || hostPath.startsWith(`${protectedPath}/`);
}

export function isProtectedPath(
	hostPath: string,
	protectedPaths: readonly string[] = DEFAULT_PROTECTED_PATHS,
): boolean {
	const normalized = normalizeAppPath(hostPath);
	return protectedPaths.some((protectedPath) =>
		matchesProtectedPrefix(normalized, protectedPath),
	);
}

export function discoverPluginRouteFiles(
	appDir: string,
): { relativePath: string; fileName: string }[] {
	const routes: { relativePath: string; fileName: string }[] = [];

	function walk(currentDir: string): void {
		for (const entry of readdirSync(currentDir, { withFileTypes: true })) {
			const fullPath = join(currentDir, entry.name);
			if (entry.isDirectory()) {
				walk(fullPath);
				continue;
			}
			if (!isRouteFile(entry.name)) continue;
			const relativePath = normalizeAppPath(relative(appDir, fullPath));
			routes.push({ relativePath, fileName: entry.name });
		}
	}

	if (!statSync(appDir).isDirectory()) {
		return routes;
	}

	walk(appDir);
	return routes.sort((left, right) =>
		left.relativePath.localeCompare(right.relativePath),
	);
}
