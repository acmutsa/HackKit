import {
	CorePermission,
	HackKitError,
	type HackKit,
} from "@hackkit/core";
import {
	actionFailure,
	actionSuccess,
	type EventFormValues,
	type HackKitActionResult,
	type HackKitUIActions,
	type CheckInUserInput,
	type PreviewEventPassQrInput,
	type PreviewEventPassQrResult,
	type RecordEventScanInput,
	type UserDataFormValues,
	resolveEventPassTargetAuthId,
} from "@hackkit/ui";

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

export type CreateHackKitMutationsOptions = {
	hackkit: HackKit;
	getAuthId: () => Promise<string>;
	eventPassQrTtlMs: number;
};

export function createHackKitMutations(
	options: CreateHackKitMutationsOptions,
): HackKitUIActions {
	const { hackkit, getAuthId, eventPassQrTtlMs } = options;
	const now = () => new Date();

	function resolveTargetFromQr(rawQr: string) {
		return resolveEventPassTargetAuthId(rawQr, now(), eventPassQrTtlMs);
	}

	return {
		async completeUserData(values: UserDataFormValues) {
			try {
				const authId = await getAuthId();
				await hackkit.userData.completeUserData({
					...values,
					authId,
				});
				return actionSuccess();
			} catch (error) {
				return actionFailure(error, "Could not save user data.");
			}
		},

		async createEvent(values: EventFormValues) {
			try {
				const actorAuthId = await getAuthId();
				const event = await hackkit.events.createEvent({
					actorAuthId,
					...parseEventFormValues(values),
				});
				return actionSuccess(event);
			} catch (error) {
				return actionFailure(error, "Could not create event.");
			}
		},

		async updateEvent(eventId: string, values: EventFormValues) {
			try {
				const actorAuthId = await getAuthId();
				const event = await hackkit.events.updateEvent({
					actorAuthId,
					eventId,
					...parseEventFormValues(values),
				});
				return actionSuccess(event);
			} catch (error) {
				return actionFailure(error, "Could not update event.");
			}
		},

		async deleteEvent(eventId: string) {
			try {
				const actorAuthId = await getAuthId();
				await hackkit.events.deleteEvent({
					actorAuthId,
					eventId,
				});
				return actionSuccess();
			} catch (error) {
				return actionFailure(error, "Could not delete event.");
			}
		},

		async previewEventPassQr(
			input: PreviewEventPassQrInput,
		): Promise<HackKitActionResult<PreviewEventPassQrResult>> {
			try {
				const actorAuthId = await getAuthId();
				const targetAuthId = resolveTargetFromQr(input.rawQr);
				const permission = input.eventId
					? CorePermission.EventsScan
					: CorePermission.UsersCheckIn;
				await hackkit.accessControl.requirePermission(
					actorAuthId,
					permission,
				);

				const user = await hackkit.users.getUser(targetAuthId);
				if (!user) {
					throw new HackKitError("NOT_FOUND", "User not found.");
				}

				const priorScans = input.eventId
					? await hackkit.events.listEventScans({
							actorAuthId,
							eventId: input.eventId,
							targetAuthId,
						})
					: [];

				return actionSuccess({ user, priorScans });
			} catch (error) {
				return actionFailure(error, "Could not read Event Pass QR code.");
			}
		},

		async checkInUser(input: CheckInUserInput) {
			try {
				const actorAuthId = await getAuthId();
				const targetAuthId = resolveTargetFromQr(input.rawQr);
				const updated = await hackkit.users.checkIn({
					actorAuthId,
					targetAuthId,
				});
				return actionSuccess(updated);
			} catch (error) {
				return actionFailure(error, "Could not check in participant.");
			}
		},

		async recordEventScan(input: RecordEventScanInput) {
			try {
				const actorAuthId = await getAuthId();
				const targetAuthId = resolveTargetFromQr(input.rawQr);
				const result = await hackkit.events.recordEventScan({
					actorAuthId,
					eventId: input.eventId,
					targetAuthId,
				});
				return actionSuccess(result);
			} catch (error) {
				return actionFailure(error, "Could not record scan.");
			}
		},

		async clearCheckIn(targetAuthId: string) {
			try {
				const actorAuthId = await getAuthId();
				const updated = await hackkit.users.clearCheckIn({
					actorAuthId,
					targetAuthId,
				});
				return actionSuccess(updated);
			} catch (error) {
				return actionFailure(error, "Could not clear check-in.");
			}
		},
	};
}
