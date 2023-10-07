import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
// import { migrate } from "drizzle-orm/vercel-postgres/migrator";
import { env } from "@/env.mjs";
import * as schema from "./schema";

export const db = drizzle(sql, { schema });

// await migrate(db, { migrationsFolder: "../../drizzle" });
