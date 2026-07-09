import type { HackKitActionResult } from "@hackkit/ui/actions";
import type { HackKitUIActions, SetSettingsInput } from "@hackkit/ui";
import {
	HACKKIT_API_BASE_PATH,
	HACKKIT_UI_ACTION_ENDPOINTS,
} from "./endpoints";

export type HackkitApiClientOptions = {
	baseUrl?: string;
	fetch?: typeof globalThis.fetch;
};

function transportFailure(error: unknown): HackKitActionResult<never> {
	return {
		ok: false,
		message:
			error instanceof Error
				? error.message
				: "Could not reach the HackKit API. Please retry.",
	};
}

/**
 * Browser transport for the Core UI contract. The API's domain failures are
 * returned unchanged, while authentication, CSRF, validation, and transport
 * failures become actionable UI failures.
 */
export function createHackkitUIActionsClient(
	options: HackkitApiClientOptions = {},
): HackKitUIActions {
	const baseUrl = options.baseUrl ?? HACKKIT_API_BASE_PATH;
	const fetchImpl = options.fetch ?? globalThis.fetch;

	async function post<T>(path: string, body: unknown): Promise<HackKitActionResult<T>> {
		try {
			const response = await fetchImpl(`${baseUrl}${path}`, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify(body),
				credentials: "same-origin",
			});
			const payload = (await response.json()) as
				| HackKitActionResult<T>
				| { message?: string };
			if (response.ok && "ok" in payload) return payload;
			return {
				ok: false,
				message:
					("message" in payload && payload.message) ||
					`Request failed (${response.status}).`,
			};
		} catch (error) {
			return transportFailure(error);
		}
	}

	return {
		completeUserData: (values) => post(HACKKIT_UI_ACTION_ENDPOINTS.completeUserData, values),
		claimHackTag: (values) => post(HACKKIT_UI_ACTION_ENDPOINTS.claimHackTag, values),
		updateUserProfile: (values) => post(HACKKIT_UI_ACTION_ENDPOINTS.updateUserProfile, values),
		registerHacker: (values) => post(HACKKIT_UI_ACTION_ENDPOINTS.registerHacker, values),
		createEvent: (values) => post(HACKKIT_UI_ACTION_ENDPOINTS.createEvent, values),
		updateEvent: (eventId, values) => post(HACKKIT_UI_ACTION_ENDPOINTS.updateEvent, { eventId, values }),
		deleteEvent: (eventId) => post(HACKKIT_UI_ACTION_ENDPOINTS.deleteEvent, { eventId }),
		previewEventPassQr: (input) => post(HACKKIT_UI_ACTION_ENDPOINTS.previewEventPassQr, input),
		recordEventScan: (input) => post(HACKKIT_UI_ACTION_ENDPOINTS.recordEventScan, input),
		checkInUser: (input) => post(HACKKIT_UI_ACTION_ENDPOINTS.checkInUser, input),
		clearCheckIn: (targetAuthId) => post(HACKKIT_UI_ACTION_ENDPOINTS.clearCheckIn, { targetAuthId }),
		confirmRsvp: () => post(HACKKIT_UI_ACTION_ENDPOINTS.confirmRsvp, {}),
		cancelRsvp: (targetAuthId) => post(HACKKIT_UI_ACTION_ENDPOINTS.cancelRsvp, { targetAuthId }),
		setRsvpStatus: (input) => post(HACKKIT_UI_ACTION_ENDPOINTS.setRsvpStatus, input),
		promoteRsvp: (targetAuthId) => post(HACKKIT_UI_ACTION_ENDPOINTS.promoteRsvp, { targetAuthId }),
		approveUser: (input) => post(HACKKIT_UI_ACTION_ENDPOINTS.approveUser, input),
		banUser: (input) => post(HACKKIT_UI_ACTION_ENDPOINTS.banUser, input),
		unbanUser: (targetAuthId) => post(HACKKIT_UI_ACTION_ENDPOINTS.unbanUser, { targetAuthId }),
		assignRoleToUser: (input) => post(HACKKIT_UI_ACTION_ENDPOINTS.assignRoleToUser, input),
		createRole: (input) => post(HACKKIT_UI_ACTION_ENDPOINTS.createRole, input),
		updateRole: (input) => post(HACKKIT_UI_ACTION_ENDPOINTS.updateRole, input),
		deleteRole: (roleId) => post(HACKKIT_UI_ACTION_ENDPOINTS.deleteRole, { roleId }),
		listSettings: () => post(HACKKIT_UI_ACTION_ENDPOINTS.listSettings, {}),
		setSettings: (values: SetSettingsInput) => post(HACKKIT_UI_ACTION_ENDPOINTS.setSettings, values),
		resetSetting: (key) => post(HACKKIT_UI_ACTION_ENDPOINTS.resetSetting, { key }),
	};
}
