import { describe, expect, it } from "vitest";
import { createInMemoryDatabaseAdapterFromStorage } from "../adapters/db/memory";
import { createHackkit } from "../hackkit";
import { createPluginRegistry } from "../plugins";
import { CoreSetting } from "../settings";

function createTestHackkit() {
	const registry = createPluginRegistry();
	const now = () => new Date("2026-05-24T12:00:00.000Z");
	let counter = 0;
	const id = () => `id-${++counter}`;
	const db = createInMemoryDatabaseAdapterFromStorage(
		registry.storage,
		now,
		id,
	);
	return createHackkit({
		database: db,
		clock: now,
		id,
		groups: [
			{ id: "alpha", label: "Alpha", discordRoleName: "Alpha Role" },
			{ id: "beta", label: "Beta", discordRoleName: "Beta Role" },
		],
	});
}

async function seedOwner(hackkit: ReturnType<typeof createHackkit>) {
	await hackkit.users.ensureUser({
		authId: "owner-auth",
		email: "owner@example.com",
		firstName: "Olive",
		lastName: "Owner",
	});
	await hackkit.roles.bootstrapOwner({ authId: "owner-auth" });
}

async function seedHacker(
	hackkit: ReturnType<typeof createHackkit>,
	authId: string,
	group?: string,
) {
	await hackkit.users.ensureUser({
		authId,
		email: `${authId}@example.com`,
		firstName: "Test",
		lastName: "Hacker",
	});
	await hackkit.userData.completeUserData({
		authId,
		age: 20,
		gender: "prefer_not_to_answer",
		race: "prefer_not_to_answer",
		ethnicity: "prefer_not_to_answer",
		shirtSize: "m",
		dietaryRestrictions: ["none"],
		hasAcceptedMLHCodeOfConduct: true,
		hasSharedDataWithMLH: true,
		isEmailable: true,
	});
	await hackkit.hackers.registerHacker({
		authId,
		university: "Test U",
		major: "CS",
		levelOfStudy: "Undergraduate",
		hackathonsAttended: 1,
		softwareExperience: "Intermediate",
		group,
	});
}

describe("groups", () => {
	it("assigns approved hackers across enabled groups without overwriting existing groups", async () => {
		const hackkit = createTestHackkit();
		await seedOwner(hackkit);
		await hackkit.settings.setMany({
			actorAuthId: "owner-auth",
			values: [{ key: CoreSetting.RequireApproval, value: true }],
		});
		await seedHacker(hackkit, "hacker-1");
		await seedHacker(hackkit, "hacker-2");
		await seedHacker(hackkit, "hacker-3", "beta");

		await hackkit.users.approveUser({
			actorAuthId: "owner-auth",
			targetAuthId: "hacker-1",
			approved: true,
		});
		await hackkit.users.approveUser({
			actorAuthId: "owner-auth",
			targetAuthId: "hacker-2",
			approved: true,
		});
		await hackkit.users.approveUser({
			actorAuthId: "owner-auth",
			targetAuthId: "hacker-3",
			approved: true,
		});

		await expect(hackkit.hackers.getHacker("hacker-1")).resolves.toMatchObject({
			group: "alpha",
		});
		await expect(hackkit.hackers.getHacker("hacker-2")).resolves.toMatchObject({
			group: "alpha",
		});
		await expect(hackkit.hackers.getHacker("hacker-3")).resolves.toMatchObject({
			group: "beta",
		});
		expect(hackkit.groups.listGroups()).toHaveLength(2);
	});
});
