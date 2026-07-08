import { hackKitUIActions } from "@hackkit/next";
import { HackKitUIProvider } from "@hackkit/ui";
import type * as React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<HackKitUIProvider actions={hackKitUIActions}>
			{children}
		</HackKitUIProvider>
	);
}
