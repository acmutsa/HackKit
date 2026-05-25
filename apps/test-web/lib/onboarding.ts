import "server-only";

import {
	buildCompetitorOnboardingSteps,
	type CompetitorOnboardingStep,
} from "@hackkit/ui";
import hackkitConfig from "../hackkit.config";
import { getCurrentUser, getHackkit } from "./runtime";

export async function getOnboardingSteps(
	currentPath: string,
): Promise<CompetitorOnboardingStep[]> {
	const currentUser = await getCurrentUser();
	const hackkit = await getHackkit();
	const userData = await hackkit.userData.getUserData(currentUser.authId);
	const hacker = await hackkit.hackers.getHacker(currentUser.authId);

	return buildCompetitorOnboardingSteps({
		user: currentUser,
		userData,
		hacker,
		requireApproval: hackkitConfig.requireApproval ?? false,
		currentPath,
	});
}

export function getRequireApproval(): boolean {
	return hackkitConfig.requireApproval ?? false;
}
