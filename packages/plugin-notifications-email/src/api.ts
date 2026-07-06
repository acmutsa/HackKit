import { coreModels, type HackKitPluginContext } from "@hackkit/core";
import type {
	NotificationChannel,
	NotificationDeliveryResult,
	NotificationIntent,
} from "@hackkit/core";
import { mergeEmailTemplates, type EmailTemplateMap } from "./templates";

export type EmailMessage = {
	to: string;
	from: string;
	replyTo?: string;
	subject: string;
	text: string;
	html?: string;
};

export type EmailProviderResult = {
	id?: string;
	metadata?: Record<string, unknown>;
};

export type EmailProvider = {
	id: string;
	send(message: EmailMessage): Promise<EmailProviderResult>;
};

export type EmailRecipient = {
	email: string;
	name?: string;
};

export type EmailRecipientResolver = (
	intent: NotificationIntent,
	context: HackKitPluginContext,
) => Promise<EmailRecipient | null>;

export type EmailNotificationsPluginOptions = {
	provider?: EmailProvider;
	from: string;
	replyTo?: string;
	appName?: string;
	baseUrl?: string;
	templates?: EmailTemplateMap;
	resolveRecipient?: EmailRecipientResolver;
};

async function defaultRecipientResolver(
	intent: NotificationIntent,
	context: HackKitPluginContext,
): Promise<EmailRecipient | null> {
	const authId =
		intent.recipientAuthId ??
		(typeof intent.payload.authId === "string" ? intent.payload.authId : undefined);
	if (!authId) return null;
	const user = await context.database.findOne(coreModels.user, { authId });
	if (!user) return null;
	return {
		email: user.email,
		name: `${user.firstName} ${user.lastName}`.trim(),
	};
}

function formatRecipient(recipient: EmailRecipient): string {
	if (!recipient.name) return recipient.email;
	return `${recipient.name} <${recipient.email}>`;
}

export function createEmailNotificationsApi(
	context: HackKitPluginContext,
	options: EmailNotificationsPluginOptions,
) {
	const templates = mergeEmailTemplates(options.templates);
	const resolveRecipient = options.resolveRecipient ?? defaultRecipientResolver;

	const channel: NotificationChannel = {
		id: "email",
		async deliver(intent): Promise<NotificationDeliveryResult> {
			if (!options.provider) {
				return {
					status: "skipped",
					error: "Email notification provider is not configured.",
				};
			}
			const template = templates[intent.kind];
			if (!template) {
				return {
					status: "skipped",
					error: `No email template is registered for '${intent.kind}'.`,
				};
			}
			const recipient = await resolveRecipient(intent, context);
			if (!recipient) {
				return {
					status: "skipped",
					error: "Email recipient could not be resolved.",
				};
			}
			const rendered = await template({
				intent,
				payload: intent.payload,
				appName: options.appName ?? "HackKit",
				baseUrl: options.baseUrl,
			});
			if (!rendered) {
				return {
					status: "skipped",
					recipient: recipient.email,
					provider: options.provider.id,
				};
			}
			const result = await options.provider.send({
				to: formatRecipient(recipient),
				from: options.from,
				replyTo: options.replyTo,
				subject: rendered.subject,
				text: rendered.text,
				html: rendered.html,
			});
			return {
				status: "delivered",
				provider: options.provider.id,
				recipient: recipient.email,
				externalId: result.id,
				metadata: result.metadata,
			};
		},
	};

	return {
		channel,
		async deliverPending(input: { limit?: number } = {}) {
			return context.notifications.deliverPending({
				channels: [channel],
				limit: input.limit,
			});
		},
		async deliverIntent(intentId: string) {
			const intent = await context.notifications.getIntent(intentId);
			if (!intent) {
				return null;
			}
			const result = await channel.deliver(intent);
			return context.notifications.recordDeliveryAttempt({
				intentId,
				channel: channel.id,
				...result,
			});
		},
	};
}

export type EmailNotificationsApi = ReturnType<
	typeof createEmailNotificationsApi
>;
