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
import { resolveAppBaseUrl } from "./app-config";

export const auth = betterAuth({
	baseURL: resolveAppBaseUrl(),
	secret:
		process.env.BETTER_AUTH_SECRET ??
		"test-web-development-secret-change-me-please",
	database: drizzleAdapter(db, {
		provider: "sqlite",
		schema: { user, session, account, verification },
		camelCase: true,
	}),
	emailAndPassword: {
		enabled: true,
	},
	plugins: [nextCookies()],
	logger: toBetterAuthLogger(getAppLogger()),
});

export async function getAuthSession() {
	return getAuthSessionFromAuth(auth);
}
