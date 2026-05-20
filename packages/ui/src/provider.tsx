"use client";

import * as React from "react";
import { Toaster } from "sonner";
import type { HackKitUIActions } from "./types";

type HackKitUIContextValue = {
	actions: HackKitUIActions;
};

const HackKitUIContext = React.createContext<HackKitUIContextValue | null>(
	null,
);

export type HackKitUIProviderProps = {
	actions: HackKitUIActions;
	children: React.ReactNode;
};

export function HackKitUIProvider({
	actions,
	children,
}: HackKitUIProviderProps) {
	return (
		<HackKitUIContext.Provider value={{ actions }}>
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
