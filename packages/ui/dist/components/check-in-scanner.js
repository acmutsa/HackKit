"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { parseEventPassQrPayload } from "@hackkit/core";
import { Scanner } from "@yudiel/react-qr-scanner";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "../lib/cn";
import { useHackKitUI } from "../provider";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "./ui/card";
export function CheckInScanner({ targetUser, qrIssuedAt, className, onDone, }) {
    const router = useRouter();
    const pathname = usePathname();
    const { actions } = useHackKitUI();
    const [loading, setLoading] = React.useState(false);
    const showDrawer = targetUser !== null;
    async function handleCheckIn() {
        if (!targetUser || !qrIssuedAt)
            return;
        setLoading(true);
        const result = await actions.checkInUser({
            targetAuthId: targetUser.authId,
            qrIssuedAt,
        });
        setLoading(false);
        if (!result.ok) {
            toast.error(result.message);
            return;
        }
        toast.success("Participant checked in.");
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
        onDone?.();
        router.refresh();
    }
    return (_jsxs("div", { className: cn("mx-auto flex w-full max-w-lg flex-col gap-6", className), children: [_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Hackathon Check-in" }), _jsx(CardDescription, { children: "Scan a participant's Event Pass QR code once at arrival." })] }), _jsx(CardContent, { children: _jsx("div", { className: "aspect-square w-full overflow-hidden rounded-lg border", children: _jsx(Scanner, { onScan: (results) => {
                                    if (showDrawer || results.length === 0)
                                        return;
                                    try {
                                        const parsed = parseEventPassQrPayload(results[0].rawValue);
                                        const params = new URLSearchParams({
                                            user: parsed.authId,
                                            qrIssuedAt: String(parsed.qrIssuedAt.getTime()),
                                        });
                                        router.replace(`?${params.toString()}`);
                                    }
                                    catch (error) {
                                        toast.error(error instanceof Error
                                            ? error.message
                                            : "Invalid QR code.");
                                    }
                                } }) }) })] }), showDrawer ? (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { children: [targetUser.firstName, " ", targetUser.lastName] }), _jsx(CardDescription, { children: targetUser.email })] }), _jsx(CardContent, { className: "space-y-4", children: targetUser.checkedInAt ? (_jsxs("div", { className: "space-y-3", children: [_jsx("p", { className: "text-sm font-medium text-emerald-700", children: "Already checked in." }), _jsx(Button, { type: "button", variant: "outline", onClick: handleClearCheckIn, disabled: loading, children: "Clear check-in" })] })) : (_jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { type: "button", onClick: handleCheckIn, disabled: loading, children: loading ? "Saving..." : "Check in" }), _jsx(Button, { type: "button", variant: "outline", onClick: () => {
                                        onDone?.();
                                        router.replace(pathname);
                                    }, children: "Cancel" })] })) })] })) : null] }));
}
//# sourceMappingURL=check-in-scanner.js.map