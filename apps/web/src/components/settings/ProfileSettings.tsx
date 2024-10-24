"use client";

import { Input } from "@/components/shadcn/ui/input";
import { Button } from "@/components/shadcn/ui/button";
import { Label } from "@/components/shadcn/ui/label";
import { Textarea } from "@/components/shadcn/ui/textarea";
import {
	modifyProfileData,
	updateProfileImage,
} from "@/actions/user-profile-mod";
import { useUser } from "@clerk/nextjs";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { useState } from "react";
import { encodeFileAsBase64 } from "@/lib/utils/shared/files";
import { Tag, TagInput } from "@/components/shadcn/ui/tag/tag-input";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/shadcn/ui/avatar";

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

export default function ProfileSettings({ profile }: ProfileSettingsProps) {
	const [newPronouns, setNewPronouns] = useState<string>(profile.pronouns);
	const [newBio, setNewBio] = useState(profile.bio);
	const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
	let curSkills: Tag[] = [];
	// for (let i = 0; i < profile.skills.length; i++) {
	// 	let t: Tag = {
	// 		id: profile.skills[i],
	// 		text: profile.skills[i],
	// 	};
	// 	curSkills.push(t);
	// }
	profile.skills.map((skill) => {
		curSkills.push({
			id: skill,
			text: skill,
		});
	});
	const [newSkills, setNewSkills] = useState<Tag[]>(curSkills);
	const [newDiscord, setNewDiscord] = useState(profile.discord || "");

	const [isProfilePictureLoading, setIsProfilePictureLoading] =
		useState(false);
	const [isProfileSettingsLoading, setIsProfileSettingsLoading] =
		useState(false);

	const { user } = useUser();

	const { execute: runModifyProfileData } = useAction(modifyProfileData, {
		onSuccess: () => {
			setIsProfileSettingsLoading(false);
			toast.dismiss();
			toast.success("Profile updated successfully!");
		},
		onError: () => {
			setIsProfileSettingsLoading(false);
			toast.dismiss();
			toast.error("An error occurred while updating your profile!");
		},
	});

	const { execute: runUpdateProfileImage } = useAction(updateProfileImage, {
		onSuccess: async () => {
			setIsProfilePictureLoading(false);
			toast.dismiss();
			await user?.setProfileImage({ file: newProfileImage });
			toast.success("Profile Photo updated successfully!");
		},
		onError: (err) => {
			setIsProfilePictureLoading(false);
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
						<Avatar className={"h-24 w-24"}>
							<AvatarImage
								src={profile.profilePhoto}
								alt={"@shadcn"}
							></AvatarImage>
						</Avatar>
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
							setIsProfilePictureLoading(true);
							console.log("Button clicked");
							if (!newProfileImage) {
								setIsProfilePictureLoading(false);
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
						disabled={isProfilePictureLoading}
					>
						{isProfilePictureLoading ? (
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
							className="mt-2 sm:min-w-[450px]"
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
					</div>
					<Button
						onClick={() => {
							setIsProfileSettingsLoading(true);
							toast.loading("Updating Profile...", {
								duration: 0,
							});
							runModifyProfileData({
								pronouns: newPronouns,
								bio: newBio,
								skills: newSkills.map((v) =>
									v.text.toLowerCase(),
								),
								discord: newDiscord,
							});
						}}
						className="mt-5"
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
			</div>
		</main>
	);
}
