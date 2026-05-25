import {
	CompetitorOnboardingProgress,
	type CompetitorOnboardingStep,
} from "@hackkit/ui";
import type * as React from "react";

export function OnboardingShell({
	steps,
	title,
	description,
	children,
}: {
	steps: CompetitorOnboardingStep[];
	title: string;
	description: string;
	children: React.ReactNode;
}) {
	return (
		<main className="min-h-screen bg-muted/30 px-6 py-10">
			<div className="mx-auto flex max-w-4xl flex-col gap-6">
				<div className="space-y-2">
					<p className="text-sm font-medium text-primary">Competitor onboarding</p>
					<h1 className="text-3xl font-bold tracking-tight">{title}</h1>
					<p className="text-muted-foreground">{description}</p>
				</div>
				<CompetitorOnboardingProgress steps={steps} />
				{children}
			</div>
		</main>
	);
}
