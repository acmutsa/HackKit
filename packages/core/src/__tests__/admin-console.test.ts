import { describe, expect, it } from "vitest";
import { createInMemoryDatabaseAdapterFromStorage } from "../adapters/db/memory";
import { createHackkit } from "../hackkit";
import { CorePermission } from "../permissions";
import { createPluginRegistry } from "../plugins";

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
	});
}

async function seedOwner(hackkit: ReturnType<typeof createHackkit>) {
	await hackkit.users.ensureUser({
		authId: "owner-auth",
		email: "owner@example.com",
		firstName: "Olive",
		lastName: "Owner",
	});
	return hackkit.roles.bootstrapOwner({ authId: "owner-auth" });
}

describe("admin console reads", () => {
	it("hydrates admin user records and exports flattened rows", async () => {
		const hackkit = createTestHackkit();
		const ownerRole = await seedOwner(hackkit);
		const hackerRole = await hackkit.roles.createRole({
			actorAuthId: "owner-auth",
			id: "hacker",
			name: "Hacker",
			position: ownerRole.position + 1,
			permissions: [CorePermission.HackersRegister],
		});

		await hackkit.users.ensureUser({
			authId: "participant-auth",
			email: "participant@example.com",
			firstName: "Pat",
			lastName: "Participant",
		});
		await hackkit.userData.completeUserData({
			authId: "participant-auth",
			age: 20,
			gender: "prefer_not_to_answer",
			race: "prefer_not_to_answer",
			ethnicity: "prefer_not_to_answer",
			shirtSize: "m",
			dietaryRestrictions: ["vegetarian"],
			hasAcceptedMLHCodeOfConduct: true,
			hasSharedDataWithMLH: true,
			isEmailable: true,
		});
		await hackkit.roles.assignRoleToUser({
			actorAuthId: "owner-auth",
			targetAuthId: "participant-auth",
			roleId: hackerRole.id,
		});
		await hackkit.users.claimHackTag({
			authId: "participant-auth",
			hackTag: "Pat",
		});
		await hackkit.hackers.registerHacker({
			authId: "participant-auth",
			university: "Hack University",
			major: "Computer Science",
			levelOfStudy: "Undergraduate",
			hackathonsAttended: 1,
			softwareExperience: "Intermediate",
		});
		await hackkit.users.approveUser({
			actorAuthId: "owner-auth",
			targetAuthId: "participant-auth",
			approved: true,
		});

		const byTag = await hackkit.admin.getUserByHackTag({
			actorAuthId: "owner-auth",
			hackTag: "PAT",
		});
		expect(byTag?.user.authId).toBe("participant-auth");
		expect(byTag?.role?.name).toBe("Hacker");
		expect(byTag?.hacker?.university).toBe("Hack University");

		const overview = await hackkit.admin.getOverview({
			actorAuthId: "owner-auth",
		});
		expect(overview.totalUsers).toBe(2);
		expect(overview.totalHackers).toBe(1);
		expect(overview.approvedUsers).toBe(1);
		expect(overview.recentUsers).toHaveLength(2);

		const rows = await hackkit.admin.exportUsers({
			actorAuthId: "owner-auth",
		});
		const participantRow = rows.find(
			(row) => row.authId === "participant-auth",
		);
		expect(participantRow).toMatchObject({
			email: "participant@example.com",
			hackTag: "pat",
			role: "Hacker",
			isApproved: true,
			university: "Hack University",
			dietaryRestrictions: "vegetarian",
		});
	});
});
