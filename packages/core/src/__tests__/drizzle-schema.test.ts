import { describe, expect, it } from "vitest";
import { compileDrizzleStorage, toDrizzleTableExportName } from "../adapters/db/drizzle";
import { defineModel, field } from "../database";
import { createPluginRegistry, type HackKitPlugin } from "../plugins";

describe("Drizzle schema compiler", () => {
	it("compiles merged core and plugin storage into one schema surface", () => {
		const pluginModel = defineModel("sample.entry", {
			fields: {
				id: field.string().primaryKey().defaultId(),
				authId: field
					.string()
					.references("core.user", "authId", { onDelete: "cascade" }),
				slug: field.string().unique(),
				status: field.enum(["draft", "published"] as const).default("draft"),
			},
			unique: [["authId", "slug"]],
			indexes: [["status"]],
		});
		const plugin = {
			id: "sample",
			models: { entry: pluginModel },
		} satisfies HackKitPlugin;
		const registry = createPluginRegistry([plugin]);

		const compiled = compileDrizzleStorage(registry.storage);

		expect(compiled.schemaSource).toContain("export const coreSetting");
		expect(compiled.schemaSource).toContain(
			"export const coreNotificationIntent",
		);
		expect(compiled.schemaSource).toContain("export const sampleEntry");
		expect(compiled.schemaSource).toContain(
			'references(() => coreUser.authId, { onDelete: "cascade" })',
		);
		expect(compiled.syncStatements).toContainEqual(
			expect.stringContaining('CREATE TABLE IF NOT EXISTS "core_setting"'),
		);
		expect(compiled.syncStatements).toContainEqual(
			expect.stringContaining('REFERENCES "core_user"("authId") ON DELETE CASCADE'),
		);
		expect(compiled.syncStatements).toContainEqual(
			expect.stringContaining(
				'CREATE UNIQUE INDEX IF NOT EXISTS "sample_entry_authId_slug_uniq"',
			),
		);
		expect(compiled.syncStatements).toContainEqual(
			expect.stringContaining(
				'CREATE INDEX IF NOT EXISTS "sample_entry_status_idx"',
			),
		);
	});

	it("derives stable table export names", () => {
		expect(toDrizzleTableExportName("core.userData")).toBe("coreUserData");
		expect(toDrizzleTableExportName("teams.invite")).toBe("teamsInvite");
	});
});
