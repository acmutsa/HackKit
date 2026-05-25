import type { Hacker, User, UserData } from "@hackkit/core";

export type CompetitorOnboardingStepId =
	| "hacktag"
	| "user-data"
	| "hacker"
	| "approval";

export type CompetitorOnboardingStep = {
	id: CompetitorOnboardingStepId;
	label: string;
	href: string;
	done: boolean;
	current?: boolean;
};

export type BuildCompetitorOnboardingStepsInput = {
	user: User;
	userData: UserData | null;
	hacker: Hacker | null;
	requireApproval: boolean;
	currentPath?: string;
};

const STEP_ORDER: CompetitorOnboardingStepId[] = [
	"hacktag",
	"user-data",
	"hacker",
	"approval",
];

const STEP_META: Record<
	CompetitorOnboardingStepId,
	{ label: string; href: string }
> = {
	hacktag: { label: "HackTag", href: "/onboarding/hacktag" },
	"user-data": { label: "User Data", href: "/onboarding/user-data" },
	hacker: { label: "Hacker Registration", href: "/onboarding/hacker" },
	approval: { label: "Approval", href: "/dashboard" },
};

function isStepDone(
	id: CompetitorOnboardingStepId,
	input: BuildCompetitorOnboardingStepsInput,
): boolean {
	switch (id) {
		case "hacktag":
			return Boolean(input.user.hackTag);
		case "user-data":
			return input.userData != null;
		case "hacker":
			return input.hacker != null;
		case "approval":
			if (!input.requireApproval) return input.hacker != null;
			return input.user.isApproved;
	}
}

export function buildCompetitorOnboardingSteps(
	input: BuildCompetitorOnboardingStepsInput,
): CompetitorOnboardingStep[] {
	const steps: CompetitorOnboardingStep[] = STEP_ORDER.map((id) => ({
		id,
		label: STEP_META[id].label,
		href: STEP_META[id].href,
		done: isStepDone(id, input),
	}));

	if (input.currentPath) {
		for (const step of steps) {
			if (input.currentPath.startsWith(step.href)) {
				step.current = true;
				break;
			}
		}
	}

	if (!steps.some((step) => step.current)) {
		const firstIncomplete = steps.find((step) => !step.done);
		if (firstIncomplete) firstIncomplete.current = true;
	}

	return steps;
}

export function getNextOnboardingStepHref(
	steps: CompetitorOnboardingStep[],
): string | null {
	const next = steps.find((step) => !step.done);
	return next?.href ?? null;
}

export function isCompetitorOnboardingComplete(
	steps: CompetitorOnboardingStep[],
): boolean {
	return steps.every((step) => step.done);
}
