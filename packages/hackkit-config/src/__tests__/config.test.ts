import { describe, expect, it } from "vitest";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
	defineHackkitConfig,
	loadHackkitConfig,
	resolveHackkitConfig,
} from "../index";

describe("HackKit config", () => {
	it("normalizes optional collection fields", () => {
		const config = resolveHackkitConfig(
			defineHackkitConfig({
				databaseUrl: "file:test.db",
			}),
		);

		expect(config.plugins).toEqual([]);
		expect(config.seedRoles).toEqual([]);
		expect(config.databaseUrl).toBe("file:test.db");
	});

	it("loads the test-web HackKit config through the shared loader", async () => {
		const repoRoot = resolve(
			dirname(fileURLToPath(import.meta.url)),
			"../../../..",
		);
		const config = await loadHackkitConfig("apps/test-web/hackkit.config.ts", {
			cwd: repoRoot,
		});

		expect(config.databaseUrl).toBe(
			process.env.DATABASE_URL ?? "file:.data/test-web.db",
		);
		expect(config.plugins).toHaveLength(1);
		expect(config.seedRoles.map((role) => role.id)).toContain("core.participant");
	});
});
