import { createInsertSchema } from "drizzle-zod";
import { events } from "db/schema";
import { createSelectSchema } from "drizzle-zod";
import z from "zod"
import c from "config";

export const newEventFormSchema = createInsertSchema(events).merge(
	z.object({
		type: z.enum(Object.keys(c.eventTypes) as any),
	}),
);;

export const eventDataTableValidator = createSelectSchema(events);
