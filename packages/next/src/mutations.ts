import {
	CorePermission,
	CoreSetting,
	HackKitError,
	type HackKit,
	type SettingKey,
	type SettingValue,
} from "@hackkit/core";
import type { HackkitRuntime } from "./runtime";

function isHackkitRuntime(
	value: CreateHackKitMutationsOptions | HackkitRuntime,
): value is HackkitRuntime {
	return "pageGuards" in value && "getCurrentUser" in value;
}
import { actionFailure, actionSuccess } from "@hackkit/ui/actions";
import type { HackKitActionResult } from "@hackkit/ui/actions";
import {
	type EventFormValues,
	type HackKitUIActions,
	type CheckInUserInput,
	type HackTagFormValues,
	type HackerRegistrationFormValues,
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
	getSettingValue: (key: SettingKey) => Promise<SettingValue>;
	invalidateSettingsCache?: () => void;
};

export function createHackKitMutations(runtime: HackkitRuntime): HackKitUIActions;
export function createHackKitMutations(
	options: CreateHackKitMutationsOptions,
): HackKitUIActions;
export function createHackKitMutations(
	optionsOrRuntime: CreateHackKitMutationsOptions | HackkitRuntime,
): HackKitUIActions {
	const options = isHackkitRuntime(optionsOrRuntime)
		? {
				hackkit: optionsOrRuntime.hackkit,
				getAuthId: optionsOrRuntime.getAuthId,
				getSettingValue: optionsOrRuntime.getSettingValue,
				invalidateSettingsCache: optionsOrRuntime.invalidateSettingsCache,
			}
		: optionsOrRuntime;
	const { hackkit, getAuthId, getSettingValue, invalidateSettingsCache } = options;
	const now = () => new Date();

	async function resolveTargetFromQr(rawQr: string) {
		const eventPassQrTtlMs = await getSettingValue(CoreSetting.EventPassQrTtlMs);
		return resolveEventPassTargetAuthId(rawQr, now(), Number(eventPassQrTtlMs));
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

		async claimHackTag(values: HackTagFormValues) {
			try {
				const authId = await getAuthId();
				await hackkit.users.claimHackTag({
					...values,
					authId,
				});
				return actionSuccess();
			} catch (error) {
				return actionFailure(error, "Could not claim HackTag.");
			}
		},

		async registerHacker(values: HackerRegistrationFormValues) {
			try {
				const authId = await getAuthId();
				await hackkit.hackers.registerHacker({
					...values,
					authId,
				});
				return actionSuccess();
			} catch (error) {
				return actionFailure(error, "Could not complete hacker registration.");
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
				const targetAuthId = await resolveTargetFromQr(input.rawQr);
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
				const targetAuthId = await resolveTargetFromQr(input.rawQr);
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
				const targetAuthId = await resolveTargetFromQr(input.rawQr);
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

		async listSettings() {
			try {
				const actorAuthId = await getAuthId();
				const settings = await hackkit.settings.list({ actorAuthId });
				return actionSuccess(settings);
			} catch (error) {
				return actionFailure(error, "Could not load settings.");
			}
		},

		async setSettings(values) {
			try {
				const actorAuthId = await getAuthId();
				const settings = await hackkit.settings.setMany({ actorAuthId, values });
				invalidateSettingsCache?.();
				return actionSuccess(settings);
			} catch (error) {
				return actionFailure(error, "Could not save settings.");
			}
		},

		async resetSetting(key) {
			try {
				const actorAuthId = await getAuthId();
				const setting = await hackkit.settings.reset({ actorAuthId, key });
				invalidateSettingsCache?.();
				return actionSuccess(setting);
			} catch (error) {
				return actionFailure(error, "Could not reset setting.");
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
