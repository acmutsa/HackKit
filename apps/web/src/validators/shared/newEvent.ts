import { createInsertSchema } from "drizzle-zod";
import { events } from "db/schema";

export const newEventSchema = createInsertSchema(events);
