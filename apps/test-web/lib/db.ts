import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { appConfig } from "./app-config";

const client = createClient({ url: appConfig.databaseUrl });

export const db = drizzle(client);
