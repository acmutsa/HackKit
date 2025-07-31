"use server";

import { adminAction } from "@/lib/safe-action";
import { newEventFormSchema as editEventFormSchema } from "@/validators/event";
import { editEvent as modifyEvent } from "db/functions";
import { deleteEvent as removeEvent } from "db/functions";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const editEvent = adminAction
	.schema(editEventFormSchema)
	.action(async ({ parsedInput }) => {
		const { id, ...options } = parsedInput;

		if (id === undefined) {
			throw new Error("The event's ID is not defined");
		}

		try {
			await modifyEvent(id, options);
			revalidatePath("/admin/events");
			revalidatePath("/dash/schedule");
			revalidatePath(`/schedule/${id}`);
		} catch (e) {
			console.error(e);
			throw new Error(
				"Event update failed. Check the server console for errors.",
			);
		}
	});

export const deleteEventAction = adminAction
	.schema(z.object({ eventID: z.number().positive().int() }))
	.action(async ({ parsedInput }) => {
		await removeEvent(parsedInput.eventID);
		revalidatePath("/admin/events");
		return { success: true };
	});
