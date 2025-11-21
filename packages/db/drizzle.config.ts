// packages/db/drizzle.config.ts
import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load env from monorepo root
dotenv.config({
  path: "../../.env",
});

const DB_TYPE = process.env.DB_TYPE ?? "sqlite";

const configs = {
  sqlite: {
    dialect: "sqlite" as const,
    schema: "./schema.sqlite.ts",
    dbCredentials: {
      // SQLite file lives in packages/db/local.db
      url: "file:./local.db",
    },
  },

  turso: {
    dialect: "turso" as const,
    schema: "./schema.sqlite.ts", // same schema as local sqlite
    dbCredentials: {
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    },
  },

  postgres: {
    dialect: "postgres" as const,
    schema: "./schema.pg.ts", // matches: import * as pgSchema from "./schema.pg";
    dbCredentials: {
      // match your client.ts which uses POSTGRES_URL
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
