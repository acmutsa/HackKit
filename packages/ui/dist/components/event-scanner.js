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
export function EventScanner({ event, targetUser, priorScans, qrIssuedAt, className, onDone, }) {
    const router = useRouter();
    const pathname = usePathname();
    const { actions } = useHackKitUI();
    const [loading, setLoading] = React.useState(false);
    const showDrawer = targetUser !== null;
    async function handleConfirmScan() {
        if (!targetUser || !qrIssuedAt)
            return;
        setLoading(true);
        const result = await actions.recordEventScan({
            eventId: event.id,
            targetAuthId: targetUser.authId,
            qrIssuedAt,
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
        onDone?.();
        router.refresh();
    }
    return (_jsxs("div", { className: cn("mx-auto flex w-full max-w-lg flex-col gap-6", className), children: [_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: event.title }), _jsx(CardDescription, { children: "Scan a participant's Event Pass QR code." })] }), _jsx(CardContent, { children: _jsx("div", { className: "aspect-square w-full overflow-hidden rounded-lg border", children: _jsx(Scanner, { onScan: (results) => {
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
                                } }) }) })] }), showDrawer ? (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { children: [targetUser.firstName, " ", targetUser.lastName] }), _jsx(CardDescription, { children: targetUser.email })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsx("p", { className: "text-sm", children: targetUser.checkedInAt
                                    ? "Checked in to the hackathon."
                                    : "Not checked in yet." }), priorScans.length > 0 ? (_jsxs("div", { className: "rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900", children: [_jsxs("p", { className: "font-medium", children: ["Already scanned ", priorScans.length, " ", priorScans.length === 1 ? "time" : "times", " for this event."] }), _jsx("p", { className: "mt-1", children: "You can still record another scan if needed." })] })) : null, _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { type: "button", onClick: handleConfirmScan, disabled: loading, children: loading ? "Saving..." : "Confirm scan" }), _jsx(Button, { type: "button", variant: "outline", onClick: () => {
                                            onDone?.();
                                            router.replace(pathname);
                                        }, children: "Cancel" })] })] })] })) : null] }));
}
//# sourceMappingURL=event-scanner.js.map