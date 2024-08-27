"use client";

import { Input } from "@/components/shadcn/ui/input";
import { Button } from "@/components/shadcn/ui/button";
import { Label } from "@/components/shadcn/ui/label";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/shadcn/ui/dropdown-menu";
import { toast } from "sonner";
import { useState } from "react";
import { users } from "db/schema";
import { z } from "zod";
import { useAction } from "next-safe-action/hook";
import { modifyAccountSettings } from "@/actions/user-profile-mod";

interface RegistrationDataProps {
	age: number;
	gender: string;
	race: string;
	ethnicity: string;
}

interface UserProps {
	firstName: string;
	lastName: string;
	email: string;
	registrationData: RegistrationDataProps;
}

interface AccountSettingsProps {
	user: UserProps;
}

export default function AccountSettings({ user }: AccountSettingsProps) {
	const [newFirstName, setNewFirstName] = useState(user.firstName);
	const [newLastName, setNewLastName] = useState(user.lastName);
	const [newEmail, setNewEmail] = useState(user.email);
	const [newAge, setNewAge] = useState(user.registrationData.age);
	const [newGender, setNewGender] = useState(user.registrationData.gender);
	const [newRace, setNewRace] = useState(user.registrationData.race);
	const [newEthnicity, setNewEthnicity] = useState(
		user.registrationData.ethnicity,
	);

	const { execute: runModifyAccountSettings } = useAction(
		modifyAccountSettings,
		{
			onSuccess: () => {
				toast.dismiss();
				toast.success("Account updated successfully!");
			},
			onError: () => {
				toast.dismiss();
				toast.error("An error occurred while updating your account settings!");
			},
		},
	);

	let textGender: string, textRace: string, textEthnicity: string;
	if (newGender === "MALE") textGender = "Male";
	else if (newGender === "FEMALE") textGender = "Female";
	else if (newGender === "NON-BINARY") textGender = "Non-binary";
	else if (newGender === "OTHER") textGender = "Other";
	else if (newGender === "PREFERNOTSAY") textGender = "Prefer not to say";
	else textGender = "ERROR";

	if (newRace === "Native American") textRace = "Native American";
	else if (newRace === "Asian / Pacific Islander")
		textRace = "Asian / Pacific Islander";
	else if (newRace === "Black or African American")
		textRace = "Black or African American";
	else if (newRace === "White / Caucasion") textRace = "White / Caucasion";
	else if (newRace === "Multiple / Other") textRace = "Multiple / Other";
	else if (newRace === "Prefer not to say") textRace = "Prefer not to say";
	else textRace = "ERROR";

	if (newEthnicity === "Hispanic or Latino")
		textEthnicity = "Hispanic or Latino";
	else if (newEthnicity === "Not Hispanic or Latino")
		textEthnicity = "Not Hispanic or Latino";
	else textEthnicity = "ERROR";

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
					<div className={"col-span-full"}>
						<Label htmlFor="email">Email</Label>
						<Input
							className="mt-2"
							name="email"
							type="email"
							value={newEmail}
							onChange={(e) => setNewEmail(e.target.value)}
						/>
					</div>
					{/* THIS IS FOR REGISTRATION. NOT SURE IF WE WANT THIS TO BE EDITABLE. DEPENDS ON HOW REGISTRATION WORKS */}
					{/*<div>
						<Label htmlFor="age">Age</Label>
						<Input
							className="mt-2"
							name="age"
							type="number"
							value={newAge}
							onChange={(e) => setNewAge(+e.target.value)}
						/>
					</div>
					<div className="mt-2 grid grid-cols-1">
						<Label htmlFor="gender">Gender</Label>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" className="mt-2">
									{textGender}
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-56">
								<DropdownMenuRadioGroup
									value={newGender}
									onValueChange={setNewGender}
								>
									<DropdownMenuRadioItem value="MALE">
										Male
									</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="FEMALE">
										Female
									</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="NON-BINARY">
										Non-binary
									</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="OTHER">
										Other
									</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="PREFERNOTSAY">
										Prefer not to say
									</DropdownMenuRadioItem>
								</DropdownMenuRadioGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<div className="mt-2 grid grid-cols-1">
						<Label htmlFor="race">Race</Label>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" className="mt-2">
									{textRace}
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-56">
								<DropdownMenuRadioGroup
									value={newRace}
									onValueChange={setNewRace}
								>
									<DropdownMenuRadioItem value="Native American">
										Native American
									</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="Asian / Pacific Islander">
										Asian / Pacific Islander
									</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="Black or African American">
										Black or African American
									</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="White / Caucasion">
										White / Caucasion
									</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="Multiple / Other">
										Multiple / Other
									</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="Prefer not to say">
										Prefer not to say
									</DropdownMenuRadioItem>
								</DropdownMenuRadioGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<div className="mt-2 grid grid-cols-1">
						<Label htmlFor="ethnicity">Ethnicity</Label>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" className="mt-2">
									{textEthnicity}
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-56">
								<DropdownMenuRadioGroup
									value={newEthnicity}
									onValueChange={setNewEthnicity}
								>
									<DropdownMenuRadioItem value="Hispanic or Latino">
										Hispanic or Latino
									</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="Not Hispanic or Latino">
										Not Hispanic or Latino
									</DropdownMenuRadioItem>
								</DropdownMenuRadioGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					*/}
				</div>
				<Button
					className="mt-5"
					onClick={() => {
						toast.loading("Updating settings...");
						runModifyAccountSettings({
							firstName: newFirstName,
							lastName: newLastName,
							email: newEmail,
						});
					}}
				>
					Update
				</Button>
			</div>
		</main>
	);
}
