import { createInsertSchema } from "drizzle-zod";
import { events } from "db/schema";
import { createSelectSchema } from "drizzle-zod";
import z from "zod";
import c from "config";

export const newEventFormSchema = createInsertSchema(events, {
	title: z.string().min(1),
	description: z.string().min(1),
	startTime: z.date(),
	endTime: z.date(),
	host: z.string().optional(),
	type: z.enum(Object.keys(c.eventTypes) as any),
}).refine(({ startTime, endTime }) => startTime < endTime, {
	message: "Start time must be before end time",
	path: ["startTime"],
});

export const eventDataTableValidator = createSelectSchema(events);
