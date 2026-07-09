import { HackKitUIProvider } from "@hackkit/ui";
import type * as React from "react";
import { hackKitUIActions } from "./_hackkit/ui-action-map";

/**
 * Wires Core mutations through HackKit actions. Those actions import the app
 * runtime before resolving a mutation, which is required for Server
 * Action requests that do not execute a page module first.
 *
 * Do not pass `DEFAULT_HACKKIT_UI_ROUTES` (or any map with route builder
 * functions) from this Server Component — those builders are not serializable.
 * Omit `routes` to use the client-side defaults, or pass only string overrides.
 * For custom admin builders, supply a client `navigation` adapter instead.
 */
export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<HackKitUIProvider actions={hackKitUIActions}>
			{children}
		</HackKitUIProvider>
	);
}
