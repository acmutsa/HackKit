"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "../lib/cn";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "./ui/card";
export function EventPass({ user, qrPayload, onRefreshQr, className, }) {
    return (_jsxs(Card, { className: cn("mx-auto w-full max-w-md", className), children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Event Pass" }), _jsx(CardDescription, { children: "Show this code to volunteers at events and check-in." })] }), _jsxs(CardContent, { className: "space-y-6", children: [_jsxs("div", { className: "space-y-1 text-center", children: [_jsxs("p", { className: "text-lg font-semibold", children: [user.firstName, " ", user.lastName] }), _jsx("p", { className: "text-sm text-muted-foreground", children: user.email }), user.checkedInAt ? (_jsx("p", { className: "text-sm font-medium text-emerald-600", children: "Checked in" })) : (_jsx("p", { className: "text-sm text-muted-foreground", children: "Not checked in" }))] }), _jsx("div", { className: "flex justify-center rounded-lg border bg-white p-4", children: _jsx(QRCodeSVG, { value: qrPayload, size: 220 }) }), _jsx(Button, { type: "button", className: "w-full", onClick: onRefreshQr, children: "Refresh QR code" })] })] }));
}
//# sourceMappingURL=event-pass.js.map