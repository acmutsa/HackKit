"use client";

import * as React from "react";
import { Toaster } from "sonner";
import { DEFAULT_EVENT_PASS_QR_TTL_MS } from "./event-pass";
import type { HackKitUIActions } from "./types";

type HackKitUIContextValue = {
	actions: HackKitUIActions;
	eventPassQrTtlMs: number;
};

const HackKitUIContext = React.createContext<HackKitUIContextValue | null>(
	null,
);

export type HackKitUIProviderProps = {
	actions: HackKitUIActions;
	eventPassQrTtlMs?: number;
	children: React.ReactNode;
};

export function HackKitUIProvider({
	actions,
	eventPassQrTtlMs = DEFAULT_EVENT_PASS_QR_TTL_MS,
	children,
}: HackKitUIProviderProps) {
	return (
		<HackKitUIContext.Provider value={{ actions, eventPassQrTtlMs }}>
			{children}
			<Toaster richColors />
		</HackKitUIContext.Provider>
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
