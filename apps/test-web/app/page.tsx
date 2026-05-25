import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { getCompetitorOnboardingState } from "@/lib/onboarding";

export const dynamic = "force-dynamic";

export default async function HomePage() {
	const session = await getAuthSession();
	if (!session) redirect("/sign-in");

	const { nextHref } = await getCompetitorOnboardingState("/");
	redirect(nextHref ?? "/dashboard");
}
