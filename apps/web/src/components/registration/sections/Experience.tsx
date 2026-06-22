"use client";

import { useFormContext } from "react-hook-form";
import z from "zod";
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/shadcn/ui/form";
import { Input } from "@/components/shadcn/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectGroup,
} from "@/components/shadcn/ui/select";
import clsx from "clsx";
import c from "config";

import FormGroupWrapper from "../FormGroupWrapper";
import { hackerRegistrationFormValidator } from "@/validators/shared/registration";
import { formatRegistrationField } from "@/lib/utils/client/shared";

type FormData = z.infer<typeof hackerRegistrationFormValidator>;

export default function Experience() {
	const form = useFormContext<FormData>();

	return (
		<FormGroupWrapper title="Hackathon Experience">
			<div className="grid grid-cols-1 gap-x-2 gap-y-2 md:grid-cols-3 md:gap-y-0">
				<FormField
					control={form.control}
					name="hackathonsAttended"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								{formatRegistrationField(
									"# of hackathons attended",
									hackerRegistrationFormValidator.shape[field.name].isOptional(),
								)}
							</FormLabel>
							<FormControl>
								<Input type="number" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="softwareExperience"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								{formatRegistrationField(
									"Coding Experience",
									hackerRegistrationFormValidator.shape[field.name].isOptional(),
								)}
							</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger className="placeholder:text-muted-foreground">
										<div
											className={clsx("flex w-[95%] justify-start", {
												"text-muted-foreground": !field.value,
											})}
										>
											<p className="overflow-hidden text-ellipsis whitespace-nowrap">
												{field.value || "Select an Option"}
											</p>
										</div>
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectGroup className="max-h-[400px] w-[var(--radix-select-trigger-width)]">
										{c.registration.softwareExperienceOptions.map((option) => (
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
					name="heardFrom"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								{formatRegistrationField(
									`Where did you hear about ${c.hackathonName}?`,
									hackerRegistrationFormValidator.shape[field.name].isOptional(),
								)}
							</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger className="w-full placeholder:text-muted-foreground">
										<div
											className={clsx("flex w-[95%] justify-start", {
												"text-muted-foreground": !field.value,
											})}
										>
											<p className="overflow-hidden text-ellipsis whitespace-nowrap">
												{field.value || "Select an Option"}
											</p>
										</div>
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectGroup className="max-h-[400px] w-[var(--radix-select-trigger-width)]">
										{c.registration.heardFromOptions.map((option) => (
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
			</div>
		</FormGroupWrapper>
	);
}