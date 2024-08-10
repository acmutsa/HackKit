import { events } from "db/schema";
import z from "zod";
import { eventDataTableValidator } from "@/validators/event";


export type eventInsertType = typeof events.$inferInsert;

export type eventTableValidatorType = Pick<
	z.infer<typeof eventDataTableValidator>,
	"title" | "startTime" | "endTime" | "id" | "type"
>;

export interface NewEventFormProps {
	defaultDate: Date;
}