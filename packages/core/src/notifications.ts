import { z } from "zod";
import type { DatabaseAdapter } from "./database";
import { HackKitError, parseInput } from "./errors";
import { coreModels } from "./models";
import type {
	AuthId,
	NotificationDeliveryAttempt,
	NotificationIntent,
} from "./types";

export const CoreNotificationKind = {
	UserApproved: "core.user.approved",
	UserUnapproved: "core.user.unapproved",
	RsvpConfirmed: "core.rsvp.confirmed",
	RsvpWaitlisted: "core.rsvp.waitlisted",
	RsvpPromoted: "core.rsvp.promoted",
	AuthAccount: "core.auth.account",
} as const;

export type CoreNotificationKind =
	(typeof CoreNotificationKind)[keyof typeof CoreNotificationKind];
export type NotificationKind = CoreNotificationKind | (string & {});
export type NotificationIntentStatus = NotificationIntent["status"];
export type NotificationDeliveryAttemptStatus =
	NotificationDeliveryAttempt["status"];

const notificationKindSchema = z
	.string()
	.min(1)
	.regex(/^[a-z0-9_-]+\.[a-z0-9_.-]+$/);

const baseRecipientPayloadSchema = z.object({
	authId: z.string().min(1),
});

export const coreNotificationPayloadSchemas = {
	[CoreNotificationKind.UserApproved]: baseRecipientPayloadSchema.extend({
		approvedByAuthId: z.string().min(1).optional(),
	}),
	[CoreNotificationKind.UserUnapproved]: baseRecipientPayloadSchema.extend({
		unapprovedByAuthId: z.string().min(1).optional(),
	}),
	[CoreNotificationKind.RsvpConfirmed]: baseRecipientPayloadSchema,
	[CoreNotificationKind.RsvpWaitlisted]: baseRecipientPayloadSchema.extend({
		position: z.number().int().positive().optional(),
	}),
	[CoreNotificationKind.RsvpPromoted]: baseRecipientPayloadSchema,
	[CoreNotificationKind.AuthAccount]: baseRecipientPayloadSchema.extend({
		purpose: z.enum(["verification", "password-reset", "magic-link"]),
		url: z.string().url().optional(),
	}),
} satisfies Record<CoreNotificationKind, z.ZodType<Record<string, unknown>>>;

export type CoreNotificationPayloadMap = {
	[TKind in CoreNotificationKind]: z.infer<
		(typeof coreNotificationPayloadSchemas)[TKind]
	>;
};

export type NotificationPayload =
	| CoreNotificationPayloadMap[CoreNotificationKind]
	| Record<string, unknown>;

export type QueueNotificationIntentInput<
	TKind extends NotificationKind = NotificationKind,
> = {
	kind: TKind;
	recipientAuthId?: AuthId;
	payload?: TKind extends CoreNotificationKind
		? CoreNotificationPayloadMap[TKind]
		: Record<string, unknown>;
	idempotencyKey?: string;
};

const queueNotificationIntentSchema = z.object({
	kind: notificationKindSchema,
	recipientAuthId: z.string().min(1).optional(),
	payload: z.record(z.unknown()).default({}),
	idempotencyKey: z.string().min(1).optional(),
});

const listNotificationIntentsSchema = z
	.object({
		status: z
			.enum(["pending", "processing", "delivered", "failed", "skipped"] as const)
			.optional(),
		kind: notificationKindSchema.optional(),
		recipientAuthId: z.string().min(1).optional(),
		limit: z.number().int().positive().max(100).optional(),
	})
	.optional();

const recordDeliveryAttemptSchema = z.object({
	intentId: z.string().min(1),
	channel: z.string().min(1),
	provider: z.string().min(1).optional(),
	status: z.enum(["delivered", "failed", "skipped"] as const),
	recipient: z.string().min(1).optional(),
	externalId: z.string().min(1).optional(),
	error: z.string().min(1).optional(),
	metadata: z.record(z.unknown()).default({}),
});

export type NotificationDeliveryResult = {
	status: NotificationDeliveryAttemptStatus;
	provider?: string;
	recipient?: string;
	externalId?: string;
	error?: string;
	metadata?: Record<string, unknown>;
};

export type NotificationChannel = {
	id: string;
	deliver(intent: NotificationIntent): Promise<NotificationDeliveryResult>;
};

export type DeliverPendingNotificationsInput = {
	channels: readonly NotificationChannel[];
	limit?: number;
};

export type DeliverPendingNotificationsResult = {
	intentsProcessed: number;
	attempts: NotificationDeliveryAttempt[];
};

export type NotificationsApiContext = {
	db: DatabaseAdapter;
	now: () => Date;
};

