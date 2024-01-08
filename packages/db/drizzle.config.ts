import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({
	path: "../../.env",
});

export default {
	schema: "./schema.ts",
	out: "./drizzle",
	driver: "pg",
	dbCredentials: {
		connectionString: `${process.env.POSTGRES_URL as string}?sslmode=require`,
	},
	breakpoints: true,
} satisfies Config;
