import { z } from "zod";
import { HackKitError } from "./errors.js";

export type EventTypeOption = {
	value: string;
	label: string;
	color: string;
};

export type EventTypes = readonly EventTypeOption[];

export type EventTypesInput = readonly EventTypeOption[];

export const defaultEventTypes: EventTypes = [
	{ value: "meal", label: "Meal", color: "#FFC107" },
	{ value: "workshop", label: "Workshop", color: "#10b981" },
	{ value: "ceremony", label: "Ceremony", color: "#9C27B0" },
	{ value: "social", label: "Social", color: "#2196F3" },
	{ value: "other", label: "Other", color: "#795548" },
];

const eventTypeOptionSchema = z.object({
	value: z.string().min(1),
	label: z.string().min(1),
	color: z.string().min(1),
});

const eventTypesSchema = z.array(eventTypeOptionSchema).min(1);

function assertUniqueEventTypeValues(options: readonly EventTypeOption[]): void {
	const seen = new Set<string>();
	for (const option of options) {
		if (seen.has(option.value)) {
			throw new HackKitError(
				"INVALID_OPERATION",
				`Event Types contain duplicate value '${option.value}'.`,
			);
		}
		seen.add(option.value);
	}
}

export function resolveEventTypes(
	input: EventTypesInput = defaultEventTypes,
): EventTypes {
	const parsed = eventTypesSchema.safeParse(input);

	if (!parsed.success) {
		throw HackKitError.fromZod(parsed.error);
	}

	assertUniqueEventTypeValues(parsed.data);
	return parsed.data;
}

export function eventTypeValueSchema(
	eventTypes: EventTypes,
	message = "Select a valid event type.",
) {
	const values = new Set(eventTypes.map((option) => option.value));
	return z
		.string()
		.min(1)
		.refine((value) => values.has(value), { message });
}
