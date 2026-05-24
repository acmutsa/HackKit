import { describe, expect, it } from "vitest";
import { createPluginRegistry } from "../plugins";
import { createInMemoryDatabaseAdapterFromStorage } from "../adapters/db/memory";
import { createHackkit } from "../hackkit";
import { CorePermission } from "../permissions";

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

async function seedVolunteer(hackkit: ReturnType<typeof createHackkit>) {
	await hackkit.users.ensureUser({
		authId: "volunteer-auth",
		email: "volunteer@example.com",
		firstName: "Vol",
		lastName: "Unteer",
	});
	const ownerRole = await hackkit.roles.bootstrapOwner({
		authId: "volunteer-auth",
	});
	await hackkit.roles.assignRoleToUser({
		actorAuthId: "volunteer-auth",
		targetAuthId: "volunteer-auth",
		roleId: ownerRole.id,
	});
	return ownerRole;
}

describe("hackkit access control and check-in", () => {
	it("records hackathon check-in once", async () => {
		const hackkit = createTestHackkit();
		await seedVolunteer(hackkit);
		await hackkit.users.ensureUser({
			authId: "participant-auth",
			email: "p@example.com",
			firstName: "Pat",
			lastName: "Participant",
		});

		const checkedIn = await hackkit.users.checkIn({
			actorAuthId: "volunteer-auth",
			targetAuthId: "participant-auth",
		});
		expect(checkedIn.checkedInAt).toBeTruthy();

		await expect(
			hackkit.users.checkIn({
				actorAuthId: "volunteer-auth",
				targetAuthId: "participant-auth",
			}),
		).rejects.toMatchObject({ code: "INVALID_OPERATION" });
	});

	it("records event scans as separate rows", async () => {
		const hackkit = createTestHackkit();
		await seedVolunteer(hackkit);
		await hackkit.users.ensureUser({
			authId: "participant-auth",
			email: "p@example.com",
			firstName: "Pat",
			lastName: "Participant",
		});

		const event = await hackkit.events.createEvent({
			actorAuthId: "volunteer-auth",
			title: "Lunch",
			description: "Food",
			startTime: new Date("2026-05-24T13:00:00.000Z"),
			endTime: new Date("2026-05-24T14:00:00.000Z"),
			location: "Hall",
			type: "meal",
			hidden: false,
		});

		const first = await hackkit.events.recordEventScan({
			actorAuthId: "volunteer-auth",
			eventId: event.id,
			targetAuthId: "participant-auth",
		});
		expect(first.hadPriorScans).toBe(false);

		const second = await hackkit.events.recordEventScan({
			actorAuthId: "volunteer-auth",
			eventId: event.id,
			targetAuthId: "participant-auth",
		});
		expect(second.hadPriorScans).toBe(true);
		expect(second.priorScans).toHaveLength(1);
	});

	it("enforces permissions through accessControl", async () => {
		const hackkit = createTestHackkit();
		await hackkit.users.ensureUser({
			authId: "no-role-auth",
			email: "n@example.com",
			firstName: "No",
			lastName: "Role",
		});

		await expect(
			hackkit.accessControl.requirePermission(
				"no-role-auth",
				CorePermission.UsersCheckIn,
			),
		).rejects.toMatchObject({ code: "FORBIDDEN" });
	});
});
