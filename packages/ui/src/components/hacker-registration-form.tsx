"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { registerHackerSchema, type User } from "@hackkit/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useHackKitUI } from "../provider";
import type { HackerRegistrationFormValues } from "../types";
import { cn } from "../lib/cn";
import { usePersistedFormState } from "../lib/use-persisted-form-state";
import { Button } from "./ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";

const hackerRegistrationFormSchema = registerHackerSchema
	.omit({ authId: true, group: true })
	.extend({
		githubUrl: z
			.union([z.string().url(), z.literal("")])
			.optional()
			.transform((value) => (value === "" ? undefined : value)),
		linkedInUrl: z
			.union([z.string().url(), z.literal("")])
			.optional()
			.transform((value) => (value === "" ? undefined : value)),
		personalWebsiteUrl: z
			.union([z.string().url(), z.literal("")])
			.optional()
			.transform((value) => (value === "" ? undefined : value)),
	});

export type HackerRegistrationFormProps = {
	currentUser: User;
	defaultValues?: Partial<HackerRegistrationFormValues>;
	localStorageKey?: string;
	successRedirectTo?: string;
	className?: string;
	levelOfStudyOptions?: Array<{ value: string; label: string }>;
	softwareExperienceOptions?: Array<{ value: string; label: string }>;
	uploadResume?: (file: File) => Promise<string>;
};

function FieldError({ message }: { message?: string }) {
	if (!message) return null;
	return <p className="text-sm font-medium text-destructive">{message}</p>;
}

const DEFAULT_LEVEL_OF_STUDY = [
	{ value: "high_school", label: "High school" },
	{ value: "undergraduate", label: "Undergraduate" },
	{ value: "graduate", label: "Graduate" },
	{ value: "bootcamp", label: "Bootcamp" },
	{ value: "other", label: "Other" },
];

const DEFAULT_SOFTWARE_EXPERIENCE = [
	{ value: "beginner", label: "Beginner" },
	{ value: "intermediate", label: "Intermediate" },
	{ value: "advanced", label: "Advanced" },
];

export function HackerRegistrationForm({
	currentUser,
	defaultValues,
	localStorageKey,
	successRedirectTo = "/dashboard",
	className,
	levelOfStudyOptions = DEFAULT_LEVEL_OF_STUDY,
	softwareExperienceOptions = DEFAULT_SOFTWARE_EXPERIENCE,
	uploadResume,
}: HackerRegistrationFormProps) {
	const router = useRouter();
	const { actions } = useHackKitUI();
	const [resumeFile, setResumeFile] = React.useState<File | null>(null);
	const form = useForm<HackerRegistrationFormValues>({
		resolver: zodResolver(hackerRegistrationFormSchema),
		defaultValues: {
			university: "",
			major: "",
			schoolId: "",
			levelOfStudy: "",
			hackathonsAttended: 0,
			softwareExperience: "",
			heardFrom: "",
			githubUrl: "",
			linkedInUrl: "",
			personalWebsiteUrl: "",
			resumeUrl: undefined,
			...defaultValues,
		},
	});
	const clearPersistedState = usePersistedFormState(form, localStorageKey);

	async function onSubmit(values: HackerRegistrationFormValues) {
		let resumeUrl = values.resumeUrl;
		if (resumeFile && uploadResume) {
			try {
				resumeUrl = await uploadResume(resumeFile);
			} catch (error) {
				toast.error(
					error instanceof Error
						? error.message
						: "Could not upload resume.",
				);
				return;
			}
		}

		const result = await actions.registerHacker({
			...values,
			resumeUrl: resumeUrl || undefined,
		});
		if (!result.ok) {
			toast.error(result.message);
			return;
		}

		clearPersistedState();
		toast.success("Hacker registration complete.");
		router.push(successRedirectTo);
	}

	return (
		<Card className={cn("w-full max-w-3xl", className)}>
			<CardHeader>
				<CardTitle>Hacker Registration</CardTitle>
				<CardDescription>
					Competitor details for {currentUser.firstName}{" "}
					{currentUser.lastName}
					{currentUser.hackTag ? ` (@${currentUser.hackTag})` : ""}.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					className="space-y-6"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="university">University</Label>
							<Input id="university" {...form.register("university")} />
							<FieldError
								message={form.formState.errors.university?.message}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="major">Major</Label>
							<Input id="major" {...form.register("major")} />
							<FieldError
								message={form.formState.errors.major?.message}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="schoolId">School ID</Label>
							<Input id="schoolId" {...form.register("schoolId")} />
							<FieldError
								message={form.formState.errors.schoolId?.message}
							/>
						</div>
						<div className="space-y-2">
							<Label>Level of study</Label>
							<Select
								value={form.watch("levelOfStudy")}
								onValueChange={(value) =>
									form.setValue("levelOfStudy", value, {
										shouldValidate: true,
									})
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select level" />
								</SelectTrigger>
								<SelectContent>
									{levelOfStudyOptions.map((option) => (
										<SelectItem
											key={option.value}
											value={option.value}
										>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FieldError
								message={
									form.formState.errors.levelOfStudy?.message
								}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="hackathonsAttended">
								Hackathons attended
							</Label>
							<Input
								id="hackathonsAttended"
								type="number"
								min={0}
								{...form.register("hackathonsAttended", {
									valueAsNumber: true,
								})}
							/>
							<FieldError
								message={
									form.formState.errors.hackathonsAttended
										?.message
								}
							/>
						</div>
						<div className="space-y-2">
							<Label>Software experience</Label>
							<Select
								value={form.watch("softwareExperience")}
								onValueChange={(value) =>
									form.setValue("softwareExperience", value, {
										shouldValidate: true,
									})
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select experience" />
								</SelectTrigger>
								<SelectContent>
									{softwareExperienceOptions.map((option) => (
										<SelectItem
											key={option.value}
											value={option.value}
										>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FieldError
								message={
									form.formState.errors.softwareExperience
										?.message
								}
							/>
						</div>
					</div>

					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="heardFrom">How did you hear about us?</Label>
							<Input id="heardFrom" {...form.register("heardFrom")} />
						</div>
						<div className="space-y-2">
							<Label htmlFor="githubUrl">GitHub URL</Label>
							<Input id="githubUrl" {...form.register("githubUrl")} />
							<FieldError
								message={form.formState.errors.githubUrl?.message}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="linkedInUrl">LinkedIn URL</Label>
							<Input
								id="linkedInUrl"
								{...form.register("linkedInUrl")}
							/>
							<FieldError
								message={form.formState.errors.linkedInUrl?.message}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="personalWebsiteUrl">Website URL</Label>
							<Input
								id="personalWebsiteUrl"
								{...form.register("personalWebsiteUrl")}
							/>
							<FieldError
								message={
									form.formState.errors.personalWebsiteUrl
										?.message
								}
							/>
						</div>
					</div>

					{uploadResume ? (
						<div className="space-y-2">
							<Label htmlFor="resume">Resume (optional, PDF)</Label>
							<Input
								id="resume"
								type="file"
								accept="application/pdf,.pdf"
								onChange={(event) => {
									const file = event.target.files?.[0] ?? null;
									setResumeFile(file);
								}}
							/>
							<p className="text-sm text-muted-foreground">
								You can skip resume upload and submit without one.
							</p>
						</div>
					) : null}

					<Button
						type="submit"
						disabled={form.formState.isSubmitting}
					>
						{form.formState.isSubmitting
							? "Submitting..."
							: "Complete registration"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
