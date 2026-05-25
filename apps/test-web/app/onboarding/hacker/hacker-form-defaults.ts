import type { Hacker } from "@hackkit/core";

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
