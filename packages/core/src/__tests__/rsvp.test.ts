import { describe, expect, it } from "vitest";
import {
	CoreNotificationKind,
	CoreSetting,
	createHackkit,
	createInMemoryDatabaseAdapterFromStorage,
	createPluginRegistry,
} from "../index";

function createTestHackkit() {
	const registry = createPluginRegistry();
	let timestamp = 0;
	const now = () => new Date(`2026-05-24T12:00:${String(timestamp++).padStart(2, "0")}.000Z`);
	let counter = 0;
	const id = () => `id-${++counter}`;
	const db = createInMemoryDatabaseAdapterFromStorage(
		registry.storage,
		now,
		id,
	);
	return createHackkit({ database: db, clock: now, id });
}

async function seedOwner(hackkit: ReturnType<typeof createHackkit>) {
	await hackkit.users.ensureUser({
		authId: "admin-auth",
		email: "admin@example.com",
		firstName: "Ad",
		lastName: "Min",
	});
	await hackkit.roles.bootstrapOwner({ authId: "admin-auth" });
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

async function seedApprovedHacker(
	hackkit: ReturnType<typeof createHackkit>,
	authId: string,
) {
	await hackkit.users.ensureUser({
		authId,
		email: `${authId}@example.com`,
		firstName: authId,
		lastName: "Hacker",
	});
	await hackkit.userData.completeUserData({
		authId,
		age: 20,
		gender: "prefer_not_to_answer",
		race: "prefer_not_to_answer",
		ethnicity: "prefer_not_to_answer",
		shirtSize: "m",
		dietaryRestrictions: [],
		hasAcceptedMLHCodeOfConduct: true,
		hasSharedDataWithMLH: true,
		isEmailable: true,
	});
	await hackkit.hackers.registerHacker({
		authId,
		university: "Test U",
		major: "CS",
		levelOfStudy: "undergraduate",
		hackathonsAttended: 0,
		softwareExperience: "intermediate",
	});
}

describe("RSVP", () => {
	it("requires RSVPs to be open and limited to approved hackers", async () => {
		const hackkit = createTestHackkit();
		await seedOwner(hackkit);
		await seedApprovedHacker(hackkit, "hacker-auth");

		await expect(
			hackkit.rsvp.confirm({ authId: "hacker-auth" }),
		).rejects.toMatchObject({ code: "INVALID_OPERATION" });

		await setSetting(hackkit, CoreSetting.RsvpOpen, true);
		await hackkit.users.ensureUser({
			authId: "unregistered-auth",
			email: "unregistered@example.com",
			firstName: "Unregistered",
			lastName: "User",
		});
		await expect(
			hackkit.rsvp.confirm({ authId: "unregistered-auth" }),
		).rejects.toMatchObject({ code: "INVALID_OPERATION" });

		await expect(hackkit.rsvp.confirm({ authId: "hacker-auth" })).resolves.toMatchObject({
			status: "confirmed",
		});
	});

	it("places over-limit hackers on an ordered waitlist and queues intents", async () => {
		const hackkit = createTestHackkit();
		await seedOwner(hackkit);
		await setSetting(hackkit, CoreSetting.RsvpOpen, true);
		await setSetting(hackkit, CoreSetting.RsvpLimit, 1);
		await setSetting(hackkit, CoreSetting.RsvpWaitlistEnabled, true);
		await seedApprovedHacker(hackkit, "first-auth");
		await seedApprovedHacker(hackkit, "second-auth");

		await expect(hackkit.rsvp.confirm({ authId: "first-auth" })).resolves.toMatchObject({
			status: "confirmed",
		});
		await expect(hackkit.rsvp.confirm({ authId: "second-auth" })).resolves.toMatchObject({
			status: "waitlisted",
			waitlistPosition: 1,
		});

		await expect(hackkit.rsvp.getSummary()).resolves.toMatchObject({
			confirmedCount: 1,
			waitlistedCount: 1,
			availableSpots: 0,
		});
		await expect(
			hackkit.notifications.listIntents({
				kind: CoreNotificationKind.RsvpConfirmed,
			}),
		).resolves.toHaveLength(1);
		await expect(
			hackkit.notifications.listIntents({
				kind: CoreNotificationKind.RsvpWaitlisted,
			}),
		).resolves.toHaveLength(1);
	});

	it("lets admins cancel and promote waitlisted RSVPs", async () => {
		const hackkit = createTestHackkit();
		await seedOwner(hackkit);
		await setSetting(hackkit, CoreSetting.RsvpOpen, true);
		await setSetting(hackkit, CoreSetting.RsvpLimit, 1);
		await setSetting(hackkit, CoreSetting.RsvpWaitlistEnabled, true);
		await seedApprovedHacker(hackkit, "first-auth");
		await seedApprovedHacker(hackkit, "second-auth");
		await hackkit.rsvp.confirm({ authId: "first-auth" });
		await hackkit.rsvp.confirm({ authId: "second-auth" });

		await expect(
			hackkit.rsvp.promote({ actorAuthId: "admin-auth" }),
		).rejects.toMatchObject({ code: "INVALID_OPERATION" });

		await expect(
			hackkit.rsvp.cancel({
				actorAuthId: "admin-auth",
				targetAuthId: "first-auth",
			}),
		).resolves.toMatchObject({ status: "cancelled" });
		await expect(
			hackkit.rsvp.promote({ actorAuthId: "admin-auth" }),
		).resolves.toMatchObject({
			authId: "second-auth",
			status: "confirmed",
			promotedByAuthId: "admin-auth",
		});
		await expect(
			hackkit.notifications.listIntents({
				kind: CoreNotificationKind.RsvpPromoted,
			}),
		).resolves.toHaveLength(1);
	});
});
