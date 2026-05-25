import { HackTagForm } from "@hackkit/ui";
import { getCurrentUser } from "@/lib/runtime";
import { getOnboardingSteps } from "@/lib/onboarding";
import { OnboardingShell } from "../onboarding-shell";

export const dynamic = "force-dynamic";

export default async function HackTagOnboardingPage() {
	const currentUser = await getCurrentUser();
	const steps = await getOnboardingSteps("/onboarding/hacktag");

	return (
		<OnboardingShell
			steps={steps}
			title="Claim your HackTag"
			description="Pick a public handle before continuing with registration."
		>
			<HackTagForm
				currentUser={currentUser}
				defaultValues={
					currentUser.hackTag
						? { hackTag: currentUser.hackTag }
						: undefined
				}
				successRedirectTo="/onboarding/user-data"
			/>
		</OnboardingShell>
	);
}
