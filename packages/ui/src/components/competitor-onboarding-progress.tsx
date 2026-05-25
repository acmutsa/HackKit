import Link from "next/link";
import { cn } from "../lib/cn";
import type { CompetitorOnboardingStep } from "../lib/onboarding-steps";

export type CompetitorOnboardingProgressProps = {
	steps: CompetitorOnboardingStep[];
	className?: string;
};

export function CompetitorOnboardingProgress({
	steps,
	className,
}: CompetitorOnboardingProgressProps) {
	return (
		<nav
			aria-label="Competitor onboarding progress"
			className={cn("w-full", className)}
		>
			<ol className="flex flex-wrap gap-3">
				{steps.map((step, index) => (
					<li key={step.id} className="flex items-center gap-3">
						<Link
							href={step.href}
							className={cn(
								"inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm transition-colors",
								step.current && "border-primary bg-primary/10",
								step.done &&
									!step.current &&
									"border-emerald-500/40 text-emerald-700 dark:text-emerald-300",
								!step.done &&
									!step.current &&
									"text-muted-foreground hover:border-primary/40",
							)}
						>
							<span
								className={cn(
									"flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold",
									step.done
										? "bg-emerald-600 text-white"
										: step.current
											? "bg-primary text-primary-foreground"
											: "bg-muted text-muted-foreground",
								)}
							>
								{step.done ? "✓" : index + 1}
							</span>
							{step.label}
						</Link>
						{index < steps.length - 1 ? (
							<span className="hidden text-muted-foreground sm:inline">
								→
							</span>
						) : null}
					</li>
				))}
			</ol>
		</nav>
	);
}
