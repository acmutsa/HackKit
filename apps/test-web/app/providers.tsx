import { hackKitUIActions } from "@hackkit/next";
import { hackKitUIRoutes } from "@/lib/hackkit-ui-routes";
import { HackKitUIProvider } from "@hackkit/ui";
import type * as React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<HackKitUIProvider
			routes={hackKitUIRoutes}
			actions={hackKitUIActions}
		>
			{children}
		</HackKitUIProvider>
	);
}
