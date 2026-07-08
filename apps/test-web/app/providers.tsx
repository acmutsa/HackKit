import { hackKitUIActions } from "@hackkit/next";
import { HackKitUIProvider } from "@hackkit/ui";
import type * as React from "react";

/**
 * Wires Core mutations via `hackKitUIActions` from `@hackkit/next`.
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
