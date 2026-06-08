import { defineConfig } from "drizzle-kit";
import { env } from "./env";

export default defineConfig({
	schema: "./drizzle.schema.ts",
	dialect: "turso",
	dbCredentials: {
		url: env.databaseUrl,
		authToken: env.tursoAuthToken,
	},
});
