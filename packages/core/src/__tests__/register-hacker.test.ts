import { describe, expect, it } from "vitest";
import { createPluginRegistry } from "../plugins";
import { createInMemoryDatabaseAdapterFromStorage } from "../adapters/db/memory";
import { createHackkit } from "../hackkit";
import { CorePermission } from "../permissions";

function createTestHackkit(
	options: {
		requireApproval?: boolean;
		defaultCompetitorRoleId?: string;
	} = {},
) {
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
		requireApproval: options.requireApproval,
		defaultCompetitorRoleId: options.defaultCompetitorRoleId,
	});
}

async function seedParticipantRole(
	hackkit: ReturnType<typeof createHackkit>,
	roleId = "core.participant",
) {
	return hackkit.roles.createRole({
		actorAuthId: "admin-auth",
		id: roleId,
		name: "Participant",
		position: 10,
		permissions: [CorePermission.HackersRegister],
	});
}

async function seedUserWithData(hackkit: ReturnType<typeof createHackkit>) {
	await hackkit.users.ensureUser({
		authId: "hacker-auth",
		email: "hacker@example.com",
		firstName: "Hack",
		lastName: "Er",
	});
	await hackkit.users.claimHackTag({
		authId: "hacker-auth",
		hackTag: "hacker1",
	});
	await hackkit.userData.completeUserData({
		authId: "hacker-auth",
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
}

describe("registerHacker onboarding side effects", () => {
	it("assigns default role and auto-approves when requireApproval is false", async () => {
		const hackkit = createTestHackkit({
			requireApproval: false,
			defaultCompetitorRoleId: "core.participant",
		});
		await hackkit.users.ensureUser({
			authId: "admin-auth",
			email: "admin@example.com",
			firstName: "Ad",
			lastName: "Min",
		});
		await hackkit.roles.bootstrapOwner({ authId: "admin-auth" });
		await seedParticipantRole(hackkit);
		await seedUserWithData(hackkit);

		await hackkit.hackers.registerHacker({
			authId: "hacker-auth",
			university: "Test U",
			major: "CS",
			levelOfStudy: "undergraduate",
			hackathonsAttended: 0,
			softwareExperience: "intermediate",
		});

		const user = await hackkit.users.getUser("hacker-auth");
		expect(user?.roleId).toBe("core.participant");
		expect(user?.isApproved).toBe(true);
	});

	it("assigns default role but leaves user unapproved when requireApproval is true", async () => {
		const hackkit = createTestHackkit({
			requireApproval: true,
			defaultCompetitorRoleId: "core.participant",
		});
		await hackkit.users.ensureUser({
			authId: "admin-auth",
			email: "admin@example.com",
			firstName: "Ad",
			lastName: "Min",
		});
		await hackkit.roles.bootstrapOwner({ authId: "admin-auth" });
		await seedParticipantRole(hackkit);
		await seedUserWithData(hackkit);

		await hackkit.hackers.registerHacker({
			authId: "hacker-auth",
			university: "Test U",
			major: "CS",
			levelOfStudy: "undergraduate",
			hackathonsAttended: 0,
			softwareExperience: "intermediate",
		});

		const user = await hackkit.users.getUser("hacker-auth");
		expect(user?.roleId).toBe("core.participant");
		expect(user?.isApproved).toBe(false);
	});
});
