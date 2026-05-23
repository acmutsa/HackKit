import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../lib/cn";
function getEventTypeColor(eventTypes, type) {
    return eventTypes.find((option) => option.value === type)?.color ?? "#795548";
}
function getEventTypeLabel(eventTypes, type) {
    return eventTypes.find((option) => option.value === type)?.label ?? type;
}
function formatDateTime(value) {
    return new Intl.DateTimeFormat(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(value);
}
export function ScheduleList({ events, eventTypes, className, }) {
    if (events.length === 0) {
        return (_jsx("p", { className: cn("text-sm text-muted-foreground", className), children: "No events scheduled yet." }));
    }
    return (_jsx("ul", { className: cn("space-y-4", className), children: events.map((event) => (_jsxs("li", { className: "rounded-lg border bg-card p-4 shadow-sm", children: [_jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("h2", { className: "text-lg font-semibold", children: event.title }), _jsxs("p", { className: "text-sm text-muted-foreground", children: [formatDateTime(event.startTime), " \u2013", " ", formatDateTime(event.endTime)] }), _jsx("p", { className: "text-sm", children: event.location })] }), _jsx("span", { className: "rounded-full px-3 py-1 text-xs font-medium text-white", style: {
                                backgroundColor: getEventTypeColor(eventTypes, event.type),
                            }, children: getEventTypeLabel(eventTypes, event.type) })] }), event.host ? (_jsxs("p", { className: "mt-2 text-sm text-muted-foreground", children: ["Host: ", event.host] })) : null, _jsx("p", { className: "mt-3 text-sm", children: event.description })] }, event.id))) }));
}
//# sourceMappingURL=schedule-list.js.map