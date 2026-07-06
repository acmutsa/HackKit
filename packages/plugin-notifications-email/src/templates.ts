import {
	CoreNotificationKind,
	type NotificationIntent,
	type NotificationKind,
} from "@hackkit/core";

export type EmailTemplate = {
	subject: string;
	text: string;
	html?: string;
};

export type EmailTemplateContext = {
	intent: NotificationIntent;
	payload: Record<string, unknown>;
	appName: string;
	baseUrl?: string;
};

export type EmailTemplateRenderer = (
	context: EmailTemplateContext,
) => EmailTemplate | null | Promise<EmailTemplate | null>;

export type EmailTemplateMap = Partial<
	Record<NotificationKind, EmailTemplateRenderer>
>;

function getString(payload: Record<string, unknown>, key: string): string | undefined {
	const value = payload[key];
	return typeof value === "string" ? value : undefined;
}

function appLink(baseUrl?: string): string {
	return baseUrl ? `\n\nOpen the event app: ${baseUrl}` : "";
}

export const defaultEmailTemplates: EmailTemplateMap = {
	[CoreNotificationKind.UserApproved]: ({ appName, baseUrl }) => ({
		subject: `You're approved for ${appName}`,
		text: `Good news. Your registration for ${appName} has been approved.${appLink(baseUrl)}`,
	}),
	[CoreNotificationKind.UserUnapproved]: ({ appName }) => ({
		subject: `Your ${appName} approval changed`,
		text: `Your registration approval for ${appName} has been updated. Contact the organisers if you think this was a mistake.`,
	}),
	[CoreNotificationKind.RsvpConfirmed]: ({ appName, baseUrl }) => ({
		subject: `RSVP confirmed for ${appName}`,
		text: `Your RSVP for ${appName} is confirmed.${appLink(baseUrl)}`,
	}),
	[CoreNotificationKind.RsvpWaitlisted]: ({ appName, payload }) => {
		const position = payload.position;
		const positionText =
			typeof position === "number" ? ` You are currently #${position} on the waitlist.` : "";
		return {
			subject: `You're on the ${appName} waitlist`,
			text: `You have been added to the ${appName} RSVP waitlist.${positionText}`,
		};
	},
	[CoreNotificationKind.RsvpPromoted]: ({ appName, baseUrl }) => ({
		subject: `You're off the ${appName} waitlist`,
		text: `A spot opened up and your RSVP for ${appName} is now confirmed.${appLink(baseUrl)}`,
	}),
	[CoreNotificationKind.AuthAccount]: ({ appName, payload }) => {
		const purpose = getString(payload, "purpose");
		const url = getString(payload, "url");
		const action =
			purpose === "password-reset"
				? "reset your password"
				: purpose === "magic-link"
					? "sign in"
					: "verify your account";
		return {
			subject: `${appName} account link`,
			text: `Use this link to ${action}: ${url ?? "No link was provided."}`,
		};
	},
};

export function mergeEmailTemplates(
	overrides: EmailTemplateMap | undefined,
): EmailTemplateMap {
	return { ...defaultEmailTemplates, ...overrides };
}
