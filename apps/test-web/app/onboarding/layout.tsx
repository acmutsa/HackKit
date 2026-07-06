import type * as React from "react";
import { getPageGuards } from "@/lib/runtime";

export const dynamic = "force-dynamic";

export default async function OnboardingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const guards = await getPageGuards();
	await guards.requireOnboardingAccess();
	return children;
}
