"use server";

import { PermissionType } from "@/lib/constants/permission";
import { adminAction } from "@/lib/safe-action";
import { userHasPermission } from "@/lib/utils/server/admin";
import { newEventFormSchema, editEventFormSchema } from "@/validators/event";
import { createNewEvent, editEvent as modifyEvent } from "db/functions";
import { deleteEvent as removeEvent } from "db/functions";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const editEvent = adminAction
	.schema(editEventFormSchema)
	.action(async ({ parsedInput: { id, ...options }, ctx: { user } }) => {
		if (id === undefined) {
			throw new Error("The event's ID is not defined");
		}

		if (!userHasPermission(user, PermissionType.EDIT_EVENTS)) {
			throw new Error("You do not have permission to edit events.");
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

export const createEvent = adminAction
	.schema(newEventFormSchema)
	.action(async ({ parsedInput, ctx: { user } }) => {
		if (!userHasPermission(user, PermissionType.CREATE_EVENTS)) {
			throw new Error("You do not have permission to create events.");
		}

		const res = await createNewEvent(parsedInput);
		return {
			success: true,
			message: "Event created successfully.",
			redirect: `/schedule/${res[0].eventID}`,
		};
	});

export const deleteEventAction = adminAction
	.schema(z.object({ eventID: z.number().positive().int() }))
	.action(async ({ parsedInput, ctx: { user } }) => {
		if (!userHasPermission(user, PermissionType.DELETE_EVENTS)) {
			throw new Error("You do not have permission to delete events.");
		}

		await removeEvent(parsedInput.eventID);
		revalidatePath("/admin/events");
		return { success: true };
	});
