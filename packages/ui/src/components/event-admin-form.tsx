"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
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

function FieldError({ message }: { message?: string }) {
	if (!message) return null;
	return <p className="text-sm font-medium text-destructive">{message}</p>;
}

function isValidDateTimeLocal(value: string): boolean {
	return value.length > 0 && !Number.isNaN(new Date(value).getTime());
}

function createEventFormSchema(eventTypes: EventAdminFormProps["eventTypes"]) {
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
				.refine(
					(value) => eventTypeValues.has(value),
					"Select a valid event type.",
				),
			host: z.string().max(255),
			hidden: z.boolean(),
		})
		.refine(
			({ startTime, endTime }) => {
				if (
					!isValidDateTimeLocal(startTime) ||
					!isValidDateTimeLocal(endTime)
				) {
					return true;
				}
				return new Date(startTime) < new Date(endTime);
			},
			{
				message: "Start time must be before end time.",
				path: ["startTime"],
			},
		);
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
	const schema = React.useMemo(
		() => createEventFormSchema(eventTypes),
		[eventTypes],
	);
	const form = useForm<EventFormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			...emptyDefaults,
			...defaultValues,
		},
	});

	async function handleSubmit(values: EventFormValues) {
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

	return (
		<form
			onSubmit={form.handleSubmit(handleSubmit)}
			className={cn("mx-auto max-w-2xl space-y-6", className)}
		>
			<div className="space-y-2">
				<Label htmlFor="title">Title</Label>
				<Input id="title" {...form.register("title")} />
				<FieldError message={form.formState.errors.title?.message} />
			</div>

			<div className="space-y-2">
				<Label htmlFor="description">Description</Label>
				<Textarea id="description" {...form.register("description")} />
				<FieldError
					message={form.formState.errors.description?.message}
				/>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<div className="space-y-2">
					<Label htmlFor="startTime">Start time</Label>
					<Input
						id="startTime"
						type="datetime-local"
						{...form.register("startTime")}
					/>
					<FieldError
						message={form.formState.errors.startTime?.message}
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="endTime">End time</Label>
					<Input
						id="endTime"
						type="datetime-local"
						{...form.register("endTime")}
					/>
					<FieldError
						message={form.formState.errors.endTime?.message}
					/>
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<div className="space-y-2">
					<Label htmlFor="location">Location</Label>
					<Input id="location" {...form.register("location")} />
					<FieldError
						message={form.formState.errors.location?.message}
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="type">Type</Label>
					<Select
						value={form.watch("type")}
						onValueChange={(value) =>
							form.setValue("type", value, {
								shouldValidate: true,
							})
						}
					>
						<SelectTrigger id="type">
							<SelectValue placeholder="Select a type" />
						</SelectTrigger>
						<SelectContent>
							{eventTypes.map((option) => (
								<SelectItem
									key={option.value}
									value={option.value}
								>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<FieldError message={form.formState.errors.type?.message} />
				</div>
			</div>

			<div className="space-y-2">
				<Label htmlFor="host">Host</Label>
				<Input id="host" {...form.register("host")} />
				<FieldError message={form.formState.errors.host?.message} />
			</div>

			<div className="flex items-center gap-2">
				<Checkbox
					id="hidden"
					checked={form.watch("hidden")}
					onCheckedChange={(checked) =>
						form.setValue("hidden", checked === true, {
							shouldValidate: true,
						})
					}
				/>
				<Label htmlFor="hidden">Hidden from public schedule</Label>
			</div>

			<Button type="submit" disabled={form.formState.isSubmitting}>
				{form.formState.isSubmitting ? "Saving..." : submitLabel}
			</Button>
		</form>
	);
}

export { toDateTimeLocalValue };
