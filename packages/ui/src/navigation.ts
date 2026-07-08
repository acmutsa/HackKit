import type * as React from "react";

/**
 * App-owned route destinations used by HackKit UI for form success flows,
 * onboarding step links, and admin deep links.
 *
 * HackKit Web Apps customize these in one place (via HackKitUIProvider) so
 * route policy does not leak through the UI interface.
 */
export type HackKitUIRoutes = {
	onboarding: {
		hacktag: string;
		userData: string;
		hacker: string;
	};
	dashboard: string;
	admin: {
		events: string;
		eventEdit: (eventId: string) => string;
		eventScanner: (eventId: string) => string;
		userDetail: (authId: string) => string;
	};
};

export type HackKitUIRoutesInput = {
	onboarding?: Partial<HackKitUIRoutes["onboarding"]>;
	dashboard?: string;
	admin?: Partial<HackKitUIRoutes["admin"]>;
};

/** Default destinations matching the generated Next App Router layout. */
export const DEFAULT_HACKKIT_UI_ROUTES: HackKitUIRoutes = {
	onboarding: {
		hacktag: "/onboarding/hacktag",
		userData: "/onboarding/user-data",
		hacker: "/onboarding/hacker",
	},
	dashboard: "/dashboard",
	admin: {
		events: "/admin/events",
		eventEdit: (eventId) => `/admin/events/${eventId}/edit`,
		eventScanner: (eventId) => `/admin/scanner/${eventId}`,
		userDetail: (authId) =>
			`/admin/users/${encodeURIComponent(authId)}`,
	},
};

export function resolveHackKitUIRoutes(
	overrides?: HackKitUIRoutesInput,
): HackKitUIRoutes {
	if (!overrides) return DEFAULT_HACKKIT_UI_ROUTES;
	return {
		onboarding: {
			...DEFAULT_HACKKIT_UI_ROUTES.onboarding,
			...overrides.onboarding,
		},
		dashboard: overrides.dashboard ?? DEFAULT_HACKKIT_UI_ROUTES.dashboard,
		admin: {
			...DEFAULT_HACKKIT_UI_ROUTES.admin,
			...overrides.admin,
		},
	};
}

export type HackKitLinkProps = {
	href: string;
	className?: string;
	children: React.ReactNode;
};

/**
 * Navigation seam for HackKit UI: push, refresh, and link rendering.
 * The default adapter wraps Next.js App Router; apps may supply their own.
 */
export type HackKitNavigation = {
	push: (href: string) => void;
	refresh: () => void;
	Link: React.ComponentType<HackKitLinkProps>;
	routes: HackKitUIRoutes;
};
