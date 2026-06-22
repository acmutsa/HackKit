"use client";

import { useFormContext } from "react-hook-form";
import z from "zod";
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormDescription,
	FormMessage,
} from "@/components/shadcn/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectGroup,
} from "@/components/shadcn/ui/select";
import { Textarea } from "@/components/shadcn/ui/textarea";
import { Checkbox } from "@/components/shadcn/ui/checkbox";
import clsx from "clsx";
import c from "config";

import FormGroupWrapper from "../FormGroupWrapper";
import { hackerRegistrationFormValidator } from "@/validators/shared/registration";
import { formatRegistrationField } from "@/lib/utils/client/shared";

type FormData = z.infer<typeof hackerRegistrationFormValidator>;

export default function HackDay() {
	const form = useFormContext<FormData>();

	return (
		<FormGroupWrapper title="Day of Event">
			<div className="mt-0 grid grid-cols-1 gap-x-4 gap-y-2 pb-20 md:grid-cols-2 md:gap-y-0">
				<FormField
					control={form.control}
					name="shirtSize"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								{formatRegistrationField(
									"Shirt Size",
									hackerRegistrationFormValidator.shape[field.name].isOptional(),
								)}
							</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger className="w-full">
										<div
											className={clsx("flex w-[95%] justify-start", {
												"text-muted-foreground": !field.value,
											})}
										>
											<p className="overflow-hidden text-ellipsis whitespace-nowrap">
												{field.value || "Select a Shirt Size"}
											</p>
										</div>
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectGroup>
										{c.registration.shirtSizeOptions.map((option) => (
											<SelectItem value={option} key={option}>
												{option}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="dietRestrictions"
					render={({ field }) => (
						<FormItem className="row-span-2">
							<div className="mb-4">
								<FormLabel className="text-base">
									{formatRegistrationField(
										"Dietary Restrictions",
										hackerRegistrationFormValidator.shape[field.name].isOptional(),
									)}
								</FormLabel>
								<FormDescription>
									Please select which dietary restrictions you have so we can
									best accommodate you at the event!
								</FormDescription>
							</div>

							{c.registration.dietaryRestrictionOptions.map((item) => (
								<FormField
									key={item}
									control={form.control}
									name="dietRestrictions"
									render={({ field }) => (
										<FormItem className="flex flex-row items-start space-x-3 space-y-0">
											<FormControl>
												<Checkbox
													checked={field.value?.includes(item)}
													onCheckedChange={(checked) => {
														return checked
															? field.onChange([...(field?.value ?? []), item])
															: field.onChange(
																	field.value?.filter((value) => value !== item),
																);
													}}
												/>
											</FormControl>
											<FormLabel className="font-normal">{item}</FormLabel>
										</FormItem>
									)}
								/>
							))}

							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="accommodationNote"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								{formatRegistrationField(
									"Anything else we can do to better accommodate you at our hackathon?",
									hackerRegistrationFormValidator.shape[field.name].isOptional(),
								)}
							</FormLabel>

							<FormControl>
								<Textarea
									placeholder="List any accessibility concerns here..."
									className="h-[80%] resize-none"
									{...field}
									value={field.value}
									onChange={field.onChange}
								/>
							</FormControl>

							<FormDescription>
								<span
									className={
										(field.value?.length ?? 0) >
										c.registration.maxaccommodationNoteSize
											? "text-red-800"
											: ""
									}
								>
									{field.value?.length ?? 0} /{" "}
									{c.registration.maxaccommodationNoteSize} Characters
								</span>
							</FormDescription>

							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
		</FormGroupWrapper>
	);
}