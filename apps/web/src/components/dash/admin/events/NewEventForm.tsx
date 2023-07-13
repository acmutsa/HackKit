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
import c from "@/hackkit.config";

const formSchema = z.object({
	title: z.string().min(2).max(255),
	description: z.string().min(2).max(255),
	type: z.enum(c.eventTypes),
	day: z
		.number()
		.or(z.string())
		.pipe(z.coerce.number().int({ message: "Value must be an integer" })),
});

export default function NewEventForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			description: "",
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values);
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
							<FormDescription>Generally its best to keep this short and consise</FormDescription>
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
				<FormField
					control={form.control}
					name="type"
					render={({ field }) => (
						<FormItem className="col-span-2">
							<FormLabel>Event Type</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select a Event Type" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectGroup>
										{c.eventTypes.map((type) => (
											<SelectItem value={type}>{type}</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="grid grid-cols-3 gap-x-2">
					<FormField
						control={form.control}
						name="day"
						render={({ field }) => (
							<FormItem className="col-span-2">
								<FormLabel>Event Day</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value ? field.value.toString() : ""}
								>
									<FormControl>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Select a Day" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectGroup>
											{Object.entries(c.days).map(([key, value]) => (
												<SelectItem
													value={value.getMilliseconds().toString()}
												>{`${key} (${value.toLocaleDateString("en-US")})`}</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<Button type="submit">Create Event</Button>
			</form>
		</Form>
	);
}
