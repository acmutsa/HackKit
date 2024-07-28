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
import { newEventValidator } from "@/validators/shared/newEvent";
import { zpostSafe } from "@/lib/utils/client/zfetch";
import { BasicRedirValidator } from "@/validators/shared/basicRedir";
import { useState } from "react";
import { Shell } from "lucide-react";
import { useRouter } from "next/navigation";

interface NewEventFormProps {
	defaultDate: Date;
}

const formSchema = newEventValidator.merge(
	z.object({
		type: z.enum(Object.keys(c.eventTypes) as any),
	}),
);

export default function NewEventForm({ defaultDate }: NewEventFormProps) {
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			description: "",
			type: "" as any,
			host: "",
			startTime: defaultDate,
			endTime: defaultDate,
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setLoading(true);
		const res = await zpostSafe({
			url: "/api/admin/events/create",
			body: values,
			superReq: true,
			vReq: formSchema,
			vRes: BasicRedirValidator,
		});
		setLoading(false);
		if (res.success) {
			alert("Event Created Successfully! Redirecting to event page...");
			router.push(res.data.redirect);
		} else {
			alert(
				"Failed to create event, please try again. Error:\n\n" +
					res.error,
			);
		}
	}

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
								Generally its best to keep this short and
								consise
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
								<Textarea
									placeholder="You can also include any resources / links that would be helpful for the event here!"
									{...field}
								/>
							</FormControl>
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
										!!field.value
											? parseAbsolute(
													field.value.toISOString(),
													getLocalTimeZone(),
												)
											: null
									}
									onChange={(date) => {
										field.onChange(
											!!date
												? date.toDate(
														getLocalTimeZone(),
													)
												: null,
										);
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
													getLocalTimeZone(),
												)
											: null
									}
									onChange={(date) => {
										field.onChange(
											!!date
												? date.toDate(
														getLocalTimeZone(),
													)
												: null,
										);
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
					<p className="flex justify-center gap-x-1">
						Creating Event <Shell className="animate-spin" />
					</p>
				) : (
					<Button type="submit">Create Event</Button>
				)}
			</form>
		</Form>
	);
}
