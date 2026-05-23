"use server";

import {
	actionFailure,
	actionSuccess,
	type CheckInUserInput,
	type EventFormValues,
	type RecordEventScanInput,
	type UserDataFormValues,
} from "@hackkit/ui";
import { getCurrentUser, hackkit } from "@/lib/hackkit";

function parseEventFormValues(values: EventFormValues) {
	return {
		title: values.title,
		description: values.description,
		startTime: new Date(values.startTime),
		endTime: new Date(values.endTime),
		location: values.location,
		type: values.type,
		host: values.host.trim() ? values.host.trim() : undefined,
		hidden: values.hidden,
	};
}

export async function completeUserData(values: UserDataFormValues) {
	try {
		const user = await getCurrentUser();
		await hackkit.userData.completeUserData({
			...values,
			authId: user.authId,
		});
		return actionSuccess();
	} catch (error) {
		return actionFailure(error, "Could not save user data.");
	}
}

export async function bootstrapOwner() {
	try {
		const user = await getCurrentUser();
		await hackkit.roles.bootstrapOwner({ authId: user.authId });
		return actionSuccess();
	} catch (error) {
		return actionFailure(error, "Could not bootstrap owner role.");
	}
}

export async function createEvent(values: EventFormValues) {
	try {
		const user = await getCurrentUser();
		const event = await hackkit.events.createEvent({
			actorAuthId: user.authId,
			...parseEventFormValues(values),
		});
		return actionSuccess(event);
	} catch (error) {
		return actionFailure(error, "Could not create event.");
	}
}

export async function updateEvent(eventId: string, values: EventFormValues) {
	try {
		const user = await getCurrentUser();
		const event = await hackkit.events.updateEvent({
			actorAuthId: user.authId,
			eventId,
			...parseEventFormValues(values),
		});
		return actionSuccess(event);
	} catch (error) {
		return actionFailure(error, "Could not update event.");
	}
}

export async function deleteEvent(eventId: string) {
	try {
		const user = await getCurrentUser();
		await hackkit.events.deleteEvent({
			actorAuthId: user.authId,
			eventId,
		});
		return actionSuccess();
	} catch (error) {
		return actionFailure(error, "Could not delete event.");
	}
}

export async function recordEventScan(input: RecordEventScanInput) {
	try {
		const user = await getCurrentUser();
		const result = await hackkit.events.recordEventScan({
			actorAuthId: user.authId,
			eventId: input.eventId,
			targetAuthId: input.targetAuthId,
			qrIssuedAt: input.qrIssuedAt,
		});
		return actionSuccess(result);
	} catch (error) {
		return actionFailure(error, "Could not record scan.");
	}
}

export async function checkInUser(input: CheckInUserInput) {
	try {
		const user = await getCurrentUser();
		const updated = await hackkit.users.checkIn({
			actorAuthId: user.authId,
			targetAuthId: input.targetAuthId,
			qrIssuedAt: input.qrIssuedAt,
		});
		return actionSuccess(updated);
	} catch (error) {
		return actionFailure(error, "Could not check in participant.");
	}
}

export async function clearCheckIn(targetAuthId: string) {
	try {
		const user = await getCurrentUser();
		const updated = await hackkit.users.clearCheckIn({
			actorAuthId: user.authId,
			targetAuthId,
		});
		return actionSuccess(updated);
	} catch (error) {
		return actionFailure(error, "Could not clear check-in.");
	}
}
