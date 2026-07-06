import { describe, expect, it } from "vitest";
import {
	CoreNotificationKind,
	createHackkit,
	createInMemoryDatabaseAdapterFromStorage,
	createPluginRegistry,
	type HackKitPlugin,
} from "@hackkit/core";
import {
	emailNotificationsPlugin,
	type EmailMessage,
	type EmailNotificationsApi,
} from "../index";

function createTestHackkit() {
	const sent: EmailMessage[] = [];
	const plugin = emailNotificationsPlugin({
		from: "HackKit <hello@example.com>",
		appName: "HackKit Test",
		baseUrl: "https://example.com",
		provider: {
			id: "test",
			async send(message) {
				sent.push(message);
				return { id: "email-1" };
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
	});
	return {
		hackkit,
		notificationsEmail:
			hackkit.plugins.notificationsEmail as unknown as EmailNotificationsApi,
		sent,
	};
}

describe("email notifications plugin", () => {
	it("delivers pending intents to resolved user email addresses", async () => {
		const { hackkit, notificationsEmail, sent } = createTestHackkit();
		await hackkit.users.ensureUser({
			authId: "hacker-auth",
			email: "hacker@example.com",
			firstName: "Hack",
			lastName: "Er",
		});
		const intent = await hackkit.notifications.queueIntent({
			kind: CoreNotificationKind.UserApproved,
			recipientAuthId: "hacker-auth",
			payload: { authId: "hacker-auth" },
		});

		const result = await notificationsEmail.deliverPending();

		expect(result.intentsProcessed).toBe(1);
		expect(sent).toHaveLength(1);
		expect(sent[0]).toMatchObject({
			to: "Hack Er <hacker@example.com>",
			subject: "You're approved for HackKit Test",
		});
		await expect(
			hackkit.notifications.listDeliveryAttempts(intent.id),
		).resolves.toMatchObject([
			expect.objectContaining({
				channel: "email",
				provider: "test",
				status: "delivered",
				recipient: "hacker@example.com",
			}),
		]);
	});
});
