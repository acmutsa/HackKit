import { redirect } from "next/navigation";
import { getCurrentUser, getHackkit, getPageGuards } from "@/lib/runtime";
import { appConfig } from "@/lib/app-config";
import { getOnboardingSteps } from "@/lib/onboarding";
import { OnboardingShell } from "../onboarding-shell";
import { HackerRegistrationClient } from "./hacker-registration-client";
import { toHackerFormDefaults } from "./hacker-form-defaults";

export const dynamic = "force-dynamic";

export default async function HackerOnboardingPage() {
	await (await getPageGuards()).requireHackerRegistrationOpenForNewHacker();
	const currentUser = await getCurrentUser();
	if (!currentUser.hackTag) {
		redirect("/onboarding/hacktag");
	}

	const hackkit = await getHackkit();
	const userData = await hackkit.userData.getUserData(currentUser.authId);
	if (!userData) {
		redirect("/onboarding/user-data");
	}

	const hacker = await hackkit.hackers.getHacker(currentUser.authId);
	const steps = await getOnboardingSteps("/onboarding/hacker");

	return (
		<OnboardingShell
			steps={steps}
			title="Hacker Registration"
			description="Tell us about your school, experience, and optional resume."
		>
			<HackerRegistrationClient
				currentUser={currentUser}
				defaultValues={toHackerFormDefaults(hacker)}
				registrationOptions={appConfig.hackerRegistrationOptions}
			/>
		</OnboardingShell>
	);
}
