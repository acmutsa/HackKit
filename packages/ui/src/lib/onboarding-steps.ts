import type { Hacker, User, UserData } from "@hackkit/core";
import {
	DEFAULT_HACKKIT_UI_ROUTES,
	type HackKitUIRoutes,
	type HackKitUIRoutesInput,
	resolveHackKitUIRoutes,
} from "../navigation";

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
	/** Route map override; defaults preserve the generated Next App Router paths. */
	routes?: HackKitUIRoutesInput | HackKitUIRoutes;
};

const STEP_ORDER: CompetitorOnboardingStepId[] = [
	"hacktag",
	"user-data",
	"hacker",
	"approval",
];

const STEP_LABELS: Record<CompetitorOnboardingStepId, string> = {
	hacktag: "HackTag",
	"user-data": "User Data",
	hacker: "Hacker Registration",
	approval: "Approval",
};

function stepHrefs(routes: HackKitUIRoutes): Record<CompetitorOnboardingStepId, string> {
	return {
		hacktag: routes.onboarding.hacktag,
		"user-data": routes.onboarding.userData,
		hacker: routes.onboarding.hacker,
		approval: routes.dashboard,
	};
}

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
	const routes = input.routes
		? resolveHackKitUIRoutes(input.routes)
		: DEFAULT_HACKKIT_UI_ROUTES;

	const hrefs = stepHrefs(routes);
	const steps: CompetitorOnboardingStep[] = STEP_ORDER.map((id) => ({
		id,
		label: STEP_LABELS[id],
		href: hrefs[id],
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
