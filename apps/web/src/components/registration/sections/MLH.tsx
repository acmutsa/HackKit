"use client";

import { useFormContext } from "react-hook-form";
import z from "zod";
import Link from "next/link";
import { Checkbox } from "@/components/shadcn/ui/checkbox";
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/shadcn/ui/form";

import FormGroupWrapper from "../FormGroupWrapper";
import { hackerRegistrationFormValidator } from "@/validators/shared/registration";

type FormData = z.infer<typeof hackerRegistrationFormValidator>;

export default function MLH() {
	const form = useFormContext<FormData>();

	return (
		<FormGroupWrapper title="MLH">
			<FormField
				control={form.control}
				name="hasAcceptedMLHCoC"
				render={({ field }) => (
					<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-white/15 bg-white/[0.02] p-4">
						<FormControl>
							<Checkbox
								checked={!!field.value}
								onCheckedChange={(checked) =>
									field.onChange(checked === true)
								}
							/>
						</FormControl>
						<div className="space-y-1 leading-none">
							<FormLabel>
								I accept the{" "}
								<Link
									target="_blank"
									className="underline"
									href="https://mlh.io/code-of-conduct"
								>
									MLH Code of Conduct
								</Link>
								{" *"}
							</FormLabel>
							<FormMessage />
						</div>
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="hasSharedDataWithMLH"
				render={({ field }) => (
					<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-white/15 bg-white/[0.02] p-4">
						<FormControl>
							<Checkbox
								checked={!!field.value}
								onCheckedChange={(checked) =>
									field.onChange(checked === true)
								}
							/>
						</FormControl>
						<div className="space-y-1 leading-none">
							<FormLabel>
								I authorize you to share my application/registration information
								with Major League Hacking for event administration, ranking, and
								MLH administration in-line with the MLH Privacy Policy. I further
								agree to the terms of both the{" "}
								<Link
									target="_blank"
									className="underline"
									href="https://github.com/MLH/mlh-policies/blob/main/contest-terms.md"
								>
									MLH Contest Terms and Conditions
								</Link>{" "}
								and the{" "}
								<Link
									target="_blank"
									className="underline"
									href="https://mlh.io/privacy"
								>
									MLH Privacy Policy
								</Link>
								. *
							</FormLabel>
							<FormMessage />
						</div>
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="isEmailable"
				render={({ field }) => (
					<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-white/15 bg-white/[0.02] p-4">
						<FormControl>
							<Checkbox
								checked={!!field.value}
								onCheckedChange={(checked) =>
									field.onChange(checked === true)
								}
							/>
						</FormControl>
						<div className="space-y-1 leading-none">
							<FormLabel>
								I authorize MLH to send me an email where I can further opt into
								the MLH Hacker, Events, or Organizer Newsletters and other
								communications from MLH.
							</FormLabel>
							<FormMessage />
						</div>
					</FormItem>
				)}
			/>
		</FormGroupWrapper>
	);
}