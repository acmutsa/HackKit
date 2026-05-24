import {
	completeUserData,
	createEvent,
	updateEvent,
	deleteEvent,
	previewEventPassQr,
	recordEventScan,
	checkInUser,
	clearCheckIn,
} from "@/app/actions";
import { DEFAULT_EVENT_PASS_QR_TTL_MS } from "@hackkit/ui";
import { HackKitUIProvider } from "@hackkit/ui";
import type * as React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<HackKitUIProvider
			eventPassQrTtlMs={DEFAULT_EVENT_PASS_QR_TTL_MS}
			actions={{
				completeUserData,
				createEvent,
				updateEvent,
				deleteEvent,
				previewEventPassQr,
				recordEventScan,
				checkInUser,
				clearCheckIn,
			}}
		>
			{children}
		</HackKitUIProvider>
	);
}
