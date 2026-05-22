import "server-only";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { db } from "./db";
import {
	account,
	session,
	syncBetterAuthStorage,
	user,
	verification,
} from "./auth-schema";

await syncBetterAuthStorage(db);

export const auth = betterAuth({
	baseURL:
		process.env.BETTER_AUTH_URL ??
		process.env.NEXT_PUBLIC_APP_URL ??
		"http://localhost:3000",
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
});

export async function getAuthSession() {
	return auth.api.getSession({
		headers: await headers(),
	});
}
