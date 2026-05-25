import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./drizzle.schema.ts",
	dialect: "turso",
	dbCredentials: {
		url: process.env.DATABASE_URL ?? "file:.data/test-web.db",
	},
});
