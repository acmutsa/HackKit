import "server-only";

import {
	buildCompetitorOnboardingSteps,
	getNextOnboardingStepHref,
	type CompetitorOnboardingStep,
} from "@hackkit/ui";
import { CoreSetting } from "@hackkit/core";
import { getCurrentUser, getHackkit, getRuntime } from "./runtime";

async function loadCompetitorOnboardingInput(currentPath: string) {
	const user = await getCurrentUser();
	const hackkit = await getHackkit();
	const runtime = await getRuntime();
	const [userData, hacker, requireApproval] = await Promise.all([
		hackkit.userData.getUserData(user.authId),
		hackkit.hackers.getHacker(user.authId),
		runtime.getSettingValue(CoreSetting.RequireApproval),
	]);
	return {
		user,
		userData,
		hacker,
		requireApproval: Boolean(requireApproval),
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

export async function getRequireApproval(): Promise<boolean> {
	return Boolean(await (await getRuntime()).getSettingValue(CoreSetting.RequireApproval));
}
