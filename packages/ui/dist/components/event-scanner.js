"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { cn } from "../lib/cn";
import { useHackKitUI } from "../provider";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "./ui/card";
export function EventScanner({ event, className, onDone }) {
    const router = useRouter();
    const { actions } = useHackKitUI();
    const [loading, setLoading] = React.useState(false);
    const [rawQr, setRawQr] = React.useState(null);
    const [targetUser, setTargetUser] = React.useState(null);
    const [priorScans, setPriorScans] = React.useState([]);
    async function handleScan(rawValue) {
        if (rawQr)
            return;
        setLoading(true);
        const result = await actions.previewEventPassQr({
            rawQr: rawValue,
            eventId: event.id,
        });
        setLoading(false);
        if (!result.ok) {
            toast.error(result.message);
            return;
        }
        setRawQr(rawValue);
        setTargetUser(result.data.user);
        setPriorScans(result.data.priorScans);
    }
    async function handleConfirmScan() {
        if (!rawQr)
            return;
        setLoading(true);
        const result = await actions.recordEventScan({
            eventId: event.id,
            rawQr,
        });
        setLoading(false);
        if (!result.ok) {
            toast.error(result.message);
            return;
        }
        if (result.data?.hadPriorScans) {
            toast.success("Additional scan recorded.");
        }
        else {
            toast.success("Scan recorded.");
        }
        setRawQr(null);
        setTargetUser(null);
        setPriorScans([]);
        onDone?.();
        router.refresh();
    }
    return (_jsxs("div", { className: cn("mx-auto flex w-full max-w-lg flex-col gap-6", className), children: [_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: event.title }), _jsx(CardDescription, { children: event.location })] }), _jsx(CardContent, { children: _jsx("div", { className: "aspect-square w-full overflow-hidden rounded-lg border", children: _jsx(Scanner, { onScan: (results) => {
                                    if (rawQr || results.length === 0)
                                        return;
                                    void handleScan(results[0].rawValue);
                                } }) }) })] }), targetUser ? (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { children: [targetUser.firstName, " ", targetUser.lastName] }), _jsx(CardDescription, { children: targetUser.email })] }), _jsxs(CardContent, { className: "space-y-4", children: [priorScans.length > 0 ? (_jsxs("p", { className: "text-sm font-medium text-amber-700", children: ["This participant was already scanned ", priorScans.length, " ", "time", priorScans.length === 1 ? "" : "s", " for this event."] })) : null, _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { type: "button", onClick: handleConfirmScan, disabled: loading, children: loading ? "Saving..." : "Record scan" }), _jsx(Button, { type: "button", variant: "outline", onClick: () => {
                                            setRawQr(null);
                                            setTargetUser(null);
                                            setPriorScans([]);
                                            onDone?.();
                                        }, children: "Cancel" })] })] })] })) : null] }));
}
//# sourceMappingURL=event-scanner.js.map