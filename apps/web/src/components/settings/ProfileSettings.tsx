"use client";

import { Input } from "@/components/shadcn/ui/input";
import { Button } from "@/components/shadcn/ui/button";
import { Label } from "@/components/shadcn/ui/label";
import { Textarea } from "@/components/shadcn/ui/textarea";
import {
	modifyProfileData,
	updateProfileImage
} from "@/actions/user-profile-mod";
import { useUser } from "@clerk/nextjs";
import { useAction } from "next-safe-action/hook";
import { toast } from "sonner";
import { useState } from "react";
import { encodeFileAsBase64 } from "@/lib/utils/shared/files";
import { Tag, TagInput } from "@/components/shadcn/ui/tag/tag-input";

interface ProfileData {
	pronouns: string;
	bio: string;
	skills: string[];
	discordUsername: string;
}

interface ProfileSettingsProps {
	profile: ProfileData;
}

export default function ProfileSettings({ profile }: ProfileSettingsProps) {
	const [newPronouns, setNewPronouns] = useState<string>(profile.pronouns);
	const [newBio, setNewBio] = useState(profile.bio);
	const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
	let curSkills: Tag[] = [];
	for (let i = 0; i < profile.skills.length; i++) {
		let t: Tag = {
			id: profile.skills[i],
			text: profile.skills[i],
		}
		curSkills.push(t);
	}
	const [newSkills, setNewSkills] = useState<Tag[]>(curSkills);
	const [newDiscord, setNewDiscord] = useState(profile.discordUsername);

	const { user } = useUser();

	const { execute: runModifyProfileData } = useAction(
		modifyProfileData,
		{
			onSuccess: () => {
				toast.dismiss();
				toast.success("Profile updated successfully!");
			},
			onError: () => {
				toast.dismiss();
				toast.error("An error occurred while updating your profile!");
			},
		},
	);

	const { execute: runUpdateProfileImage } = useAction(updateProfileImage, {
		onSuccess: async () => {
			toast.dismiss();
			await user?.setProfileImage({ file: newProfileImage });
			toast.success("Profile Photo updated successfully!");
		},
		onError: (err) => {
			toast.dismiss();
			toast.error("An error occurred while updating your profile photo!");
			console.error(err);
		},
	});

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files ? event.target.files[0] : null;
		setNewProfileImage(file);
	};

	return (
		<main>
			<div className="rounded-lg border-2 border-muted px-5 py-10">
				<h2 className="pb-5 text-3xl font-semibold">Profile Photo</h2>
				<div className="max-w-[500px] space-y-4">
					<div>
						<Label htmlFor="photo">Profile Photo</Label>
						<Input
							accept=".jpg, .jpeg, .png, .svg, .gif, .mp4"
							type="file"
							name="photo"
							className="mb-4 mt-2 cursor-pointer file:cursor-pointer file:text-primary dark:border-primary dark:bg-transparent dark:ring-offset-primary"
							onChange={handleFileChange}
						/>
					</div>
					<Button
						onClick={async () => {
							console.log("Button clicked");
							if (!newProfileImage) {
								return toast.error(
									"Please select a Profile Photo to upload!",
								);
							}
							toast.loading("Updating Profile Photo...", {
								duration: 0,
							});
							const b64 =
								await encodeFileAsBase64(newProfileImage);
							runUpdateProfileImage({
								fileBase64: b64,
								fileName: newProfileImage.name,
							});
						}}
						className="mt-5"
					>
						Update
					</Button>
				</div>
			</div>
			<div className="mt-5 rounded-lg border-2 border-muted px-5 py-10">
				<h2 className="pb-5 text-3xl font-semibold">Profile Data</h2>
				<div>
					<Label htmlFor={"pronouns"}>Pronouns</Label>
					<Input
						className={"mt-2 max-w-[500px]"}
						name={"pronouns"}
						value={newPronouns}
						onChange={(e) => setNewPronouns(e.target.value)}
					/>
				</div>
				<div className="max-w-[500px] space-y-2">
					<div>
						<Label htmlFor="bio">Bio</Label>
						<Textarea
							onChange={(e) => setNewBio(e.target.value)}
							defaultValue={newBio}
							className="mt-2"
							name="bio"
						/>
					</div>
					<div>
						<Label htmlFor="skills">Skills</Label>
						<TagInput
							inputFieldPostion="top"
							placeholder="Type and then press enter to add a skill..."
							tags={newSkills}
							className="sm:min-w-[450px] mt-2"
							setTags={(newTags) => {
								setNewSkills(newTags);
							}}
						/>
					</div>
					<div>
						<Label htmlFor={"discord"}>Discord Username</Label>
						<Input
							className={"mt-2"}
							name={"discord"}
							type={"text"}
							value={newDiscord}
							onChange={(e) => setNewDiscord(e.target.value)}
						/>
						{(!newDiscord) ?
							<div className={"mt-1 text-sm text-red-500"}>This field can't be empty!</div> : null
						}
					</div>
					<Button
						onClick={() => {
							toast.loading("Updating Profile...", {
								duration: 0,
							});
							runModifyProfileData({
								pronouns: newPronouns,
								bio: newBio,
								skills: newSkills.map((v) => v.text.toLowerCase()),
								discordUsername: newDiscord
							});
						}}
						className="mt-5"
					>
						Update
					</Button>
				</div>
			</div>
		</main>
	);
}
