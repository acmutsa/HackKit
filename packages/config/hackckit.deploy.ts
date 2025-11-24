export const deployConfig = {
	providers: {
		aws: {
			accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
			region: process.env.AWS_REGION || "us-east-1",
		},

		// cloudflare: {
		// 	pulumiApiToken: process.env.CLOUDFLARE_API_TOKEN || "",
		// 	accountId: process.env.CLOUDFLARE_ACCOUNT_ID || "",
		// 	r2: {
		// 		bucketName: process.env.R2_BUCKET_NAME || "",
		// 		accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
		// 		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
		// 		region: process.env.R2_BUCKET_REGION || "",
		// 	},
		// },

		// vercel: {
		// 	vercelToken: process.env.VERCEL_TOKEN || "",
		// 	orgId: process.env.VERCEL_ORG_ID || "",
		// 	projectId: process.env.VERCEL_PROJECT_ID || "",
		// 	teamId: process.env.VERCEL_TEAM_ID || "",
		// },

		// netlify: {
		// 	netlifyToken: process.env.NETLIFY_AUTH_TOKEN || "",
		// 	siteId: process.env.NETLIFY_SITE_ID || "",
		// },
	},

	clerk: {
		publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "",
		secretKey: process.env.CLERK_SECRET_KEY || "",
		webhookSecret: process.env.CLERK_WEBHOOK_SECRET || "",
	},

	discord: {
		clientId: process.env.DISCORD_CLIENT_ID || "",
		clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
		botToken: process.env.DISCORD_BOT_TOKEN || "",
		publicKey: process.env.DISCORD_PUBLIC_KEY || "",
	},

	bucket: {
		name: process.env.AWS_S3_BUCKET || "",
		region: process.env.AWS_S3_REGION || process.env.AWS_REGION || "",
	},

	cron: {
		backupSchedule: process.env.BACKUP_CRON_SCHEDULE || "",
	},
} as const;
