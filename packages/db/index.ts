import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
// import { migrate } from "drizzle-orm/vercel-postgres/migrator";
import * as schema from "./schema";

export * from "drizzle-orm";
export * as zod from "./zod";
export const db = drizzle(sql, { schema });

// await migrate(db, { migrationsFolder: "../../drizzle" });
