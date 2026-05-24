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
export function CheckInScanner({ className, onDone }) {
    const router = useRouter();
    const { actions } = useHackKitUI();
    const [loading, setLoading] = React.useState(false);
    const [rawQr, setRawQr] = React.useState(null);
    const [targetUser, setTargetUser] = React.useState(null);
    async function handleScan(rawValue) {
        if (rawQr)
            return;
        setLoading(true);
        const result = await actions.previewEventPassQr({ rawQr: rawValue });
        setLoading(false);
        if (!result.ok) {
            toast.error(result.message);
            return;
        }
        setRawQr(rawValue);
        setTargetUser(result.data.user);
    }
    async function handleCheckIn() {
        if (!rawQr)
            return;
        setLoading(true);
        const result = await actions.checkInUser({ rawQr });
        setLoading(false);
        if (!result.ok) {
            toast.error(result.message);
            return;
        }
        toast.success("Participant checked in.");
        setRawQr(null);
        setTargetUser(null);
        onDone?.();
        router.refresh();
    }
    async function handleClearCheckIn() {
        if (!targetUser)
            return;
        setLoading(true);
        const result = await actions.clearCheckIn(targetUser.authId);
        setLoading(false);
        if (!result.ok) {
            toast.error(result.message);
            return;
        }
        toast.success("Check-in cleared.");
        setRawQr(null);
        setTargetUser(null);
        onDone?.();
        router.refresh();
    }
    return (_jsxs("div", { className: cn("mx-auto flex w-full max-w-lg flex-col gap-6", className), children: [_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Hackathon Check-in" }), _jsx(CardDescription, { children: "Scan a participant's Event Pass QR code once at arrival." })] }), _jsx(CardContent, { children: _jsx("div", { className: "aspect-square w-full overflow-hidden rounded-lg border", children: _jsx(Scanner, { onScan: (results) => {
                                    if (rawQr || results.length === 0)
                                        return;
                                    void handleScan(results[0].rawValue);
                                } }) }) })] }), targetUser ? (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { children: [targetUser.firstName, " ", targetUser.lastName] }), _jsx(CardDescription, { children: targetUser.email })] }), _jsx(CardContent, { className: "space-y-4", children: targetUser.checkedInAt ? (_jsxs("div", { className: "space-y-3", children: [_jsx("p", { className: "text-sm font-medium text-emerald-700", children: "Already checked in." }), _jsx(Button, { type: "button", variant: "outline", onClick: handleClearCheckIn, disabled: loading, children: "Clear check-in" })] })) : (_jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { type: "button", onClick: handleCheckIn, disabled: loading, children: loading ? "Saving..." : "Check in" }), _jsx(Button, { type: "button", variant: "outline", onClick: () => {
                                        setRawQr(null);
                                        setTargetUser(null);
                                        onDone?.();
                                    }, children: "Cancel" })] })) })] })) : null] }));
}
//# sourceMappingURL=check-in-scanner.js.map