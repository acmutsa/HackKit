// scripts/test-db.ts
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function main() {
  const { db, schema, DB_DRIVER } = await import("../packages/db/client");

  console.log("DB_DRIVER:", DB_DRIVER);

  const rows = await db.select().from(schema.userCommonData).limit(10);
  console.log("Query result:", rows);
}

main().catch((err) => {
  console.error("DB test failed:", err);
  process.exit(1);
});
