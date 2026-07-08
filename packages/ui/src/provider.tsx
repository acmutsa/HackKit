"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";
import { DefaultHackKitLink } from "./components/default-hackkit-link";
import { DEFAULT_EVENT_PASS_QR_TTL_MS } from "./event-pass";
import {
	resolveHackKitUIRoutes,
	type HackKitNavigation,
	type HackKitUIRoutesInput,
} from "./navigation";
import type { HackKitUIActions } from "./types";

type HackKitUIContextValue = {
	actions: HackKitUIActions;
	navigation: HackKitNavigation;
	eventPassQrTtlMs: number;
};

const HackKitUIContext = React.createContext<HackKitUIContextValue | null>(
	null,
);

export type HackKitUIProviderProps = {
	actions: HackKitUIActions;
	/**
	 * Full navigation adapter override. When omitted, HackKit UI uses the
	 * default Next.js App Router adapter with {@link routes} (or defaults).
	 */
	navigation?: HackKitNavigation;
	/**
	 * Partial route map override for the default Next adapter. Ignored when
	 * {@link navigation} is provided (pass routes on that object instead).
	 */
	routes?: HackKitUIRoutesInput;
	eventPassQrTtlMs?: number;
	children: React.ReactNode;
};

type ProviderShellProps = {
	actions: HackKitUIActions;
	navigation: HackKitNavigation;
	eventPassQrTtlMs: number;
	children: React.ReactNode;
};

function HackKitUIProviderShell({
	actions,
	navigation,
	eventPassQrTtlMs,
	children,
}: ProviderShellProps) {
	return (
		<HackKitUIContext.Provider
			value={{ actions, navigation, eventPassQrTtlMs }}
		>
			{children}
			<Toaster richColors />
		</HackKitUIContext.Provider>
	);
}

function HackKitUIProviderWithDefaultNavigation({
	actions,
	routes,
	eventPassQrTtlMs,
	children,
}: Omit<HackKitUIProviderProps, "navigation">) {
	const router = useRouter();
	const resolvedRoutes = React.useMemo(
		() => resolveHackKitUIRoutes(routes),
		[routes],
	);

	const navigation = React.useMemo(
		(): HackKitNavigation => ({
			push: (href) => {
				void router.push(href);
			},
			refresh: () => {
				router.refresh();
			},
			Link: DefaultHackKitLink,
			routes: resolvedRoutes,
		}),
		[resolvedRoutes, router],
	);

	return (
		<HackKitUIProviderShell
			actions={actions}
			navigation={navigation}
			eventPassQrTtlMs={eventPassQrTtlMs ?? DEFAULT_EVENT_PASS_QR_TTL_MS}
		>
			{children}
		</HackKitUIProviderShell>
	);
}

export function HackKitUIProvider({
	actions,
	navigation,
	routes,
	eventPassQrTtlMs = DEFAULT_EVENT_PASS_QR_TTL_MS,
	children,
}: HackKitUIProviderProps) {
	if (navigation) {
		return (
			<HackKitUIProviderShell
				actions={actions}
				navigation={navigation}
				eventPassQrTtlMs={eventPassQrTtlMs}
			>
				{children}
			</HackKitUIProviderShell>
		);
	}

	return (
		<HackKitUIProviderWithDefaultNavigation
			actions={actions}
			routes={routes}
			eventPassQrTtlMs={eventPassQrTtlMs}
		>
			{children}
		</HackKitUIProviderWithDefaultNavigation>
	);
}

export function useHackKitUI(): HackKitUIContextValue {
	const context = React.useContext(HackKitUIContext);
	if (!context) {
		throw new Error(
			"HackKit UI components must be rendered inside HackKitUIProvider.",
		);
	}
	return context;
}

/** Convenience hook for the navigation seam only. */
export function useHackKitNavigation(): HackKitNavigation {
	return useHackKitUI().navigation;
}
