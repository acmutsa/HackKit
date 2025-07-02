import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		BACKUPS_SECRET_KEY: z.string(),
		BACKUPS_DATABSE_NAME: z.string(),
		BACKUPS_ORGANIZATION_SLUG: z.string(),
		CLOUDFLARE_ACCOUNT_ID: z.string(),
		BACKUPS_BUCKET_ACCESS_KEY_ID: z.string(),
		BACKUPS_BUCKET_SECRET_ACCESS_KEY: z.string(),
		BACKUPS_DB_BEARER: z.string({
			description:
				"This is a bearer token to access the databases. For good practice, try to keep this one read only just in case.",
		}),
		BACKUPS_BUCKET_NAME: z.string(),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});