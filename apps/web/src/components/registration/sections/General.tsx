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
import { capitalizeFirstLetter } from "@/lib/utils/client/shared";
import type { SectionProps } from "../RegisterForm";

type FormData = z.infer<typeof hackerRegistrationFormValidator>;

export default function General({ defaultEmail }: SectionProps) {
	const form = useFormContext<FormData>();

	const lockEmail = (defaultEmail ?? "").length > 0;

	return (
		<FormGroupWrapper title="General">
			<div className="grid grid-cols-1 gap-x-2 gap-y-4 md:grid-cols-2">
				<FormField
					control={form.control}
					name="firstName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								{formatRegistrationField(
									"First Name",
									hackerRegistrationFormValidator.shape[field.name].isOptional(),
								)}
							</FormLabel>
							<FormControl>
								<Input placeholder="John" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="lastName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								{formatRegistrationField(
									"Last Name",
									hackerRegistrationFormValidator.shape[field.name].isOptional(),
								)}
							</FormLabel>
							<FormControl>
								<Input placeholder="Doe" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								{formatRegistrationField(
									"Email",
									hackerRegistrationFormValidator.shape[field.name].isOptional(),
								)}
							</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder="you@example.com"
									readOnly={lockEmail}
									disabled={lockEmail}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="phoneNumber"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								{formatRegistrationField(
									"Phone Number",
									hackerRegistrationFormValidator.shape[field.name].isOptional(),
								)}
							</FormLabel>
							<FormControl>
								<Input placeholder="555-555-5555" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			<div className="grid grid-cols-1 gap-x-2 gap-y-4 md:grid-cols-2">
				<FormField
					control={form.control}
					name="age"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								{formatRegistrationField(
									"Age",
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
					name="gender"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								{formatRegistrationField(
									"Gender",
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
												{field.value || `Select a ${capitalizeFirstLetter(field.name)}`}
											</p>
										</div>
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectGroup>
										{c.registration.genderOptions.map((option) => (
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
					name="pronouns"
					render={({ field }) => (
						<FormItem className="md:col-span-2">
							<FormLabel>
								{formatRegistrationField(
									"Pronouns",
									hackerRegistrationFormValidator.shape[field.name].isOptional(),
								)}
							</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
		</FormGroupWrapper>
	);
}