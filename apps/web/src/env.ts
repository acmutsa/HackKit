import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

// Helper function to handle empty strings as undefined
const stringOrUndefined = z
  .string()
  .refine((val) => val !== "", { message: "Value cannot be an empty string" })
  .transform((val) => (val === "" ? undefined : val));

export const env = createEnv({
  server: {
    CLERK_SECRET_KEY: stringOrUndefined,
    AWS_SES_ACCESS_KEY: stringOrUndefined,
    AWS_SES_SECRET_ACCESS_KEY: stringOrUndefined,
    AWS_REGION: stringOrUndefined,
    AWS_SES_EMAIL_FROM: stringOrUndefined,
    INTERNAL_AUTH_KEY: z.string().min(64, { message: "INTERNAL_AUTH_KEY must be at least 64 characters" }),
    BOT_API_URL: stringOrUndefined,
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  },
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: stringOrUndefined,
  },
  // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
  //   runtimeEnv: {
  //     DATABASE_URL: process.env.DATABASE_URL,
  //     OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY,
  //     NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
  //   },
  //   For Next.js >= 13.4.4, you only need to destructure client variables:
  experimental__runtimeEnv: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  },
});
