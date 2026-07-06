import { describe, expect, it } from "vitest";
import {
	CoreNotificationKind,
	createHackkit,
	createInMemoryDatabaseAdapterFromStorage,
	createPluginRegistry,
	type NotificationChannel,
} from "../index";

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
	return createHackkit({ database: db, clock: now, id });
}

describe("notifications", () => {
	it("queues typed core intents and reuses idempotent requests", async () => {
		const hackkit = createTestHackkit();

		const intent = await hackkit.notifications.queueIntent({
			kind: CoreNotificationKind.UserApproved,
			recipientAuthId: "hacker-auth",
			payload: {
				authId: "hacker-auth",
				approvedByAuthId: "admin-auth",
			},
			idempotencyKey: "approval:hacker-auth",
		});
		const duplicate = await hackkit.notifications.queueIntent({
			kind: CoreNotificationKind.UserApproved,
			recipientAuthId: "hacker-auth",
			payload: { authId: "hacker-auth" },
			idempotencyKey: "approval:hacker-auth",
		});

		expect(duplicate.id).toBe(intent.id);
		expect(intent.status).toBe("pending");
		await expect(
			hackkit.notifications.queueIntent({
				kind: CoreNotificationKind.RsvpWaitlisted,
				payload: { position: 1 },
			}),
		).rejects.toThrow();
	});

	it("records one delivery attempt per channel and updates intent status", async () => {
		const hackkit = createTestHackkit();
		const intent = await hackkit.notifications.queueIntent({
			kind: "sample.custom",
			payload: { authId: "hacker-auth" },
		});
		const channel: NotificationChannel = {
			id: "email",
			async deliver(deliveryIntent) {
				expect(deliveryIntent.id).toBe(intent.id);
				return {
					status: "delivered",
					provider: "test",
					recipient: "hacker@example.com",
					externalId: "message-1",
				};
			},
		};

		const result = await hackkit.notifications.deliverPending({
			channels: [channel],
		});

		expect(result.intentsProcessed).toBe(1);
		expect(result.attempts).toHaveLength(1);
		expect(result.attempts[0]).toMatchObject({
			channel: "email",
			status: "delivered",
			externalId: "message-1",
		});
		await expect(hackkit.notifications.getIntent(intent.id)).resolves.toMatchObject({
			status: "delivered",
		});
		await expect(
			hackkit.notifications.listDeliveryAttempts(intent.id),
		).resolves.toHaveLength(1);
	});
});
