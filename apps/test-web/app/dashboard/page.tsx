import Link from "next/link";
import {
	CompetitorOnboardingProgress,
	getNextOnboardingStepHref,
	isCompetitorOnboardingComplete,
} from "@hackkit/ui";
import { getCurrentUser, getHackkit } from "@/lib/runtime";
import { getOnboardingSteps, getRequireApproval } from "@/lib/onboarding";
import { BootstrapOwnerButton } from "./bootstrap-owner-button";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
	const currentUser = await getCurrentUser();
	const hackkit = await getHackkit();
	const userData = await hackkit.userData.getUserData(currentUser.authId);
	const hacker = await hackkit.hackers.getHacker(currentUser.authId);
	const role = currentUser.roleId
		? await hackkit.roles.getRole(currentUser.roleId)
		: null;
	const steps = await getOnboardingSteps("/dashboard");
	const onboardingComplete = isCompetitorOnboardingComplete(steps);
	const nextOnboardingHref = getNextOnboardingStepHref(steps);

	return (
		<main className="min-h-screen px-6 py-10">
			<div className="mx-auto max-w-3xl space-y-8">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
					<p className="text-muted-foreground">
						Role: {role?.name ?? "None"} · Check-in:{" "}
						{currentUser.checkedInAt ? "Yes" : "No"}
						{getRequireApproval()
							? ` · Approved: ${currentUser.isApproved ? "Yes" : "Pending"}`
							: ""}
					</p>
				</div>

				{!onboardingComplete && nextOnboardingHref ? (
					<section className="space-y-4 rounded-lg border bg-muted/30 p-4">
						<div className="space-y-1">
							<h2 className="text-lg font-semibold">Continue onboarding</h2>
							<p className="text-sm text-muted-foreground">
								Complete competitor registration to unlock the full test app
								experience.
							</p>
						</div>
						<CompetitorOnboardingProgress steps={steps} />
						<Link
							href={nextOnboardingHref}
							className="inline-flex text-sm font-medium text-primary hover:underline"
						>
							Continue to next step →
						</Link>
					</section>
				) : null}

				<section className="space-y-3">
					<h2 className="text-lg font-semibold">Participant</h2>
					<div className="flex flex-wrap gap-3 text-sm">
						<Link href="/schedule" className="text-primary hover:underline">
							Schedule
						</Link>
						<Link href="/pass" className="text-primary hover:underline">
							Event Pass
						</Link>
					</div>
				</section>

				<section className="space-y-3">
					<h2 className="text-lg font-semibold">Volunteer / admin</h2>
					<div className="flex flex-wrap gap-3 text-sm">
						<Link
							href="/admin/events"
							className="text-primary hover:underline"
						>
							Manage events
						</Link>
						<Link
							href="/admin/check-in"
							className="text-primary hover:underline"
						>
							Check-in scanner
						</Link>
					</div>
					<BootstrapOwnerButton />
				</section>

				<section className="space-y-2">
					<h2 className="text-lg font-semibold">Registration status</h2>
					<pre className="overflow-auto rounded-lg border bg-muted p-4 text-sm">
						{JSON.stringify(
							{
								hackTag: currentUser.hackTag,
								userDataComplete: userData != null,
								hackerRegistered: hacker != null,
								isApproved: currentUser.isApproved,
							},
							null,
							2,
						)}
					</pre>
				</section>

				<section className="space-y-2">
					<h2 className="text-lg font-semibold">User Data</h2>
					<pre className="overflow-auto rounded-lg border bg-muted p-4 text-sm">
						{JSON.stringify(userData, null, 2)}
					</pre>
				</section>
			</div>
		</main>
	);
}
