"use client";

import { HackerRegistrationForm } from "@hackkit/ui";
import type { User } from "@hackkit/core";
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
			localStorageKey={`test-web:onboarding:${currentUser.authId}:hacker`}
			successRedirectTo="/dashboard"
			uploadResume={uploadResumeFile}
		/>
	);
}
