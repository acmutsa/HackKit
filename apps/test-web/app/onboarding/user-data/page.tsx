import { UserDataForm, toUserDataFormDefaultValues } from "@hackkit/ui";
import { redirect } from "next/navigation";
import { getCurrentUser, getHackkit } from "@/lib/runtime";
import { getOnboardingSteps } from "@/lib/onboarding";
import { OnboardingShell } from "../onboarding-shell";

export const dynamic = "force-dynamic";

export default async function UserDataOnboardingPage() {
	const currentUser = await getCurrentUser();
	if (!currentUser.hackTag) {
		redirect("/onboarding/hacktag");
	}

	const hackkit = await getHackkit();
	const existingUserData = await hackkit.userData.getUserData(
		currentUser.authId,
	);
	const steps = await getOnboardingSteps("/onboarding/user-data");

	return (
		<OnboardingShell
			steps={steps}
			title="User Data"
			description="Complete required MLH, demographic, and logistics information."
		>
			<UserDataForm
				currentUser={currentUser}
				userDataOptions={hackkit.userData.options}
				defaultValues={
					existingUserData
						? toUserDataFormDefaultValues(existingUserData)
						: undefined
				}
				successRedirectTo="/onboarding/hacker"
			/>
		</OnboardingShell>
	);
}
