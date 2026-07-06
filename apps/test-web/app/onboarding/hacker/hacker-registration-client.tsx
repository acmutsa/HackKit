"use client";

import { HackerRegistrationForm } from "@hackkit/ui";
import type { User } from "@hackkit/core";
import type { HackerRegistrationOptions } from "@hackkit/config";
import { uploadResumeFile } from "@/lib/upload-resume";

export function HackerRegistrationClient({
	currentUser,
	defaultValues,
	registrationOptions,
	successRedirectTo = "/dashboard",
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
	registrationOptions?: HackerRegistrationOptions;
	successRedirectTo?: string;
}) {
	return (
		<HackerRegistrationForm
			currentUser={currentUser}
			defaultValues={defaultValues}
			localStorageKey={`test-web:onboarding:${currentUser.authId}:hacker`}
			successRedirectTo={successRedirectTo}
			schoolOptions={registrationOptions?.schools}
			majorOptions={registrationOptions?.majors}
			levelOfStudyOptions={registrationOptions?.levelsOfStudy}
			softwareExperienceOptions={registrationOptions?.softwareExperience}
			heardFromOptions={registrationOptions?.heardFrom}
			uploadResume={uploadResumeFile}
		/>
	);
}
