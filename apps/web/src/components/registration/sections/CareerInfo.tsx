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

import FormGroupWrapper from "../FormGroupWrapper";
import { hackerRegistrationFormValidator } from "@/validators/shared/registration";
import { formatRegistrationField } from "@/lib/utils/client/shared";

type FormData = z.infer<typeof hackerRegistrationFormValidator>;

export default function CareerInfo() {
	const form = useFormContext<FormData>();

	return (
		<FormGroupWrapper title="Career Info">
			<div className="grid grid-cols-1 gap-x-2 gap-y-2 md:grid-cols-3 md:gap-y-2">
				<FormField
					control={form.control}
					name="GitHub"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								{formatRegistrationField(
									"GitHub Username",
									hackerRegistrationFormValidator.shape[field.name].isOptional(),
								)}
							</FormLabel>
							<FormControl>
								<Input placeholder="Username" {...field} value={field.value ?? undefined} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="LinkedIn"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								{formatRegistrationField(
									"LinkedIn Username",
									hackerRegistrationFormValidator.shape[field.name].isOptional(),
								)}
							</FormLabel>
							<FormControl>
								<Input placeholder="Username" {...field} value={field.value ?? undefined} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="PersonalWebsite"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								{formatRegistrationField(
									"Personal Website",
									hackerRegistrationFormValidator.shape[field.name].isOptional(),
								)}
							</FormLabel>
							<FormControl>
								<Input
									placeholder="https://example.com/"
									{...field}
									value={field.value ?? undefined}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
		</FormGroupWrapper>
	);
}