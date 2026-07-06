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
	type AssignRoleInput,
	type ApproveUserInput,
	type BanUserInput,
	type CheckInUserInput,
	type CreateRoleInput,
	type HackTagFormValues,
	type HackerRegistrationFormValues,
	type PreviewEventPassQrInput,
	type PreviewEventPassQrResult,
	type RecordEventScanInput,
	type SetRsvpStatusInput,
	type UpdateRoleInput,
	type UserProfileFormValues,
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

		async updateUserProfile(values: UserProfileFormValues) {
			try {
				const authId = await getAuthId();
				const user = await hackkit.users.updateProfile({
					...values,
					authId,
				});
				return actionSuccess(user);
			} catch (error) {
				return actionFailure(error, "Could not update profile.");
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

		async confirmRsvp() {
			try {
				const authId = await getAuthId();
				const rsvp = await hackkit.rsvp.confirm({ authId });
				return actionSuccess(rsvp);
			} catch (error) {
				return actionFailure(error, "Could not confirm RSVP.");
			}
		},

		async cancelRsvp(targetAuthId: string) {
			try {
				const actorAuthId = await getAuthId();
				const rsvp = await hackkit.rsvp.cancel({ actorAuthId, targetAuthId });
				return actionSuccess(rsvp);
			} catch (error) {
				return actionFailure(error, "Could not cancel RSVP.");
			}
		},

		async setRsvpStatus(input: SetRsvpStatusInput) {
			try {
				const actorAuthId = await getAuthId();
				const rsvp = await hackkit.rsvp.setStatus({
					actorAuthId,
					...input,
				});
				return actionSuccess(rsvp);
			} catch (error) {
				return actionFailure(error, "Could not update RSVP.");
			}
		},

		async promoteRsvp(targetAuthId?: string) {
			try {
				const actorAuthId = await getAuthId();
				const rsvp = await hackkit.rsvp.promote({ actorAuthId, targetAuthId });
				return actionSuccess(rsvp);
			} catch (error) {
				return actionFailure(error, "Could not promote RSVP.");
			}
		},

		async approveUser(input: ApproveUserInput) {
			try {
				const actorAuthId = await getAuthId();
				const updated = await hackkit.users.approveUser({
					actorAuthId,
					targetAuthId: input.targetAuthId,
					approved: input.approved,
				});
				return actionSuccess(updated);
			} catch (error) {
				return actionFailure(error, "Could not update approval.");
			}
		},

		async banUser(input: BanUserInput) {
			try {
				const actorAuthId = await getAuthId();
				await hackkit.users.banUser({
					actorAuthId,
					targetAuthId: input.targetAuthId,
					reason: input.reason,
				});
				return actionSuccess();
			} catch (error) {
				return actionFailure(error, "Could not suspend user.");
			}
		},

		async unbanUser(targetAuthId: string) {
			try {
				const actorAuthId = await getAuthId();
				await hackkit.users.unbanUser({ actorAuthId, targetAuthId });
				return actionSuccess();
			} catch (error) {
				return actionFailure(error, "Could not reinstate user.");
			}
		},

		async assignRoleToUser(input: AssignRoleInput) {
			try {
				const actorAuthId = await getAuthId();
				const updated = await hackkit.roles.assignRoleToUser({
					actorAuthId,
					targetAuthId: input.targetAuthId,
					roleId: input.roleId,
				});
				return actionSuccess(updated);
			} catch (error) {
				return actionFailure(error, "Could not assign role.");
			}
		},

		async createRole(input: CreateRoleInput) {
			try {
				const actorAuthId = await getAuthId();
				const role = await hackkit.roles.createRole({
					actorAuthId,
					...input,
				});
				return actionSuccess(role);
			} catch (error) {
				return actionFailure(error, "Could not create role.");
			}
		},

		async updateRole(input: UpdateRoleInput) {
			try {
				const actorAuthId = await getAuthId();
				const role = await hackkit.roles.updateRole({
					actorAuthId,
					...input,
				});
				return actionSuccess(role);
			} catch (error) {
				return actionFailure(error, "Could not update role.");
			}
		},

		async deleteRole(roleId: string) {
			try {
				const actorAuthId = await getAuthId();
				await hackkit.roles.deleteRole({ actorAuthId, roleId });
				return actionSuccess();
			} catch (error) {
				return actionFailure(error, "Could not delete role.");
			}
		},
	};
}
