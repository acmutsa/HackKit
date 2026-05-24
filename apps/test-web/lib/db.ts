import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import hackkitConfig from "../hackkit.config";

const client = createClient({ url: hackkitConfig.databaseUrl });

export const db = drizzle(client);
