import "server-only";

import {
	buildCompetitorOnboardingSteps,
	getNextOnboardingStepHref,
	type CompetitorOnboardingStep,
} from "@hackkit/ui";
import hackkitConfig from "../hackkit.config";
import { getCurrentUser, getHackkit } from "./runtime";

async function loadCompetitorOnboardingInput(currentPath: string) {
	const user = await getCurrentUser();
	const hackkit = await getHackkit();
	const [userData, hacker] = await Promise.all([
		hackkit.userData.getUserData(user.authId),
		hackkit.hackers.getHacker(user.authId),
	]);
	return {
		user,
		userData,
		hacker,
		requireApproval: hackkitConfig.requireApproval ?? false,
		currentPath,
	};
}

export async function getOnboardingSteps(
	currentPath: string,
): Promise<CompetitorOnboardingStep[]> {
	const input = await loadCompetitorOnboardingInput(currentPath);
	return buildCompetitorOnboardingSteps(input);
}

export async function getCompetitorOnboardingState(currentPath: string) {
	const input = await loadCompetitorOnboardingInput(currentPath);
	const steps = buildCompetitorOnboardingSteps(input);
	return {
		steps,
		nextHref: getNextOnboardingStepHref(steps),
		user: input.user,
		userData: input.userData,
		hacker: input.hacker,
	};
}

export function getRequireApproval(): boolean {
	return hackkitConfig.requireApproval ?? false;
}
