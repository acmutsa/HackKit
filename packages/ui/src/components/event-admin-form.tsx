"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "../lib/cn";
import { useHackKitUI } from "../provider";
import type { EventAdminFormProps, EventFormValues } from "../types";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

const emptyDefaults: EventFormValues = {
	title: "",
	description: "",
	startTime: "",
	endTime: "",
	location: "TBD",
	type: "",
	host: "",
	hidden: false,
};

function toDateTimeLocalValue(value: Date): string {
	const offset = value.getTimezoneOffset();
	const local = new Date(value.getTime() - offset * 60_000);
	return local.toISOString().slice(0, 16);
}

export function EventAdminForm({
	eventTypes,
	defaultValues,
	eventId,
	submitLabel = "Save event",
	successRedirectTo = "/admin/events",
	className,
}: EventAdminFormProps) {
	const router = useRouter();
	const { actions } = useHackKitUI();
	const [loading, setLoading] = React.useState(false);
	const [values, setValues] = React.useState<EventFormValues>({
		...emptyDefaults,
		...defaultValues,
	});

	function updateField<K extends keyof EventFormValues>(
		key: K,
		value: EventFormValues[K],
	) {
		setValues((current) => ({ ...current, [key]: value }));
	}

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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

	return (
		<form
			onSubmit={handleSubmit}
			className={cn("mx-auto max-w-2xl space-y-6", className)}
		>
			<div className="space-y-2">
				<Label htmlFor="title">Title</Label>
				<Input
					id="title"
					value={values.title}
					onChange={(event) => updateField("title", event.target.value)}
					required
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="description">Description</Label>
				<Textarea
					id="description"
					value={values.description}
					onChange={(event) =>
						updateField("description", event.target.value)
					}
					required
				/>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<div className="space-y-2">
					<Label htmlFor="startTime">Start time</Label>
					<Input
						id="startTime"
						type="datetime-local"
						value={values.startTime}
						onChange={(event) =>
							updateField("startTime", event.target.value)
						}
						required
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="endTime">End time</Label>
					<Input
						id="endTime"
						type="datetime-local"
						value={values.endTime}
						onChange={(event) =>
							updateField("endTime", event.target.value)
						}
						required
					/>
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<div className="space-y-2">
					<Label htmlFor="location">Location</Label>
					<Input
						id="location"
						value={values.location}
						onChange={(event) =>
							updateField("location", event.target.value)
						}
						required
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="type">Type</Label>
					<Select
						value={values.type}
						onValueChange={(value) => updateField("type", value)}
					>
						<SelectTrigger id="type">
							<SelectValue placeholder="Select a type" />
						</SelectTrigger>
						<SelectContent>
							{eventTypes.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="space-y-2">
				<Label htmlFor="host">Host</Label>
				<Input
					id="host"
					value={values.host}
					onChange={(event) => updateField("host", event.target.value)}
				/>
			</div>

			<div className="flex items-center gap-2">
				<Checkbox
					id="hidden"
					checked={values.hidden}
					onCheckedChange={(checked) =>
						updateField("hidden", checked === true)
					}
				/>
				<Label htmlFor="hidden">Hidden from public schedule</Label>
			</div>

			<Button type="submit" disabled={loading}>
				{loading ? "Saving..." : submitLabel}
			</Button>
		</form>
	);
}

export { toDateTimeLocalValue };
