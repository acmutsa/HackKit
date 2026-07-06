import { describe, expect, it } from "vitest";
import { createInMemoryDatabaseAdapterFromStorage } from "../adapters/db/memory";
import { createHackkit } from "../hackkit";
import { createPluginRegistry } from "../plugins";

function createTestHackkit() {
	const registry = createPluginRegistry();
	const now = () => new Date("2026-05-24T12:00:00.000Z");
	const id = () => "id";
	const db = createInMemoryDatabaseAdapterFromStorage(
		registry.storage,
		now,
		id,
	);
	return createHackkit({ database: db, clock: now, id });
}

async function seedUser(hackkit: ReturnType<typeof createHackkit>) {
	await hackkit.users.ensureUser({
		authId: "hacker-auth",
		email: "hacker@example.com",
		firstName: "Hack",
		lastName: "Er",
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
		major: "Computer Science",
		levelOfStudy: "Senior",
		hackathonsAttended: 2,
		softwareExperience: "Advanced",
		githubUrl: "https://github.com/hacker",
	});
}

describe("public profiles", () => {
	it("returns Core-owned profile fields by HackTag when searchable", async () => {
		const hackkit = createTestHackkit();
		await seedUser(hackkit);

		await hackkit.users.updateProfile({
			authId: "hacker-auth",
			hackTag: "HackerOne",
			bio: "I like building useful things.",
			pronouns: "they/them",
			skills: ["TypeScript", "Design"],
			discordDisplayHandle: "hacker",
			profilePhotoUrl: "/api/files/view?key=profile-photos%2Favatar.png",
			isProfileSearchable: true,
		});

		const profile = await hackkit.users.getPublicProfileByHackTag("hackerone");

		expect(profile?.user.hackTag).toBe("hackerone");
		expect(profile?.user.skills).toEqual(["typescript", "design"]);
		expect(profile?.user.bio).toBe("I like building useful things.");
		expect(profile?.hacker?.major).toBe("Computer Science");
	});

	it("hides public profiles when searchability is disabled", async () => {
		const hackkit = createTestHackkit();
		await seedUser(hackkit);
		await hackkit.users.updateProfile({
			authId: "hacker-auth",
			hackTag: "hackerone",
			isProfileSearchable: false,
		});

		await expect(
			hackkit.users.getPublicProfileByHackTag("hackerone"),
		).resolves.toBeNull();
	});
});
