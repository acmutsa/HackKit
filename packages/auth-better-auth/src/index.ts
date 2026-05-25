import type { AuthAdapter, AuthSession, HackKitLogger, LogLevel } from "@hackkit/core";
import { headers } from "next/headers";
import {
	account,
	session,
	syncBetterAuthStorage,
	user,
	verification,
} from "./auth-schema";

type BetterAuthInstance = {
	api: {
		getSession: (input: {
			headers: Headers;
		}) => Promise<AuthSession | null>;
	};
};

export type BetterAuthAdapterOptions = {
	auth: BetterAuthInstance;
	logger?: HackKitLogger;
};

export function toBetterAuthLogger(logger: HackKitLogger) {
	return {
		disabled: logger.disabled,
		level: logger.level,
		log: (level: LogLevel, message: string, ...args: unknown[]) => {
			logger.log(level, message, ...args);
		},
	};
}

export function betterAuthAdapter(
	options: BetterAuthAdapterOptions,
): AuthAdapter {
	const { auth } = options;

	return {
		async getSession() {
			return auth.api.getSession({
				headers: await headers(),
			});
		},

		toAuthId(session) {
			return session.user.id;
		},

		getIdentity(session) {
			const [firstName = session.user.name, ...lastNameParts] = session.user.name
				.trim()
				.split(/\s+/);

			return {
				email: session.user.email,
				firstName,
				lastName: lastNameParts.join(" ") || "User",
				profilePhotoUrl: session.user.image ?? undefined,
			};
		},

		syncStorage(database) {
			return syncBetterAuthStorage(
				database as Parameters<typeof syncBetterAuthStorage>[0],
			);
		},
	};
}

export {
	account,
	session,
	syncBetterAuthStorage,
	user,
	verification,
};
