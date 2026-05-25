"use client";

import { HackerRegistrationForm } from "@hackkit/ui";
import type { User } from "@hackkit/core";
import type { Hacker } from "@hackkit/core";
import { uploadResumeFile } from "@/lib/upload-resume";

export function HackerRegistrationClient({
	currentUser,
	defaultValues,
}: {
	currentUser: User;
	defaultValues?: Partial<{
		university: string;
		major: string;
		schoolId?: string;
		levelOfStudy: string;
		hackathonsAttended: number;
		softwareExperience: string;
		heardFrom?: string;
		githubUrl?: string;
		linkedInUrl?: string;
		personalWebsiteUrl?: string;
		resumeUrl?: string;
	}>;
}) {
	return (
		<HackerRegistrationForm
			currentUser={currentUser}
			defaultValues={defaultValues}
			successRedirectTo="/dashboard"
			uploadResume={uploadResumeFile}
		/>
	);
}

export function toHackerFormDefaults(hacker: Hacker | null) {
	if (!hacker) return undefined;
	return {
		university: hacker.university,
		major: hacker.major,
		schoolId: hacker.schoolId,
		levelOfStudy: hacker.levelOfStudy,
		hackathonsAttended: hacker.hackathonsAttended,
		softwareExperience: hacker.softwareExperience,
		heardFrom: hacker.heardFrom,
		githubUrl: hacker.githubUrl,
		linkedInUrl: hacker.linkedInUrl,
		personalWebsiteUrl: hacker.personalWebsiteUrl,
		resumeUrl: hacker.resumeUrl,
	};
}
