import {
	CompetitorOnboardingProgress,
	ParticipantDashboard,
} from "@hackkit/ui";
import { publicSiteConfig } from "@/lib/public-site-config";
import { getHackkit } from "@/lib/runtime";
import {
	getCompetitorOnboardingState,
	getRequireApproval,
} from "@/lib/onboarding";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
	const {
		steps,
		nextHref,
		user: currentUser,
		userData,
		hacker,
	} = await getCompetitorOnboardingState("/dashboard");
	const [hackkit, requireApproval] = await Promise.all([
		getHackkit(),
		getRequireApproval(),
	]);
	const role = currentUser.roleId
		? await hackkit.roles.getRole(currentUser.roleId)
		: null;
	const participantName =
		[currentUser.firstName, currentUser.lastName].filter(Boolean).join(" ") ||
		currentUser.hackTag ||
		"participant";

	return (
		<ParticipantDashboard
			participantName={participantName}
			eventName={publicSiteConfig.event.name}
			roleName={role?.name ?? undefined}
			checkedIn={currentUser.checkedInAt != null}
			requireApproval={requireApproval}
			approved={currentUser.isApproved}
			primaryActions={publicSiteConfig.dashboard.primaryActions}
			resourceLinks={publicSiteConfig.dashboard.resourceLinks}
			statusItems={[
				{ label: "HackTag", value: currentUser.hackTag ?? "Not claimed" },
				{
					label: "Profile",
					value: userData ? "Complete" : "Needs information",
				},
				{
					label: "Hacker registration",
					value: hacker ? "Complete" : "Not registered",
				},
			]}
			onboarding={
				nextHref
					? {
							nextHref,
							progress: <CompetitorOnboardingProgress steps={steps} />,
						}
					: undefined
			}
		/>
	);
}
