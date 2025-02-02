"use client";

import { Input } from "@/components/shadcn/ui/input";
import { Button } from "@/components/shadcn/ui/button";
import { Label } from "@/components/shadcn/ui/label";
import { Textarea } from "@/components/shadcn/ui/textarea";
import ProfilePhotoSettings from "./ProfilePhotoSettings";
import { modifyProfileData } from "@/actions/user-profile-mod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Tag, TagInput } from "@/components/shadcn/ui/tag/tag-input";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { profileSettingsSchema } from "@/validators/settings";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../shadcn/ui/form";

interface ProfileData {
	pronouns: string;
	bio: string;
	skills: string[];
	discord: string | null;
	profilePhoto: string;
}
interface ProfileSettingsProps {
	profile: ProfileData;
}

export default function ProfileSettings({
	profile: profileData,
}: ProfileSettingsProps) {
	const { profilePhoto, ...profileSettingsData } = profileData;
	const skillTags: Tag[] = profileSettingsData.skills.map((skill) => ({
		id: skill,
		text: skill,
	}));
	const [newSkills, setNewSkills] = useState<Tag[]>(skillTags);

	const form = useForm<z.infer<typeof profileSettingsSchema>>({
		resolver: zodResolver(profileSettingsSchema),
		defaultValues: {
			...profileSettingsData,
			discord: profileSettingsData.discord || "",
		},
	});

	useEffect(() => {
		form.setValue("skills", [...newSkills.map((tag) => tag.text)], {
			shouldDirty: true,
		});
	}, [newSkills]);

	const { execute: runModifyProfileData, status: actionStatus } = useAction(
		modifyProfileData,
		{
			onSuccess: () => {
				toast.dismiss();
				toast.success("Profile Data updated successfully!");
				form.reset({
					...form.getValues(),
				});
			},
			onError: () => {
				toast.dismiss();
				toast.error("An error occurred while updating your profile!");
			},
		},
	);

	function handleUpdate(data: z.infer<typeof profileSettingsSchema>) {
		if (!form.formState.isDirty) {
			toast.error("Please change something before updating");
			return;
		}
		runModifyProfileData({
			...data,
			skills: data.skills.map((skill) => skill),
		});
	}

	const isProfileSettingsLoading = actionStatus === "executing";

	return (
		<main>
			<ProfilePhotoSettings profilePhoto={profilePhoto} />
			<Form {...form}>
				<form
					className="mt-5 rounded-lg border-2 border-muted px-5 py-10"
					onSubmit={form.handleSubmit(handleUpdate)}
				>
					<h2 className="pb-5 text-3xl font-semibold">
						Profile Data
					</h2>
					<div className="max-w-[500px] space-y-4">
						<FormField
							control={form.control}
							name="pronouns"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Pronouns</FormLabel>
									<FormControl>
										<Input
											placeholder="shadcn"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="bio"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Bio</FormLabel>
									<FormControl>
										<Textarea
											placeholder="shadcn"
											className="resize-none"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div>
							<Label htmlFor="skills">Skills</Label>
							<TagInput
								inputFieldPostion="top"
								placeholder="Type and then press enter to add a skill..."
								tags={newSkills}
								className="mt-2 sm:min-w-[450px]"
								setTags={(newTags) => {
									setNewSkills(newTags);
								}}
							/>
						</div>
						<FormField
							control={form.control}
							name="discord"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Discord Username</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							type="submit"
							className="mt-10"
							disabled={isProfileSettingsLoading}
						>
							{isProfileSettingsLoading ? (
								<>
									<Loader2
										className={"mr-2 h-4 w-4 animate-spin"}
									/>
									<div>Updating</div>
								</>
							) : (
								"Update"
							)}
						</Button>
					</div>
				</form>
			</Form>
		</main>
	);
}
