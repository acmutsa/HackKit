import {
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
} from "@/app/hackkit-actions";
import { hackKitUIRoutes } from "@/lib/hackkit-ui-routes";
import { HackKitUIProvider } from "@hackkit/ui";
import type * as React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<HackKitUIProvider
			routes={hackKitUIRoutes}
			actions={{
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
			}}
		>
			{children}
		</HackKitUIProvider>
	);
}
