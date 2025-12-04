// packages/db/drizzle.config.ts
import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const DB_TYPE = process.env.DB_TYPE ?? "sqlite";

// All DBs now use the unified schema:
const SCHEMA_PATH = "./schema.ts";

const configs = {
  sqlite: {
    dialect: "sqlite" as const,
    schema: SCHEMA_PATH,
    dbCredentials: {
      url: "file:./local.db",
    },
  },

  turso: {
    dialect: "turso" as const,
    schema: SCHEMA_PATH,
    dbCredentials: {
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    },
  },

  postgres: {
    dialect: "postgres" as const,
    schema: SCHEMA_PATH,
    dbCredentials: {
      connectionString: process.env.POSTGRES_URL!,
    },
  },
} as const;

const current = configs[DB_TYPE as keyof typeof configs];

if (!current) {
  throw new Error(`Unknown DB_TYPE: ${DB_TYPE}`);
}

export default defineConfig({
  ...current,
  out: "./drizzle",
  breakpoints: true,
});
