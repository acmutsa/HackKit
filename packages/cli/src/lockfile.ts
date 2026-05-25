export type HackkitLockRoute = {
	host: string;
	source: string;
};

export type HackkitLockPlugin = {
	id: string;
	package: string;
	version: string;
	routes: HackkitLockRoute[];
	actions: string[];
};

export type HackkitLockfile = {
	version: 1;
	plugins: HackkitLockPlugin[];
};

export const HACKKIT_LOCKFILE = "hackkit.lock";

export function createEmptyLockfile(): HackkitLockfile {
	return { version: 1, plugins: [] };
}

export function readLockfile(content: string): HackkitLockfile {
	const parsed = JSON.parse(content) as HackkitLockfile;
	if (parsed.version !== 1 || !Array.isArray(parsed.plugins)) {
		throw new Error("Unsupported hackkit.lock format.");
	}
	return parsed;
}

export function serializeLockfile(lockfile: HackkitLockfile): string {
	return `${JSON.stringify(lockfile, null, 2)}\n`;
}
