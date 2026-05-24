import * as React from "react";
import type { HackKitUIActions } from "./types";
type HackKitUIContextValue = {
    actions: HackKitUIActions;
    eventPassQrTtlMs: number;
};
export type HackKitUIProviderProps = {
    actions: HackKitUIActions;
    eventPassQrTtlMs?: number;
    children: React.ReactNode;
};
export declare function HackKitUIProvider({ actions, eventPassQrTtlMs, children, }: HackKitUIProviderProps): import("react/jsx-runtime").JSX.Element;
export declare function useHackKitUI(): HackKitUIContextValue;
export {};
//# sourceMappingURL=provider.d.ts.map