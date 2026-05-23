import type * as React from "react";
import { HackKitUIProvider } from "@hackkit/ui";
import {
	checkInUser,
	clearCheckIn,
	completeUserData,
	createEvent,
	deleteEvent,
	recordEventScan,
	updateEvent,
} from "./actions";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<HackKitUIProvider
			actions={{
				completeUserData,
				createEvent,
				updateEvent,
				deleteEvent,
				recordEventScan,
				checkInUser,
				clearCheckIn,
			}}
		>
			{children}
		</HackKitUIProvider>
	);
}
