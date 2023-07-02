import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
// import { migrate } from "drizzle-orm/vercel-postgres/migrator";
import { env } from "@/env.mjs";
import * as schema from "./schema";

const sql = connect({
	host: env.DB_HOST,
	username: env.DB_UNAME,
	password: env.DB_PASS,
});

export const db = drizzle(sql, { schema });

// await migrate(db, { migrationsFolder: "../../drizzle" });
