"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "../lib/cn";
import { useHackKitUI } from "../provider";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "./ui/select";
import { Textarea } from "./ui/textarea";
const emptyDefaults = {
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    location: "TBD",
    type: "",
    host: "",
    hidden: false,
};
function toDateTimeLocalValue(value) {
    const offset = value.getTimezoneOffset();
    const local = new Date(value.getTime() - offset * 60_000);
    return local.toISOString().slice(0, 16);
}
export function EventAdminForm({ eventTypes, defaultValues, eventId, submitLabel = "Save event", successRedirectTo = "/admin/events", className, }) {
    const router = useRouter();
    const { actions } = useHackKitUI();
    const [loading, setLoading] = React.useState(false);
    const [values, setValues] = React.useState({
        ...emptyDefaults,
        ...defaultValues,
    });
    function updateField(key, value) {
        setValues((current) => ({ ...current, [key]: value }));
    }
    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        const result = eventId
            ? await actions.updateEvent(eventId, values)
            : await actions.createEvent(values);
        setLoading(false);
        if (!result.ok) {
            toast.error(result.message);
            return;
        }
        toast.success(eventId ? "Event updated." : "Event created.");
        router.push(successRedirectTo);
        router.refresh();
    }
    return (_jsxs("form", { onSubmit: handleSubmit, className: cn("mx-auto max-w-2xl space-y-6", className), children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "title", children: "Title" }), _jsx(Input, { id: "title", value: values.title, onChange: (event) => updateField("title", event.target.value), required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "description", children: "Description" }), _jsx(Textarea, { id: "description", value: values.description, onChange: (event) => updateField("description", event.target.value), required: true })] }), _jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "startTime", children: "Start time" }), _jsx(Input, { id: "startTime", type: "datetime-local", value: values.startTime, onChange: (event) => updateField("startTime", event.target.value), required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "endTime", children: "End time" }), _jsx(Input, { id: "endTime", type: "datetime-local", value: values.endTime, onChange: (event) => updateField("endTime", event.target.value), required: true })] })] }), _jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "location", children: "Location" }), _jsx(Input, { id: "location", value: values.location, onChange: (event) => updateField("location", event.target.value), required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "type", children: "Type" }), _jsxs(Select, { value: values.type, onValueChange: (value) => updateField("type", value), children: [_jsx(SelectTrigger, { id: "type", children: _jsx(SelectValue, { placeholder: "Select a type" }) }), _jsx(SelectContent, { children: eventTypes.map((option) => (_jsx(SelectItem, { value: option.value, children: option.label }, option.value))) })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "host", children: "Host" }), _jsx(Input, { id: "host", value: values.host, onChange: (event) => updateField("host", event.target.value) })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Checkbox, { id: "hidden", checked: values.hidden, onCheckedChange: (checked) => updateField("hidden", checked === true) }), _jsx(Label, { htmlFor: "hidden", children: "Hidden from public schedule" })] }), _jsx(Button, { type: "submit", disabled: loading, children: loading ? "Saving..." : submitLabel })] }));
}
export { toDateTimeLocalValue };
//# sourceMappingURL=event-admin-form.js.map