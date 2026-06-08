import "server-only";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import {
	account,
	session,
	toBetterAuthLogger,
	user,
	verification,
} from "@hackkit/auth-better-auth";
import { getAuthSession as getAuthSessionFromAuth } from "@hackkit/auth-better-auth/session";
import { db } from "./db";
import { getAppLogger } from "./logger";
import { env } from "../env";

const socialProviders = {
	...(env.githubClientId && env.githubClientSecret
		? {
				github: {
					clientId: env.githubClientId,
					clientSecret: env.githubClientSecret,
				},
			}
		: {}),
	...(env.googleClientId && env.googleClientSecret
		? {
				google: {
					clientId: env.googleClientId,
					clientSecret: env.googleClientSecret,
				},
			}
		: {}),
};

export const auth = betterAuth({
	baseURL: env.betterAuthUrl,
	secret: env.betterAuthSecret,
	trustedOrigins: env.betterAuthTrustedOrigins,
	database: drizzleAdapter(db, {
		provider: "sqlite",
		schema: { user, session, account, verification },
		camelCase: true,
	}),
	emailAndPassword: {
		enabled: true,
	},
	socialProviders,
	plugins: [nextCookies()],
	logger: toBetterAuthLogger(getAppLogger()),
});

export async function getAuthSession() {
	return getAuthSessionFromAuth(auth);
}
