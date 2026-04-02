import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const isComingSoonMode = process.env.COMING_SOON_MODE === "true";

const requiredWhenLive = <T extends z.ZodTypeAny>(schema: T) =>
	isComingSoonMode ? schema.optional() : schema;

export const env = createEnv({
	server: {
		COMING_SOON_MODE: z.enum(["true", "false"]).default("false"),

		CLERK_SECRET_KEY: requiredWhenLive(z.string()),
		INTERNAL_AUTH_KEY: requiredWhenLive(
			z.string().min(64, {
				message: "INTERNAL_AUTH_KEY must be at least 64 characters",
			}),
		),
		BOT_API_URL: requiredWhenLive(z.string()),
		NODE_ENV: z
			.enum(["development", "test", "production"])
			.default("development"),
		CLOUDFLARE_ACCOUNT_ID: requiredWhenLive(z.string()),
		R2_ACCESS_KEY_ID: requiredWhenLive(z.string()),
		R2_SECRET_ACCESS_KEY: requiredWhenLive(z.string()),
		TURSO_AUTH_TOKEN: requiredWhenLive(z.string()),
		TURSO_DATABASE_URL: requiredWhenLive(z.string()),
		UPSTASH_REDIS_REST_TOKEN: requiredWhenLive(z.string()),
		UPSTASH_REDIS_REST_URL: requiredWhenLive(z.string()),
	},
	client: {
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: isComingSoonMode
			? z.string().optional()
			: z.string(),
	},
	experimental__runtimeEnv: {
		COMING_SOON_MODE: process.env.COMING_SOON_MODE,
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
			process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
	},
	emptyStringAsUndefined: true,
});