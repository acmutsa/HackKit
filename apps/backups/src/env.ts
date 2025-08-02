import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
export const env = createEnv({
	server: {
		BACKUPS_SECRET_KEY: z.string({
			description:
				"This is a secret key used to sign and verify requests. It should be kept secret and not shared with anyone.",
		}),
		BACKUPS_DATABSE_NAME: z.string(),
		BACKUPS_ORGANIZATION_SLUG: z.string(),
		BACKUPS_CLOUDFLARE_ACCOUNT_ID: z.string({
			description:
				"Account ID for the Cloudflare account. Note that this ID should be the same one the bucket is hosted in.",
		}),
		BACKUPS_BUCKET_ACCESS_KEY_ID: z.string(),
		BACKUPS_BUCKET_SECRET_ACCESS_KEY: z.string(),
		BACKUPS_DB_BEARER: z.string({
			description:
				"This is a bearer token to access the databases. If serverless DB provider allows, try to make this token read-only.",
		}),
		BACKUPS_BUCKET_NAME: z.string(),
	},
	onValidationError: (issues) => {
		console.log("all process variables:", process.env);
		console.error("❌ Invalid environment variables:", issues);
		throw new Error("Invalid environment variables");
	},
	// Called when server variables are accessed on the client.
	onInvalidAccess: (variable: string) => {
		console.log(
			`❌ Attempted to access server-side environment variable "${variable}" on the client.`,
		);
		throw new Error(
			"❌ Attempted to access a server-side environment variable on the client",
		);
	},
	// skipValidation: true,
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
