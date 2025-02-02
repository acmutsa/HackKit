import { events } from "db/schema";
import c from "config";
import z from "zod";
import { eventDataTableValidator } from "@/validators/event";
import type { InferSelectModel, InferInsertModel } from "db";

export interface eventInsertType extends InferInsertModel<typeof events> {}
export interface eventEditType extends Omit<eventInsertType, "id"> {}
export interface EventType extends InferSelectModel<typeof events> {}

// NOTE: Weird type casting workaround fixes zod enum required for type safety in EventActions
export type EventTypeEnum = [
	keyof typeof c.eventTypes,
	...Array<keyof typeof c.eventTypes>,
];

export type eventTableValidatorType = Pick<
	z.infer<typeof eventDataTableValidator>,
	"title" | "location" | "startTime" | "endTime" | "id" | "type"
>;

export interface NewEventFormProps {
	defaultDate: Date;
}

export interface getAllEventsOptions {
	descending?: boolean;
}
