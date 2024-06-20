import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({
	path: "../../.env",
});

// export default {
// 	schema: "./schema.ts",
// 	out: "./drizzle",
// 	// driver: "pg", Can be removed as of version 0.21.0 or above https://orm.drizzle.team/kit-docs/upgrade-21
// 	dbCredentials: {
// 		connectionString: `${process.env.POSTGRES_URL as string}?sslmode=require`,
// 	},
// 	breakpoints: true,
// } satisfies Config;

// driver: "pg", Can be removed as of version 0.21.0 or above https://orm.drizzle.team/kit-docs/upgrade-21
// Connection string also removed 

export default defineConfig({
	schema: "./schema.ts",
	dialect:"postgresql",
	out: "./drizzle",
	dbCredentials: {
		url: `${process.env.POSTGRES_URL as string}?sslmode=require`,
	},
	breakpoints: true,
});
