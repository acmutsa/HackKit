"use client";

import { Button } from "@/components/shadcn/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { useAction } from "next-safe-action/hook";
import { modifyRegistrationData } from "@/actions/user-profile-mod";

interface RegistrationData {
	age: number;
	gender: string;
	race: string;
	ethnicity: string;
	university: string;
	major: string;
	shortID: string;
	levelOfStudy: string;
	hackathonsAttended: number;
	softwareExperience: string;
	shirtSize: string;
	dietRestrictions: any;
	accommodationNote: string | null;
	GitHub: string | null;
	LinkedIn: string | null;
	PersonalWebsite: string | null;
}

interface RegistrationSettingsProps {
	data: RegistrationData;
}

export default function RegistrationSettings({ data }: RegistrationSettingsProps) {
	const [newAge, setNewAge] = useState(data.age);
	const [newGender, setNewGender] = useState(data.gender);
	const [newRace, setNewRace] = useState(data.race);
	const [newEthnicity, setNewEthnicity] = useState(data.ethnicity);
	const [newUniversity, setNewUniversity] = useState(data.university);
	const [newMajor, setNewMajor] = useState(data.major);
	const [newShortID, setNewShortID] = useState(data.shortID);
	const [newLevelOfStudy, setNewLevelOfStudy] = useState(data.levelOfStudy);
	const [newHacakthonsAttended, setNewHackathonsAttended] = useState(data.hackathonsAttended);
	const [newSoftwareExperience, setNewSoftwareExperience] = useState(data.softwareExperience);
	const [newShirtSize, setNewShirtSize] = useState(data.shirtSize);
	const [newDietRestrictions, setNewDietRestrictions] = useState(data.dietRestrictions);
	const [newAccommodationNote, setNewAccommodationNote] = useState(data.accommodationNote);
	const [newGithub, setNewGithub] = useState(data.GitHub);
	const [newLinkedIn, setNewLinkedIn] = useState(data.LinkedIn);
	const [newPersonalWebsite, setNewPersonalWebsite] = useState(data.PersonalWebsite);

	if (newAccommodationNote === null) setNewAccommodationNote("");
	if (newGithub === null) setNewGithub("");
	if (newLinkedIn === null) setNewLinkedIn("");
	if (newPersonalWebsite === null) setNewPersonalWebsite("");

	const { execute: runModifyRegistrationSettings } = useAction(
		modifyRegistrationData,
		{
			onSuccess: () => {
				toast.dismiss();
				toast.success("Registration settings updated successfully!");
			},
			onError: () => {
				toast.dismiss();
				toast.error("An error occurred while updating your registration settings!");
			},
		},
	);

	return (
		<main>
			<div className="rounded-lg border-2 border-muted px-5 py-5">
				<div className={"mb-5"}>
					Registration data is only editable in the form. <i>Note: Some hackathons may not accept edited information as it is already in their database</i>
				</div>
				<Button variant={"secondary"}>Click here to go back to registration form</Button>
			</div>
		</main>
	);
}
