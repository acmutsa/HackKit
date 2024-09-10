import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as dotenv from "dotenv";

const runMigrations = async () => {
	dotenv.config({
		path: "../../.env",
	});

	console.log("⏳ Running migrations...");
	const start = Date.now();

	// TODO: Change this to use t3-env instead of dotenv for type checking
	const sql = postgres(
		(process.env.POSTGRES_URL as string) + "?sslmode=require",
		{ max: 1 },
	);
	const db = drizzle(sql);

	await migrate(db, { migrationsFolder: "drizzle" });

	console.log(`✅ Migrations completed in ${Date.now() - start}ms`);

	process.exit(0);
};

runMigrations().catch((err) => {
	console.error("❌ Migration failed");
	console.error(err);
	process.exit(1);
});
