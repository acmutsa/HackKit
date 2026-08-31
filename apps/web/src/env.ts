import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		CLERK_SECRET_KEY: z.string(),
		SHARED_SECRET: z.string().min(64, {
			message: "SHARED_SECRET must be at least 64 characters",
		INTERNAL_AUTH_KEY: z.string().min(64, {
			message: "INTERNAL_AUTH_KEY must be at least 64 characters",
		}),
		BOT_API_URL: z.string(),
		NODE_ENV: z
			.enum(["development", "test", "production"])
			.default("development"),
		CLOUDFLARE_ACCOUNT_ID: z.string(),
		R2_ACCESS_KEY_ID: z.string(),
		R2_SECRET_ACCESS_KEY: z.string(),
		TURSO_AUTH_TOKEN: z.string(),
		TURSO_DATABASE_URL: z.string(),
		UPSTASH_REDIS_REST_TOKEN: z.string(),
		UPSTASH_REDIS_REST_URL: z.string(),
	},
	client: {
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
	},
	experimental__runtimeEnv: {
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
			process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
	},
	// Enable the flag to treat empty strings as undefined
	emptyStringAsUndefined: true,
});
