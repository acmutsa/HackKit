"use client";

import { Input } from "@/components/shadcn/ui/input";
import { Button } from "@/components/shadcn/ui/button";
import { Label } from "@/components/shadcn/ui/label";
import { toast } from "sonner";
import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { modifyAccountSettings } from "@/actions/user-profile-mod";
import { Checkbox } from "@/components/shadcn/ui/checkbox";
import c from "config";
import { Loader2 } from "lucide-react";
import { isProfane } from "no-profanity";

interface UserProps {
	firstName: string;
	lastName: string;
	email: string;
	hackerTag: string;
	isSearchable: boolean;
}

export default function AccountSettings({ user }: { user: UserProps }) {
	const [newFirstName, setNewFirstName] = useState(user.firstName);
	const [newLastName, setNewLastName] = useState(user.lastName);
	//const [newEmail, setNewEmail] = useState(user.email);
	const [newHackerTag, setNewHackerTag] = useState(user.hackerTag);
	const [newIsProfileSearchable, setNewIsProfileSearchable] = useState(
		user.isSearchable,
	);
	const [hackerTagTakenAlert, setHackerTagTakenAlert] = useState(false);

	const { execute: runModifyAccountSettings, status: loadingState } =
		useAction(modifyAccountSettings, {
			onSuccess: ({ data }) => {
				toast.dismiss();
				if (!data?.success) {
					if (data?.message == "hackertag_not_unique") {
						toast.error("Hackertag already exists");
						setHackerTagTakenAlert(true);
					}
				} else toast.success("Account updated successfully!");
			},
			onError: () => {
				toast.dismiss();
				toast.error(
					"An error occurred while updating your account settings!",
				);
			},
		});

	return (
		<main>
			<div className="rounded-lg border-2 border-muted px-5 py-10">
				<h2 className="pb-5 text-3xl font-semibold">
					Personal Information
				</h2>
				<div className="grid max-w-[500px] grid-cols-2 gap-x-2 gap-y-2">
					<div>
						<Label htmlFor="firstname">First Name</Label>
						<Input
							className="mt-2"
							name="firstname"
							value={newFirstName}
							onChange={(e) => setNewFirstName(e.target.value)}
						/>
						{!newFirstName ? (
							<div className={"mt-1 text-sm text-red-500"}>
								This field can't be empty!
							</div>
						) : null}
					</div>
					<div>
						<Label htmlFor={"lastname"}>Last Name</Label>
						<Input
							className="mt-2"
							name="lastname"
							value={newLastName}
							onChange={(e) => setNewLastName(e.target.value)}
						/>
						{!newLastName ? (
							<div className={"mt-1 text-sm text-red-500"}>
								This field can't be empty!
							</div>
						) : null}
					</div>
				</div>
				<h2 className="pb-5 pt-7 text-3xl font-semibold">
					Public Information
				</h2>
				<div className="grid max-w-[500px] grid-cols-1 gap-x-2 gap-y-2">
					<div>
						<Label htmlFor="hackertag">HackerTag</Label>
						<div className="mt-2 flex">
							<div className="flex h-10 w-10 items-center justify-center rounded-l bg-accent text-lg font-light text-primary">
								@
							</div>
							<Input
								className="rounded-l-none"
								placeholder={`${c.hackathonName.toLowerCase()}`}
								value={newHackerTag}
								onChange={(e) => {
									setNewHackerTag(e.target.value);
									setHackerTagTakenAlert(false);
								}}
							/>
						</div>
						{hackerTagTakenAlert ? (
							<div className={"text-sm text-red-500"}>
								HackerTag is already taken!
							</div>
						) : (
							""
						)}
						{!newHackerTag ? (
							<div className={"mt-1 text-sm text-red-500"}>
								This field can't be empty!
							</div>
						) : null}
					</div>
					<div
						className={
							"flex max-w-[600px] flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
						}
					>
						<Checkbox
							checked={newIsProfileSearchable}
							onCheckedChange={() =>
								setNewIsProfileSearchable(
									!newIsProfileSearchable,
								)
							}
						/>
						<Label htmlFor="profileIsSearchable">
							Make my profile searchable by other Hackers
						</Label>
					</div>
				</div>
				<Button
					className="mt-5"
					onClick={() => {
						if (isProfane(newHackerTag)) {
							toast.dismiss();
							toast.error("Profanity is not allowed");
							return;
						}
						toast.loading("Updating settings...");
						runModifyAccountSettings({
							firstName: newFirstName,
							lastName: newLastName,
							//email: newEmail,
							hackerTag: newHackerTag,
							hasSearchableProfile: newIsProfileSearchable,
						});
					}}
					disabled={loadingState === "executing"}
				>
					{loadingState === "executing" ? (
						<>
							<Loader2 className={"mr-2 h-4 w-4 animate-spin"} />
							<div>Updating</div>
						</>
					) : (
						"Update"
					)}
				</Button>
			</div>
		</main>
	);
}
