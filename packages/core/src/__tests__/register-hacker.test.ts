import { describe, expect, it } from "vitest";
import { createPluginRegistry } from "../plugins";
import { createInMemoryDatabaseAdapterFromStorage } from "../adapters/db/memory";
import { createHackkit } from "../hackkit";
import { CorePermission } from "../permissions";
import { CoreSetting } from "../settings";

function createTestHackkit(
	options: {
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

async function setRequireApproval(
	hackkit: ReturnType<typeof createHackkit>,
	requireApproval: boolean,
) {
	await setSetting(hackkit, CoreSetting.RequireApproval, requireApproval);
}

async function setSetting(
	hackkit: ReturnType<typeof createHackkit>,
	key: CoreSetting,
	value: boolean | number,
) {
	await hackkit.settings.set({
		actorAuthId: "admin-auth",
		key,
		value,
	});
}

async function seedUserWithData(
	hackkit: ReturnType<typeof createHackkit>,
	authId = "hacker-auth",
	hackTag = "hacker1",
) {
	await hackkit.users.ensureUser({
		authId,
		email: `${authId}@example.com`,
		firstName: "Hack",
		lastName: "Er",
	});
	await hackkit.users.claimHackTag({
		authId,
		hackTag,
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
}

async function registerHacker(
	hackkit: ReturnType<typeof createHackkit>,
	authId = "hacker-auth",
) {
	return hackkit.hackers.registerHacker({
		authId,
		university: "Test U",
		major: "CS",
		levelOfStudy: "undergraduate",
		hackathonsAttended: 0,
		softwareExperience: "intermediate",
	});
}

describe("registerHacker onboarding side effects", () => {
	it("assigns default role and auto-approves when requireApproval is false", async () => {
		const hackkit = createTestHackkit({
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

	it("persists app-relative stored file references as resumeUrl", async () => {
		const hackkit = createTestHackkit({
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

		const resumeUrl = "/api/files/view?key=resumes%2Fabc.pdf";
		await hackkit.hackers.registerHacker({
			authId: "hacker-auth",
			university: "Test U",
			major: "CS",
			levelOfStudy: "undergraduate",
			hackathonsAttended: 0,
			softwareExperience: "intermediate",
			resumeUrl,
		});

		const hacker = await hackkit.hackers.getHacker("hacker-auth");
		expect(hacker?.resumeUrl).toBe(resumeUrl);
	});

	it("assigns default role but leaves user unapproved when requireApproval is true", async () => {
		const hackkit = createTestHackkit({
			defaultCompetitorRoleId: "core.participant",
		});
		await hackkit.users.ensureUser({
			authId: "admin-auth",
			email: "admin@example.com",
			firstName: "Ad",
			lastName: "Min",
		});
		await hackkit.roles.bootstrapOwner({ authId: "admin-auth" });
		await setRequireApproval(hackkit, true);
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

	it("blocks first-time Hacker Registration when registration is closed but allows updates", async () => {
		const hackkit = createTestHackkit();
		await hackkit.users.ensureUser({
			authId: "admin-auth",
			email: "admin@example.com",
			firstName: "Ad",
			lastName: "Min",
		});
		await hackkit.roles.bootstrapOwner({ authId: "admin-auth" });
		await seedUserWithData(hackkit);

		await setSetting(hackkit, CoreSetting.RegistrationOpen, false);
		await expect(registerHacker(hackkit)).rejects.toMatchObject({
			code: "INVALID_OPERATION",
		});

		await setSetting(hackkit, CoreSetting.RegistrationOpen, true);
		await registerHacker(hackkit);
		await setSetting(hackkit, CoreSetting.RegistrationOpen, false);
		await hackkit.hackers.registerHacker({
			authId: "hacker-auth",
			university: "Updated U",
			major: "CS",
			levelOfStudy: "undergraduate",
			hackathonsAttended: 1,
			softwareExperience: "advanced",
		});

		const hacker = await hackkit.hackers.getHacker("hacker-auth");
		expect(hacker?.university).toBe("Updated U");
	});

	it("blocks new Hacker Registration after maximum registrations is reached", async () => {
		const hackkit = createTestHackkit();
		await hackkit.users.ensureUser({
			authId: "admin-auth",
			email: "admin@example.com",
			firstName: "Ad",
			lastName: "Min",
		});
		await hackkit.roles.bootstrapOwner({ authId: "admin-auth" });
		await setSetting(hackkit, CoreSetting.MaximumRegistrations, 1);
		await seedUserWithData(hackkit, "first-auth", "first");
		await seedUserWithData(hackkit, "second-auth", "second");

		await registerHacker(hackkit, "first-auth");
		await expect(registerHacker(hackkit, "second-auth")).rejects.toMatchObject({
			code: "INVALID_OPERATION",
		});
	});

	it("blocks auto-approval when Hackathon Capacity is reached", async () => {
		const hackkit = createTestHackkit();
		await hackkit.users.ensureUser({
			authId: "admin-auth",
			email: "admin@example.com",
			firstName: "Ad",
			lastName: "Min",
		});
		await hackkit.roles.bootstrapOwner({ authId: "admin-auth" });
		await setSetting(hackkit, CoreSetting.HackathonCapacity, 1);
		await seedUserWithData(hackkit, "first-auth", "first");
		await seedUserWithData(hackkit, "second-auth", "second");

		await registerHacker(hackkit, "first-auth");
		await expect(registerHacker(hackkit, "second-auth")).rejects.toMatchObject({
			code: "INVALID_OPERATION",
		});
	});

	it("blocks manual Organiser Approval when Hackathon Capacity is reached", async () => {
		const hackkit = createTestHackkit();
		await hackkit.users.ensureUser({
			authId: "admin-auth",
			email: "admin@example.com",
			firstName: "Ad",
			lastName: "Min",
		});
		await hackkit.roles.bootstrapOwner({ authId: "admin-auth" });
		await setRequireApproval(hackkit, true);
		await setSetting(hackkit, CoreSetting.HackathonCapacity, 1);
		await seedUserWithData(hackkit, "first-auth", "first");
		await seedUserWithData(hackkit, "second-auth", "second");
		await registerHacker(hackkit, "first-auth");
		await registerHacker(hackkit, "second-auth");

		await hackkit.users.approveUser({
			actorAuthId: "admin-auth",
			targetAuthId: "first-auth",
			approved: true,
		});

		await expect(
			hackkit.users.approveUser({
				actorAuthId: "admin-auth",
				targetAuthId: "second-auth",
				approved: true,
			}),
		).rejects.toMatchObject({ code: "INVALID_OPERATION" });
	});
});
