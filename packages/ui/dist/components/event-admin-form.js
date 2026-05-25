"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
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
function FieldError({ message }) {
    if (!message)
        return null;
    return _jsx("p", { className: "text-sm font-medium text-destructive", children: message });
}
function isValidDateTimeLocal(value) {
    return value.length > 0 && !Number.isNaN(new Date(value).getTime());
}
function createEventFormSchema(eventTypes) {
    const eventTypeValues = new Set(eventTypes.map((option) => option.value));
    return z
        .object({
        title: z.string().min(1, "Title is required.").max(255),
        description: z.string().min(1, "Description is required."),
        startTime: z
            .string()
            .refine(isValidDateTimeLocal, "Start time is required."),
        endTime: z
            .string()
            .refine(isValidDateTimeLocal, "End time is required."),
        location: z.string().min(1, "Location is required.").max(255),
        type: z
            .string()
            .min(1, "Type is required.")
            .refine((value) => eventTypeValues.has(value), "Select a valid event type."),
        host: z.string().max(255),
        hidden: z.boolean(),
    })
        .refine(({ startTime, endTime }) => {
        if (!isValidDateTimeLocal(startTime) ||
            !isValidDateTimeLocal(endTime)) {
            return true;
        }
        return new Date(startTime) < new Date(endTime);
    }, {
        message: "Start time must be before end time.",
        path: ["startTime"],
    });
}
export function EventAdminForm({ eventTypes, defaultValues, eventId, submitLabel = "Save event", successRedirectTo = "/admin/events", className, }) {
    const router = useRouter();
    const { actions } = useHackKitUI();
    const schema = React.useMemo(() => createEventFormSchema(eventTypes), [eventTypes]);
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            ...emptyDefaults,
            ...defaultValues,
        },
    });
    async function handleSubmit(values) {
        const result = eventId
            ? await actions.updateEvent(eventId, values)
            : await actions.createEvent(values);
        if (!result.ok) {
            toast.error(result.message);
            return;
        }
        toast.success(eventId ? "Event updated." : "Event created.");
        router.push(successRedirectTo);
        router.refresh();
    }
    return (_jsxs("form", { onSubmit: form.handleSubmit(handleSubmit), className: cn("mx-auto max-w-2xl space-y-6", className), children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "title", children: "Title" }), _jsx(Input, { id: "title", ...form.register("title") }), _jsx(FieldError, { message: form.formState.errors.title?.message })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "description", children: "Description" }), _jsx(Textarea, { id: "description", ...form.register("description") }), _jsx(FieldError, { message: form.formState.errors.description?.message })] }), _jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "startTime", children: "Start time" }), _jsx(Input, { id: "startTime", type: "datetime-local", ...form.register("startTime") }), _jsx(FieldError, { message: form.formState.errors.startTime?.message })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "endTime", children: "End time" }), _jsx(Input, { id: "endTime", type: "datetime-local", ...form.register("endTime") }), _jsx(FieldError, { message: form.formState.errors.endTime?.message })] })] }), _jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "location", children: "Location" }), _jsx(Input, { id: "location", ...form.register("location") }), _jsx(FieldError, { message: form.formState.errors.location?.message })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "type", children: "Type" }), _jsxs(Select, { value: form.watch("type"), onValueChange: (value) => form.setValue("type", value, {
                                    shouldValidate: true,
                                }), children: [_jsx(SelectTrigger, { id: "type", children: _jsx(SelectValue, { placeholder: "Select a type" }) }), _jsx(SelectContent, { children: eventTypes.map((option) => (_jsx(SelectItem, { value: option.value, children: option.label }, option.value))) })] }), _jsx(FieldError, { message: form.formState.errors.type?.message })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "host", children: "Host" }), _jsx(Input, { id: "host", ...form.register("host") }), _jsx(FieldError, { message: form.formState.errors.host?.message })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Checkbox, { id: "hidden", checked: form.watch("hidden"), onCheckedChange: (checked) => form.setValue("hidden", checked === true, {
                            shouldValidate: true,
                        }) }), _jsx(Label, { htmlFor: "hidden", children: "Hidden from public schedule" })] }), _jsx(Button, { type: "submit", disabled: form.formState.isSubmitting, children: form.formState.isSubmitting ? "Saving..." : submitLabel })] }));
}
export { toDateTimeLocalValue };
//# sourceMappingURL=event-admin-form.js.map