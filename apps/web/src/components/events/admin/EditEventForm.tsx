"use client";

import { useForm } from "react-hook-form";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormDescription,
	FormMessage,
} from "@/components/shadcn/ui/form";
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectValue,
} from "@/components/shadcn/ui/select";
import { Input } from "@/components/shadcn/ui/input";
import { Button } from "@/components/shadcn/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/shadcn/ui/textarea";
import c from "config";
import { DateTimePicker } from "@/components/shadcn/ui/date-time-picker/date-time-picker";
import { parseAbsolute, getLocalTimeZone } from "@internationalized/date";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { ONE_HOUR_IN_MILLISECONDS } from "@/lib/constants";
import { type eventEditType } from "@/lib/types/events";
import { newEventFormSchema } from "@/validators/event";
import { ThreeCircles } from "react-loader-spinner";
import { useAction } from "next-safe-action/hooks";
import { editEvent } from "@/actions/admin/event-actions";
import { toast } from "sonner";

export default function EditEventForm({
	id,
	title,
	description,
	type,
	host,
	endTime,
	points,
	startTime,
	location,
}: eventEditType & { id: number }) {
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const userLocalTimeZone = getLocalTimeZone();
	const { execute } = useAction(editEvent, {
		onExecute: () => setLoading(true),
		onSettled: () => setLoading(false),
		onSuccess: () => {
			alert("Event Edited Successfully! Redirecting to event page...");
			router.push("/admin/events");
		},
		onError: ({ error }) => {
			let description: string;

			if (error.validationErrors?._errors) {
				// User is not super admin
				description = error.validationErrors._errors[0];
			} else {
				description = error.serverError || "An unknown error occurred";
			}

			toast.error("Unable to edit event", { description });
		},
	});

	const form = useForm<z.infer<typeof newEventFormSchema>>({
		resolver: zodResolver(newEventFormSchema),
		defaultValues: {
			id,
			title,
			description,
			type: type as any,
			host,
			startTime,
			points,
			location,
			endTime,
		},
	});

	const onSubmit = useCallback(
		(values: z.infer<typeof newEventFormSchema>) => {
			if (form.formState.isDirty) {
				execute(values);
			} else {
				toast.error("Failed to edit event", {
					description:
						"Please make changes to the form before submitting it!",
				});
			}
		},
		[form.formState.isDirty],
	);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormDescription>
								Keep title short and concise
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="location"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Location</FormLabel>
							<FormControl>
								<Input
									{...field}
									value={field.value ?? "TBD"}
								/>
							</FormControl>
							{/* <FormDescription>
								Keep title short and concise
							</FormDescription> */}
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="grid grid-cols-2 gap-x-2">
					<FormField
						control={form.control}
						name="type"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Event Type</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Select a Event Type" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectGroup>
											{Object.keys(c.eventTypes).map(
												(type) => (
													<SelectItem
														key={type}
														value={type}
													>
														{type}
													</SelectItem>
												),
											)}
										</SelectGroup>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="host"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Host (Optional)</FormLabel>
								<FormControl>
									<Input
										placeholder={c.hackathonName}
										{...(field as any)}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="grid grid-cols-2 gap-x-2">
					<FormField
						control={form.control}
						name="startTime"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Event Start</FormLabel>
								<DateTimePicker
									value={
										field.value
											? parseAbsolute(
													field.value.toISOString(),
													userLocalTimeZone,
												)
											: null
									}
									onChange={(date) => {
										const newDate = date
											? date.toDate(userLocalTimeZone)
											: null;
										field.onChange(newDate);
										const isEventStartBeforeEnd =
											newDate &&
											newDate > form.getValues("endTime");
										if (isEventStartBeforeEnd) {
											form.setValue(
												"endTime",
												new Date(
													newDate.getTime() +
														ONE_HOUR_IN_MILLISECONDS,
												),
											);
										}
									}}
									shouldCloseOnSelect={false}
									granularity={"minute"}
									label="Event Start"
								/>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="endTime"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Event End</FormLabel>
								<DateTimePicker
									value={
										!!field.value
											? parseAbsolute(
													field.value.toISOString(),
													userLocalTimeZone,
												)
											: null
									}
									onChange={(date) => {
										const newDate = !!date
											? date.toDate(userLocalTimeZone)
											: null;
										field.onChange(newDate);
										const isEventEndBeforeStart =
											newDate &&
											newDate <
												form.getValues("startTime");
										if (isEventEndBeforeStart) {
											form.setValue(
												"startTime",
												new Date(
													newDate.getTime() -
														ONE_HOUR_IN_MILLISECONDS,
												),
											);
										}
									}}
									shouldCloseOnSelect={false}
									granularity={"minute"}
									label="Event End"
								/>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				{loading ? (
					<h1 className="flex justify-center gap-x-1">
						Updating Event{" "}
						<ThreeCircles
							visible={true}
							height="20"
							width="20"
							color="#4fa94d"
							ariaLabel="three-circles-loading"
							wrapperStyle={{}}
							wrapperClass=""
						/>
					</h1>
				) : (
					<Button type="submit">Edit Event</Button>
				)}
			</form>
		</Form>
	);
}
