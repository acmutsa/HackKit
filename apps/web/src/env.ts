import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		CLERK_SECRET_KEY: z.string().min(1),
		AWS_SES_ACCESS_KEY: z.string().min(1),
		AWS_SES_SECRET_ACCESS_KEY: z.string().min(1),
		AWS_REGION: z.string().min(1),
		AWS_SES_EMAIL_FROM: z.string().min(1),
		INTERNAL_AUTH_KEY: z.string().min(64),
		BOT_API_URL: z.string().min(1),
		HK_ENV: z.string().min(1),
		NODE_ENV: z
			.enum(["development", "test", "production"])
			.default("development"),
	},
	client: {
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
	},
	// If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
	//   runtimeEnv: {
	//     DATABASE_URL: process.env.DATABASE_URL,
	//     OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY,
	//     NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
	//   },
	//   For Next.js >= 13.4.4, you only need to destructure client variables:
	experimental__runtimeEnv: {
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
			process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
	},
});