function optionalWhere<T extends Record<string, unknown>>(where: T): Partial<T> {
	return Object.fromEntries(
		Object.entries(where).filter(([, value]) => value !== undefined),
	) as Partial<T>;
}

function parsePayload(kind: string, payload: Record<string, unknown>) {
	const schema =
		coreNotificationPayloadSchemas[kind as CoreNotificationKind];
	return schema ? schema.parse(payload) : payload;
}

function summarizeIntentStatus(
	results: readonly NotificationDeliveryAttempt[],
): NotificationIntentStatus {
	if (results.some((result) => result.status === "delivered")) {
		return "delivered";
	}
	if (results.some((result) => result.status === "failed")) {
		return "failed";
	}
	return "skipped";
}

export function createNotificationsApi(context: NotificationsApiContext) {
	const { db, now } = context;

	async function getIntentOrThrow(intentId: string): Promise<NotificationIntent> {
		const intent = await db.findOne(coreModels.notificationIntent, {
			id: intentId,
		});
		if (!intent) {
			throw new HackKitError("NOT_FOUND", "Notification intent not found.");
		}
		return intent;
	}

	async function recordDeliveryAttempt(
		input: unknown,
	): Promise<NotificationDeliveryAttempt> {
		const parsed = parseInput(recordDeliveryAttemptSchema, input);
		await getIntentOrThrow(parsed.intentId);
		return db.insert(coreModels.notificationDeliveryAttempt, {
			...parsed,
			attemptedAt: now(),
		});
	}

	return {
		async queueIntent(
			input: QueueNotificationIntentInput,
		): Promise<NotificationIntent> {
			const parsed = parseInput(queueNotificationIntentSchema, input);
			const payload = parsePayload(parsed.kind, parsed.payload);
			if (parsed.idempotencyKey) {
				const existing = await db.findOne(coreModels.notificationIntent, {
					idempotencyKey: parsed.idempotencyKey,
				});
				if (existing) return existing;
			}
			const timestamp = now();
			return db.insert(coreModels.notificationIntent, {
				kind: parsed.kind,
				recipientAuthId: parsed.recipientAuthId,
				payload,
				idempotencyKey: parsed.idempotencyKey,
				status: "pending",
				createdAt: timestamp,
				updatedAt: timestamp,
			});
		},

		async getIntent(intentId: string): Promise<NotificationIntent | null> {
			return db.findOne(coreModels.notificationIntent, { id: intentId });
		},

		async listIntents(input?: unknown): Promise<NotificationIntent[]> {
			const parsed = parseInput(listNotificationIntentsSchema, input);
			return db.findMany(coreModels.notificationIntent, {
				where: optionalWhere({
					status: parsed?.status,
					kind: parsed?.kind,
					recipientAuthId: parsed?.recipientAuthId,
				}),
				orderBy: { field: "createdAt", direction: "desc" },
				limit: parsed?.limit,
			});
		},

		async listDeliveryAttempts(
			intentId: string,
		): Promise<NotificationDeliveryAttempt[]> {
			return db.findMany(coreModels.notificationDeliveryAttempt, {
				where: { intentId },
				orderBy: { field: "attemptedAt", direction: "desc" },
			});
		},

		recordDeliveryAttempt,

		async deliverPending(
			input: DeliverPendingNotificationsInput,
		): Promise<DeliverPendingNotificationsResult> {
			if (input.channels.length === 0) {
				return { intentsProcessed: 0, attempts: [] };
			}
			const intents = await db.findMany(coreModels.notificationIntent, {
				where: { status: "pending" },
				orderBy: { field: "createdAt", direction: "asc" },
				limit: input.limit ?? 25,
			});
			const attempts: NotificationDeliveryAttempt[] = [];

			for (const intent of intents) {
				await db.update(
					coreModels.notificationIntent,
					{ id: intent.id },
					{ status: "processing", updatedAt: now() },
				);
				const intentAttempts: NotificationDeliveryAttempt[] = [];

				for (const channel of input.channels) {
					let result: NotificationDeliveryResult;
					try {
						result = await channel.deliver(intent);
					} catch (error) {
						result = {
							status: "failed",
							error:
								error instanceof Error
									? error.message
									: "Notification channel failed.",
						};
					}
					const attempt = await recordDeliveryAttempt({
						intentId: intent.id,
						channel: channel.id,
						...result,
					});
					intentAttempts.push(attempt);
					attempts.push(attempt);
				}

				await db.update(
					coreModels.notificationIntent,
					{ id: intent.id },
					{
						status: summarizeIntentStatus(intentAttempts),
						updatedAt: now(),
					},
				);
			}

			return { intentsProcessed: intents.length, attempts };
		},
	};
}

export type NotificationsApi = ReturnType<typeof createNotificationsApi>;
