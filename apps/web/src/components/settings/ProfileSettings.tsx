"use client";

import { Input } from "@/components/shadcn/ui/input";
import { Button } from "@/components/shadcn/ui/button";
import { Label } from "@/components/shadcn/ui/label";
import { Textarea } from "@/components/shadcn/ui/textarea";
import { modifyUserBioAndSkills } from "@/actions/user-profile-mod";
import { useAction } from "next-safe-action/hook";
import { toast } from "sonner";
import { useState } from "react";

interface ProfileSettingsProps {
	bio: string;
}

export default function ProfileSettings({ bio }: ProfileSettingsProps) {
	const [newBio, setNewBio] = useState(bio);

	const { execute: runUpdateBioAndSkills } = useAction(modifyUserBioAndSkills, {
		onSuccess: () => {
			toast("Profile updated successfully!");
		},
	});

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
						/>
					</div>
					<Button className="mt-5">Update</Button>
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
