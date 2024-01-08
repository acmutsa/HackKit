"use client";

import { Input } from "@/components/shadcn/ui/input";
import { Button } from "@/components/shadcn/ui/button";
import { Label } from "@/components/shadcn/ui/label";
import { Textarea } from "@/components/shadcn/ui/textarea";
import { modifyUserBioAndSkills, updateProfileImage } from "@/actions/user-profile-mod";
import { useUser } from "@clerk/nextjs";
import { useAction } from "next-safe-action/hook";
import { toast } from "sonner";
import { useState } from "react";
import { encodeFileAsBase64 } from "@/lib/utils/shared/files";

interface ProfileSettingsProps {
	bio: string;
}

export default function ProfileSettings({ bio }: ProfileSettingsProps) {
	const [newBio, setNewBio] = useState(bio);
	const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
	const { user } = useUser();

	const { execute: runUpdateBioAndSkills } = useAction(modifyUserBioAndSkills, {
		onSuccess: () => {
			toast.dismiss();
			toast.success("Profile updated successfully!");
		},
		onError: () => {
			toast.dismiss();
			toast.error("An error occurred while updating your profile!");
		},
	});

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
			<div className="border-2 border-muted rounded-lg py-10 px-5">
				<h2 className="font-semibold text-3xl pb-5">Profile Photo</h2>
				<div className="max-w-[500px] space-y-4">
					<div>
						<Label htmlFor="photo">Profile Photo</Label>
						<Input
							accept=".jpg, .jpeg, .png, .svg, .gif, .mp4"
							type="file"
							name="photo"
							className="mt-2 mb-4 dark:bg-transparent cursor-pointer file:cursor-pointer file:text-primary dark:border-primary dark:ring-offset-primary"
							onChange={handleFileChange}
						/>
					</div>
					<Button
						onClick={async () => {
							console.log("Button clicked");
							if (!newProfileImage) {
								return toast.error("Please select a Profile Photo to upload!");
							}
							toast.loading("Updating Profile Photo...", { duration: 0 });
							const b64 = await encodeFileAsBase64(newProfileImage);
							runUpdateProfileImage({ fileBase64: b64, fileName: newProfileImage.name });
						}}
						className="mt-5"
					>
						Update
					</Button>
				</div>
			</div>
			<div className="border-2 border-muted rounded-lg py-10 px-5 mt-5">
				<h2 className="font-semibold text-3xl pb-5">Profile Data</h2>
				<div className="max-w-[500px] space-y-4">
					<div>
						<Label htmlFor="firstname">Bio</Label>
						<Textarea
							onChange={(e) => setNewBio(e.target.value)}
							defaultValue={bio}
							className="mt-2"
							name="firstname"
						/>
					</div>
					<div>
						<Label htmlFor="firstname">Skills</Label>
						<Textarea className="mt-2" name="firstname" />
					</div>
					<Button
						onClick={() => {
							toast.loading("Updating Profile...", { duration: 0 });
							runUpdateBioAndSkills({ bio: newBio, skills: "" });
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
