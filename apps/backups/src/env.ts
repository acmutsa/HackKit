import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
export const env = createEnv({
	server: {
		BACKUPS_SECRET_KEY: z.string(),
		BACKUPS_DATABSE_NAME: z.string(),
		BACKUPS_ORGANIZATION_SLUG: z.string(),
		BACKUPS_CLOUDFLARE_ACCOUNT_ID: z.string({
			description:
				"Account ID for the Cloudflare account. Note that this must match what you are ",
		}),
		BACKUPS_BUCKET_ACCESS_KEY_ID: z.string(),
		BACKUPS_BUCKET_SECRET_ACCESS_KEY: z.string(),
		BACKUPS_DB_BEARER: z.string({
			description:
				"This is a bearer token to access the databases. For good practice, try to keep this one read only just in case.",
		}),
		BACKUPS_BUCKET_NAME: z.string(),
	},
	onValidationError: (issues) => {
		console.log("all process variables:", process.env)
		console.error("❌ Invalid environment variables:", issues);
		throw new Error("Invalid environment variables");
	},
	// Called when server variables are accessed on the client.
	onInvalidAccess: (variable: string) => {
		console.log(`❌ Attempted to access server-side environment variable "${variable}" on the client.`);
		throw new Error(
			"❌ Attempted to access a server-side environment variable on the client",
		);
	},
	// skipValidation: true,
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
