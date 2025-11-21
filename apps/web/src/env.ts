import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        CLERK_SECRET_KEY: z.string(),
        AWS_SES_ACCESS_KEY: z.string(),
        AWS_SES_SECRET_ACCESS_KEY: z.string(),
        AWS_REGION: z.string(),
        AWS_SES_EMAIL_FROM: z.string(),
        INTERNAL_AUTH_KEY: z.string().min(64),
        BOT_API_URL: z.string(),
        HK_ENV: z.string(),

        NODE_ENV: z.enum(["development", "test", "production"])
            .default("development"),

        CLOUDFLARE_ACCOUNT_ID: z.string(),
        R2_ACCESS_KEY_ID: z.string(),
        R2_SECRET_ACCESS_KEY: z.string(),

        TURSO_AUTH_TOKEN: z.string(),
        TURSO_DATABASE_URL: z.string(),

        UPSTASH_REDIS_REST_TOKEN: z.string(),
        UPSTASH_REDIS_REST_URL: z.string(),

        // ⭐ DB provider switch (sqlite | turso | postgres)
        DB_PROVIDER: z.enum(["sqlite", "turso", "postgres"]).default("sqlite"),

        // ⭐ Postgres URLs (only required if using postgres)
        POSTGRES_URL: z.string().optional(),
        POSTGRES_PASSWORD: z.string().optional(),
        POSTGRES_HOST: z.string().optional(),
        POSTGRES_USER: z.string().optional(),
        POSTGRES_DATABASE: z.string().optional(),
        POSTGRES_PRISMA_URL: z.string().optional(),
        POSTGRES_URL_NON_POOLING: z.string().optional(),
        POSTGRES_URL_NO_SSL: z.string().optional(),
    },

    client: {
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
        NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string(),
        NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string(),
    },

    experimental__runtimeEnv: {
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
            process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
        NEXT_PUBLIC_CLERK_SIGN_IN_URL:
            process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
        NEXT_PUBLIC_CLERK_SIGN_UP_URL:
            process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    },

    // Enable the flag to treat empty strings as undefined
    emptyStringAsUndefined: true,
});
