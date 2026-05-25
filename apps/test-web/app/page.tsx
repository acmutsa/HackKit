import { redirect } from "next/navigation";
import { getNextOnboardingStepHref } from "@hackkit/ui";
import { getAuthSession } from "@/lib/auth";
import { getOnboardingSteps } from "@/lib/onboarding";

export const dynamic = "force-dynamic";

export default async function HomePage() {
	const session = await getAuthSession();
	if (!session) redirect("/sign-in");

	const steps = await getOnboardingSteps("/");
	const nextHref = getNextOnboardingStepHref(steps);
	redirect(nextHref ?? "/dashboard");
}
