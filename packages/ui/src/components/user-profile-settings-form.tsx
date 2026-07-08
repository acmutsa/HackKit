"use client";

import * as React from "react";
import { updateUserProfileSchema, type User } from "@hackkit/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useHackKitUI } from "../provider";
import type { UserProfileFormValues } from "../types";
import { cn } from "../lib/cn";
import { Button } from "./ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

const formSchema = updateUserProfileSchema.omit({ authId: true }).extend({
	firstName: z.string().min(1).max(100),
	lastName: z.string().min(1).max(100),
	hackTag: z.string().min(1).max(50),
	skillsText: z.string().optional(),
});

type FormValues = z.input<typeof formSchema>;

export type UserProfileSettingsFormProps = {
	currentUser: User;
	uploadProfilePhoto?: (file: File) => Promise<string>;
	className?: string;
};

function FieldError({ message }: { message?: string }) {
	if (!message) return null;
	return <p className="text-sm font-medium text-destructive">{message}</p>;
}

function skillsToText(skills?: string[]) {
	return (skills ?? []).join(", ");
}

function textToSkills(value?: string) {
	return (value ?? "")
		.split(",")
		.map((skill) => skill.trim())
		.filter(Boolean);
}

export function UserProfileSettingsForm({
	currentUser,
	uploadProfilePhoto,
	className,
}: UserProfileSettingsFormProps) {
	const { actions, navigation } = useHackKitUI();
	const [profilePhotoFile, setProfilePhotoFile] = React.useState<File | null>(null);
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			firstName: currentUser.firstName,
			lastName: currentUser.lastName,
			hackTag: currentUser.hackTag ?? "",
			bio: currentUser.bio ?? "",
			pronouns: currentUser.pronouns ?? "",
			skills: currentUser.skills ?? [],
			skillsText: skillsToText(currentUser.skills),
			isProfileSearchable: currentUser.isProfileSearchable ?? true,
			discordDisplayHandle: currentUser.discordDisplayHandle ?? "",
			profilePhotoUrl: currentUser.profilePhotoUrl,
		},
	});
	const previewPhoto =
		profilePhotoFile ? URL.createObjectURL(profilePhotoFile) : currentUser.profilePhotoUrl;

	React.useEffect(() => {
		if (!profilePhotoFile) return;
		const objectUrl = previewPhoto;
		return () => {
			if (objectUrl?.startsWith("blob:")) URL.revokeObjectURL(objectUrl);
		};
	}, [profilePhotoFile, previewPhoto]);

	async function onSubmit(values: FormValues) {
		let profilePhotoUrl = values.profilePhotoUrl;
		if (profilePhotoFile && uploadProfilePhoto) {
			try {
				profilePhotoUrl = await uploadProfilePhoto(profilePhotoFile);
			} catch (error) {
				toast.error(
					error instanceof Error
						? error.message
						: "Could not upload profile photo.",
				);
				return;
			}
		}

		const payload: UserProfileFormValues = {
			firstName: values.firstName,
			lastName: values.lastName,
			hackTag: values.hackTag,
			bio: values.bio,
			pronouns: values.pronouns,
			skills: textToSkills(values.skillsText),
			isProfileSearchable: values.isProfileSearchable ?? true,
			discordDisplayHandle: values.discordDisplayHandle,
			profilePhotoUrl,
		};
		const result = await actions.updateUserProfile(payload);
		if (!result.ok) {
			toast.error(result.message);
			return;
		}

		toast.success("Profile saved.");
		navigation.refresh();
	}

	return (
		<Card className={cn("w-full max-w-3xl", className)}>
			<CardHeader>
				<CardTitle>Profile</CardTitle>
				<CardDescription>
					Update your public profile, HackTag, and Discord display handle.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
					<div className="flex items-center gap-4">
						{previewPhoto ? (
							// eslint-disable-next-line @next/next/no-img-element
							<img
								src={previewPhoto}
								alt=""
								className="h-20 w-20 rounded-full object-cover"
							/>
						) : (
							<div className="grid h-20 w-20 place-items-center rounded-full bg-muted text-lg font-semibold">
								{currentUser.firstName[0]}
								{currentUser.lastName[0]}
							</div>
						)}
						{uploadProfilePhoto ? (
							<div className="space-y-2">
								<Label htmlFor="profilePhoto">Profile photo</Label>
								<Input
									id="profilePhoto"
									type="file"
									accept="image/png,image/jpeg,image/webp,image/gif"
									onChange={(event) =>
										setProfilePhotoFile(event.target.files?.[0] ?? null)
									}
								/>
							</div>
						) : null}
					</div>

					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="firstName">First name</Label>
							<Input id="firstName" {...form.register("firstName")} />
							<FieldError message={form.formState.errors.firstName?.message} />
						</div>
						<div className="space-y-2">
							<Label htmlFor="lastName">Last name</Label>
							<Input id="lastName" {...form.register("lastName")} />
							<FieldError message={form.formState.errors.lastName?.message} />
						</div>
						<div className="space-y-2">
							<Label htmlFor="hackTag">HackTag</Label>
							<Input id="hackTag" {...form.register("hackTag")} />
							<FieldError message={form.formState.errors.hackTag?.message} />
						</div>
						<div className="space-y-2">
							<Label htmlFor="pronouns">Pronouns</Label>
							<Input id="pronouns" {...form.register("pronouns")} />
							<FieldError message={form.formState.errors.pronouns?.message} />
						</div>
						<div className="space-y-2">
							<Label htmlFor="discordDisplayHandle">Discord display handle</Label>
							<Input
								id="discordDisplayHandle"
								{...form.register("discordDisplayHandle")}
							/>
							<FieldError
								message={form.formState.errors.discordDisplayHandle?.message}
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="bio">Bio</Label>
						<Textarea id="bio" {...form.register("bio")} />
						<FieldError message={form.formState.errors.bio?.message} />
					</div>

					<div className="space-y-2">
						<Label htmlFor="skillsText">Skills</Label>
						<Input
							id="skillsText"
							placeholder="TypeScript, design, hardware"
							{...form.register("skillsText")}
						/>
						<p className="text-sm text-muted-foreground">
							Separate skills with commas.
						</p>
					</div>

					<label className="flex items-start gap-3 rounded-md border p-3 text-sm">
						<Checkbox
							checked={form.watch("isProfileSearchable")}
							onCheckedChange={(value) =>
								form.setValue("isProfileSearchable", value === true, {
									shouldDirty: true,
									shouldValidate: true,
								})
							}
						/>
						<span>Show my public profile at /@{form.watch("hackTag") || "tag"}.</span>
					</label>

					<Button type="submit" disabled={form.formState.isSubmitting}>
						{form.formState.isSubmitting ? "Saving..." : "Save profile"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
