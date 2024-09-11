import { events } from "db/schema";
import z from "zod";
import { eventDataTableValidator } from "@/validators/event";
import type { InferSelectModel, InferInsertModel } from "db";

export interface eventInsertType extends InferInsertModel<typeof events> {}
export interface EventType extends InferSelectModel<typeof events> {}

export type eventTableValidatorType = Pick<
	z.infer<typeof eventDataTableValidator>,
	"title" | "startTime" | "endTime" | "id" | "type"
>;

export interface NewEventFormProps {
	defaultDate: Date;
}

export interface getAllEventsOptions {
	ascending?: boolean;
}
