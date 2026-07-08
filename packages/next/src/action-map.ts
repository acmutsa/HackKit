import type { HackKitUIActions } from "@hackkit/ui";
import {
	approveUser,
	assignRoleToUser,
	banUser,
	cancelRsvp,
	checkInUser,
	claimHackTag,
	clearCheckIn,
	completeUserData,
	confirmRsvp,
	createEvent,
	createRole,
	deleteEvent,
	deleteRole,
	listSettings,
	previewEventPassQr,
	promoteRsvp,
	recordEventScan,
	registerHacker,
	resetSetting,
	setRsvpStatus,
	setSettings,
	unbanUser,
	updateEvent,
	updateRole,
	updateUserProfile,
} from "./actions";

/**
 * HackKit UI actions as a single object for `HackKitUIProvider`.
 *
 * Named server actions live in `./actions` (a `"use server"` module that
 * delegates to `runtime.mutations`). This map is the app-facing wiring
 * surface so providers do not hand-maintain the action list.
 */
export const hackKitUIActions = {
	completeUserData,
	claimHackTag,
	updateUserProfile,
	registerHacker,
	createEvent,
	updateEvent,
	deleteEvent,
	previewEventPassQr,
	recordEventScan,
	checkInUser,
	clearCheckIn,
	confirmRsvp,
	cancelRsvp,
	setRsvpStatus,
	promoteRsvp,
	approveUser,
	banUser,
	unbanUser,
	assignRoleToUser,
	createRole,
	updateRole,
	deleteRole,
	listSettings,
	setSettings,
	resetSetting,
} satisfies HackKitUIActions;
