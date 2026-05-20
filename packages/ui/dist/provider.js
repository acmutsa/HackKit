"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { Toaster } from "sonner";
const HackKitUIContext = React.createContext(null);
export function HackKitUIProvider({ actions, children }) {
	return _jsxs(HackKitUIContext.Provider, {
		value: { actions },
		children: [children, _jsx(Toaster, { richColors: true })],
	});
}
export function useHackKitUI() {
	const context = React.useContext(HackKitUIContext);
	if (!context) {
		throw new Error(
			"HackKit UI components must be rendered inside HackKitUIProvider.",
		);
	}
	return context;
}
//# sourceMappingURL=provider.js.map
