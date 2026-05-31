import {
	completeUserData,
	claimHackTag,
	registerHacker,
	createEvent,
	updateEvent,
	deleteEvent,
	previewEventPassQr,
	recordEventScan,
	checkInUser,
	clearCheckIn,
	listSettings,
	setSettings,
	resetSetting,
} from "@/app/hackkit-actions";
import { HackKitUIProvider } from "@hackkit/ui";
import type * as React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<HackKitUIProvider
			actions={{
				completeUserData,
				claimHackTag,
				registerHacker,
				createEvent,
				updateEvent,
				deleteEvent,
				previewEventPassQr,
				recordEventScan,
				checkInUser,
				clearCheckIn,
				listSettings,
				setSettings,
				resetSetting,
			}}
		>
			{children}
		</HackKitUIProvider>
	);
}
