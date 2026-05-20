import type * as React from "react";
import { HackKitUIProvider } from "@hackkit/ui";
import { completeUserData } from "./actions";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<HackKitUIProvider actions={{ completeUserData }}>
			{children}
		</HackKitUIProvider>
	);
}
