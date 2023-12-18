import type { Config } from "drizzle-kit";
import "dotenv/config";

export default {
	schema: "./src/db/schema.ts",
	out: "./drizzle",
	driver: "pg",
	dbCredentials: {
		connectionString: `${process.env.POSTGRES_URL as string}?sslmode=require`,
	},
	breakpoints: true,
} satisfies Config;
