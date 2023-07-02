import type { Config } from "drizzle-kit";
import "dotenv/config";

export default {
	schema: "./src/db/schema.ts",
	out: "./drizzle",
	dbCredentials: {
		connectionString: process.env.DB_URL as string,
	},
	breakpoints: true,
} satisfies Config;
