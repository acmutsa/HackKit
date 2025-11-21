// scripts/test-db.ts
import dotenv from "dotenv";

// Load env first
dotenv.config({ path: ".env.local" });

async function main() {
  // Import AFTER env is loaded
  const { db, DB_DRIVER } = await import("../packages/db/client");
  const { userCommonData } = await import("../packages/db/schema.sqlite");

  console.log("DB_TYPE (env):", process.env.DB_TYPE);
  console.log("DB_DRIVER (actual):", DB_DRIVER);

  const rows = await db.select().from(userCommonData).limit(10);
  console.log("Query result:", rows);
}

main().catch((err) => {
  console.error("DB test failed:", err);
  process.exit(1);
});
