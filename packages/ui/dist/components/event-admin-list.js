import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from "next/link";
import { cn } from "../lib/cn";
function getEventTypeLabel(eventTypes, type) {
    return eventTypes.find((option) => option.value === type)?.label ?? type;
}
export function EventAdminList({ events, eventTypes, className, }) {
    if (events.length === 0) {
        return (_jsx("p", { className: cn("text-sm text-muted-foreground", className), children: "No events yet." }));
    }
    return (_jsx("div", { className: cn("overflow-x-auto rounded-lg border", className), children: _jsxs("table", { className: "min-w-full text-sm", children: [_jsx("thead", { className: "bg-muted/50 text-left", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3 font-medium", children: "Title" }), _jsx("th", { className: "px-4 py-3 font-medium", children: "Type" }), _jsx("th", { className: "px-4 py-3 font-medium", children: "Start" }), _jsx("th", { className: "px-4 py-3 font-medium", children: "Hidden" }), _jsx("th", { className: "px-4 py-3 font-medium", children: "Actions" })] }) }), _jsx("tbody", { children: events.map((event) => (_jsxs("tr", { className: "border-t", children: [_jsx("td", { className: "px-4 py-3", children: event.title }), _jsx("td", { className: "px-4 py-3", children: getEventTypeLabel(eventTypes, event.type) }), _jsx("td", { className: "px-4 py-3", children: event.startTime.toLocaleString() }), _jsx("td", { className: "px-4 py-3", children: event.hidden ? "Yes" : "No" }), _jsx("td", { className: "px-4 py-3", children: _jsxs("div", { className: "flex gap-3", children: [_jsx(Link, { href: `/admin/events/${event.id}/edit`, className: "text-primary hover:underline", children: "Edit" }), _jsx(Link, { href: `/admin/scanner/${event.id}`, className: "text-primary hover:underline", children: "Scanner" })] }) })] }, event.id))) })] }) }));
}
//# sourceMappingURL=event-admin-list.js.map