"use client";

import { HackKitUIProvider } from "@hackkit/ui";
import type * as React from "react";
import { createHackkitUIActionsClient } from "@hackkit/next/client";

/**
 * Core UI actions use the typed Better Call client. Authentication stays in
 * the incoming cookie request handled by `/api/hackkit`; no Server Action
 * references or app-maintained action map are serialized to the browser.
 *
 * Do not pass `DEFAULT_HACKKIT_UI_ROUTES` (or any map with route builder
 * functions) through this Client Component — those builders are not serializable.
 * Omit `routes` to use the client-side defaults, or pass only string overrides.
 * For custom admin builders, supply a client `navigation` adapter instead.
 */
export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<HackKitUIProvider actions={createHackkitUIActionsClient()}>
			{children}
		</HackKitUIProvider>
	);
}
