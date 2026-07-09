import type { HackKitUIActions } from "@hackkit/ui";

export const HACKKIT_API_BASE_PATH = "/api/hackkit";

/** Stable paths for every Core UI action exposed by the Better Call router. */
export const HACKKIT_UI_ACTION_ENDPOINTS = {
	completeUserData: "/complete-user-data",
	claimHackTag: "/claim-hack-tag",
	updateUserProfile: "/update-user-profile",
	registerHacker: "/register-hacker",
	createEvent: "/events",
	updateEvent: "/events/update",
	deleteEvent: "/events/delete",
	previewEventPassQr: "/event-pass/preview",
	recordEventScan: "/event-pass/scan",
	checkInUser: "/check-in",
	clearCheckIn: "/check-in/clear",
	confirmRsvp: "/rsvp/confirm",
	cancelRsvp: "/rsvp/cancel",
	setRsvpStatus: "/rsvp/status",
	promoteRsvp: "/rsvp/promote",
	approveUser: "/users/approval",
	banUser: "/users/ban",
	unbanUser: "/users/unban",
	assignRoleToUser: "/users/role",
	createRole: "/roles",
	updateRole: "/roles/update",
	deleteRole: "/roles/delete",
	listSettings: "/settings/list",
	setSettings: "/settings",
	resetSetting: "/settings/reset",
} as const satisfies Record<keyof HackKitUIActions, string>;
