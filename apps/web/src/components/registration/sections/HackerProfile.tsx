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
import { Input } from "@/components/shadcn/ui/input";
import { Textarea } from "@/components/shadcn/ui/textarea";
import { Checkbox } from "@/components/shadcn/ui/checkbox";
import { TagInput, type Tag } from "@/components/shadcn/ui/tag/tag-input";
import c from "config";

import FormGroupWrapper from "../FormGroupWrapper";
import { hackerRegistrationFormValidator } from "@/validators/shared/registration";
import { formatRegistrationField } from "@/lib/utils/client/shared";
import type { SectionProps } from "../RegisterForm";

type FormData = z.infer<typeof hackerRegistrationFormValidator>;

export default function HackerProfile({ skills, setSkills }: SectionProps) {
	const form = useFormContext<FormData>();
	const bioValue = form.watch("bio");

	return (
		<FormGroupWrapper title="Hacker Profile">
			<div className="grid grid-cols-1 gap-x-2 gap-y-2 md:grid-cols-3 md:gap-y-0">
				<FormField
					control={form.control}
					name="hackerTag"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								{formatRegistrationField(
									"HackerTag",
									hackerRegistrationFormValidator.shape[field.name].isOptional(),
								)}
							</FormLabel>
							<FormControl>
								<div className="flex">
									<div className="flex h-10 w-10 items-center justify-center rounded-l bg-accent text-lg font-light text-primary">
										@
									</div>
									<Input
										className="rounded-l-none"
										placeholder={`${c.hackathonName.toLowerCase()}`}
										{...field}
									/>
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="discord"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								{formatRegistrationField(
									"Discord UserName",
									hackerRegistrationFormValidator.shape[field.name].isOptional(),
								)}
							</FormLabel>
							<FormControl>
								<Input
									placeholder={`${c.hackathonName.toLowerCase()} or ${c.hackathonName.toLowerCase()}#1234`}
									{...field}
									value={field.value ?? undefined}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			<div className="grid grid-cols-1 gap-x-2 gap-y-4 md:grid-cols-2 md:gap-y-0">
				<FormField
					control={form.control}
					name="bio"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								{formatRegistrationField(
									"Bio",
									hackerRegistrationFormValidator.shape[field.name].isOptional(),
								)}
							</FormLabel>
							<FormControl>
								<Textarea placeholder="Hello! I'm..." className="resize-none" {...field} />
							</FormControl>
							<FormDescription>
								<span
									className={
										bioValue.length > c.registration.maxBioSize ? "text-red-500" : ""
									}
								>
									{bioValue.length} / {c.registration.maxBioSize} Characters
								</span>
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="skills"
					render={({ field }) => (
						<FormItem className="flex flex-col items-start">
							<FormLabel className="pb-2 text-left">
								{formatRegistrationField(
									"Skills",
									hackerRegistrationFormValidator.shape[field.name].isOptional(),
								)}
							</FormLabel>
							<FormControl className="min-h-[80px]">
								<TagInput
									inputFieldPostion="top"
									{...field}
									placeholder="Type and then press enter to add a skill..."
									tags={skills}
									className="sm:min-w-[450px]"
									setTags={(newTags) => {
										setSkills(newTags);
										field.onChange(newTags as [Tag, ...Tag[]]);
									}}
								/>
							</FormControl>
							<FormDescription className="!mt-0">
								These skills can be listed on your profile and help with the team
								finding process! Enter anything you think is relevant, including
								non-technical skills!
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			<FormField
				control={form.control}
				name="isSearchable"
				render={({ field }) => (
					<FormItem className="mx-auto flex max-w-[600px] flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
						<FormControl>
							<Checkbox checked={field.value} onCheckedChange={field.onChange} />
						</FormControl>
						<div className="space-y-1 leading-none">
							<FormLabel>
								{formatRegistrationField(
									"Make my profile searchable by other Hackers",
									hackerRegistrationFormValidator.shape[field.name].isOptional(),
								)}
							</FormLabel>
							<FormDescription>
								This will allow other Hackers to look you up by your name or
								HackerTag. Other Hackers will still be able to view your profile
								and invite you to teams if they have your link.
							</FormDescription>
						</div>
					</FormItem>
				)}
			/>
		</FormGroupWrapper>
	);
}