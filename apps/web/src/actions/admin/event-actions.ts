"use server";

import { superAdminAction } from "@/lib/safe-action";
import { newEventFormSchema as editEventFormSchema } from "@/validators/event";
import { editEvent as modifyEvent } from "db/functions";
import { revalidatePath } from "next/cache";

export const editEvent = superAdminAction
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
