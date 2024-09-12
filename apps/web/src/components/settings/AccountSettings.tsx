"use client";

import { Input } from "@/components/shadcn/ui/input";
import { Button } from "@/components/shadcn/ui/button";
import { Label } from "@/components/shadcn/ui/label";
import { toast } from "sonner";
import { useState } from "react";
import { useAction } from "next-safe-action/hook";
import { modifyAccountSettings } from "@/actions/user-profile-mod";

interface UserProps {
	firstName: string;
	lastName: string;
}
interface AccountSettingsProps {
	user: UserProps;
}

export default function AccountSettings({ user }: AccountSettingsProps) {
	const [newFirstName, setNewFirstName] = useState(user.firstName);
	const [newLastName, setNewLastName] = useState(user.lastName);

	const { execute: runModifyAccountSettings } = useAction(
		modifyAccountSettings,
		{
			onSuccess: () => {
				toast.dismiss();
				toast.success("Name updated successfully!");
			},
			onError: () => {
				toast.dismiss();
				toast.error("An error occurred while updating your name!");
			},
		},
	);

	return (
		<main>
			<div className="rounded-lg border-2 border-muted px-5 py-10">
				<h2 className="pb-5 text-3xl font-semibold">
					Personal Information
				</h2>
				<div className="max-w-[500px] space-y-4">
					<div>
						<Label htmlFor="firstname">First Name</Label>
						<Input
							className="mt-2"
							name="firstname"
							value={newFirstName}
							onChange={(e) => setNewFirstName(e.target.value)}
						/>
					</div>
					<div>
						<Label htmlFor="lastname">Last Name</Label>
						<Input
							className="mt-2"
							name="lastname"
							value={newLastName}
							onChange={(e) => setNewLastName(e.target.value)}
						/>
					</div>
					<Button
						className="mt-5"
						onClick={() => {
							toast.loading("Updating name...");
							runModifyAccountSettings({
								firstName: newFirstName,
								lastName: newLastName,
							});
						}}
					>
						Update
					</Button>
				</div>
			</div>
		</main>
	);
}
