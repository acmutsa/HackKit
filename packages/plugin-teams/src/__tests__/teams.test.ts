import { describe, expect, it } from "vitest";
import {
	createHackkit,
	createInMemoryDatabaseAdapterFromStorage,
	createPluginRegistry,
	type HackKitPlugin,
} from "@hackkit/core";
import type { TeamsApi } from "../api";
import { teamsPlugin } from "../index";

function createTeamsHackkit() {
	const plugin = teamsPlugin();
	const registry = createPluginRegistry([plugin as unknown as HackKitPlugin]);
	const now = () => new Date("2026-05-24T12:00:00.000Z");
	let counter = 0;
	const id = () => `id-${++counter}`;
	const db = createInMemoryDatabaseAdapterFromStorage(
		registry.storage,
		now,
		id,
	);
	const hackkit = createHackkit({
		database: db,
		plugins: [plugin as unknown as HackKitPlugin],
		clock: now,
		id,
	});
	return { hackkit, teams: hackkit.plugins.teams as unknown as TeamsApi };
}

async function seedUserWithHackTag(
	hackkit: ReturnType<typeof createHackkit>,
	authId: string,
	hackTag: string,
) {
	await hackkit.users.ensureUser({
		authId,
		email: `${authId}@example.com`,
		firstName: "Test",
		lastName: "User",
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
	await hackkit.users.claimHackTag({ authId, hackTag });
}

async function seedHacker(
	hackkit: ReturnType<typeof createHackkit>,
	authId: string,
	hackTag?: string,
) {
	await hackkit.users.ensureUser({
		authId,
		email: `${authId}@example.com`,
		firstName: "Test",
		lastName: "User",
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
		levelOfStudy: "undergraduate",
		hackathonsAttended: 1,
		softwareExperience: "intermediate",
	});
	if (hackTag) {
		await hackkit.users.claimHackTag({ authId, hackTag });
	}
}

describe("teams plugin", () => {
	it("creates a team and adds the owner as a member", async () => {
		const { hackkit, teams } = createTeamsHackkit();
		await seedHacker(hackkit, "owner-auth", "owner");

		const team = await teams.createTeam({
			actorAuthId: "owner-auth",
			name: "Hackers United",
			tag: "hackers-united",
		});

		expect(team.name).toBe("Hackers United");
		expect(team.members).toHaveLength(1);
		expect(team.members[0]?.authId).toBe("owner-auth");
	});

	it("accepts an invite and enforces one team per hacker", async () => {
		const { hackkit, teams } = createTeamsHackkit();
		await seedHacker(hackkit, "owner-auth", "owner");
		await seedHacker(hackkit, "member-auth", "member");

		const team = await teams.createTeam({
			actorAuthId: "owner-auth",
			name: "Team Alpha",
			tag: "alpha",
		});
		const invite = await teams.inviteToTeam({
			actorAuthId: "owner-auth",
			teamId: team.id,
			hackTag: "member",
		});

		await teams.respondToInvite({
			actorAuthId: "member-auth",
			inviteId: invite.id,
			accept: true,
		});

		const memberTeam = await teams.getTeamForAuthId("member-auth");
		expect(memberTeam?.id).toBe(team.id);

		await expect(
			teams.createTeam({
				actorAuthId: "member-auth",
				name: "Other Team",
				tag: "other",
			}),
		).rejects.toMatchObject({ code: "CONFLICT" });
	});

	it("allows inviting a user before hacker registration", async () => {
		const { hackkit, teams } = createTeamsHackkit();
		await seedHacker(hackkit, "owner-auth", "owner");
		await seedUserWithHackTag(hackkit, "pending-auth", "pending");

		const team = await teams.createTeam({
			actorAuthId: "owner-auth",
			name: "Team Beta",
			tag: "beta",
		});

		const invite = await teams.inviteToTeam({
			actorAuthId: "owner-auth",
			teamId: team.id,
			hackTag: "pending",
		});
		expect(invite.status).toBe("pending");

		await expect(
			teams.respondToInvite({
				actorAuthId: "pending-auth",
				inviteId: invite.id,
				accept: true,
			}),
		).rejects.toMatchObject({
			message: "Complete hacker registration before accepting a team invite.",
		});

		await seedHacker(hackkit, "pending-auth");
		const joined = await teams.respondToInvite({
			actorAuthId: "pending-auth",
			inviteId: invite.id,
			accept: true,
		});
		expect(joined).toMatchObject({ id: team.id });
	});
});
