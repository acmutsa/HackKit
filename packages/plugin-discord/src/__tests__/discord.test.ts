import { describe, expect, it } from "vitest";
import {
	createHackkit,
	createInMemoryDatabaseAdapterFromStorage,
	createPluginRegistry,
	type HackKitPlugin,
} from "@hackkit/core";
import {
	discordPlugin,
	type DiscordApi,
	type DiscordRoleSyncInput,
} from "../index";

function createDiscordHackkit() {
	const syncInputs: DiscordRoleSyncInput[] = [];
	const plugin = discordPlugin({
		guildId: "guild-1",
		verificationBaseUrl: "https://hackkit.test",
		participantRole: { id: "participant-role" },
		roleSyncProvider: {
			async syncRoles(input) {
				syncInputs.push(input);
			},
		},
	});
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
		groups: [{ id: "alpha", label: "Alpha", discordRoleId: "alpha-role" }],
	});
	return {
		hackkit,
		discord: hackkit.plugins.discord as unknown as DiscordApi,
		syncInputs,
	};
}

async function seedApprovedHacker(hackkit: ReturnType<typeof createHackkit>) {
	await hackkit.users.ensureUser({
		authId: "hacker-auth",
		email: "hacker@example.com",
		firstName: "Hazel",
		lastName: "Hacker",
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
	await hackkit.hackers.registerHacker({
		authId: "hacker-auth",
		university: "Test U",
		major: "CS",
		levelOfStudy: "Undergraduate",
		hackathonsAttended: 1,
		softwareExperience: "Intermediate",
		group: "alpha",
	});
}

describe("discord plugin", () => {
	it("links a pending verification and syncs participant and group roles", async () => {
		const { hackkit, discord, syncInputs } = createDiscordHackkit();
		await seedApprovedHacker(hackkit);

		const verification = await discord.createVerification({
			code: "code-1",
			discordUserId: "discord-1",
			username: "hacker",
		});
		expect(verification.verificationUrl).toBe(
			"https://hackkit.test/discord/verify?code=code-1",
		);

		const member = await discord.confirmVerification({
			authId: "hacker-auth",
			code: "code-1",
		});

		expect(member).toMatchObject({
			authId: "hacker-auth",
			discordUserId: "discord-1",
			username: "hacker",
		});
		expect(syncInputs).toHaveLength(1);
		expect(syncInputs[0]).toMatchObject({
			authId: "hacker-auth",
			discordUserId: "discord-1",
			guildId: "guild-1",
			roleIds: ["participant-role", "alpha-role"],
			nickname: "Hazel Hacker",
		});
		await expect(discord.getVerification("code-1")).resolves.toMatchObject({
			status: "accepted",
			authId: "hacker-auth",
		});
	});
});
