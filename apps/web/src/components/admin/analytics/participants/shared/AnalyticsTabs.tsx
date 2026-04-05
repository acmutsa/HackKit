"use client";

import {
	AcquisitionParticipantAnalytics,
	DemographicsParticipantAnalytics,
	EducationParticipantAnalytics,
	ExperienceParticipantAnalytics,
	LogisticsParticipantAnalytics,
	OverviewParticipantAnalytics,
	SkillsParticipantAnalytics,
} from "@/components/admin/analytics/participants";
import {
	PARTICIPANT_ANALYTICS_SECTIONS,
	type ParticipantAnalyticsSection,
} from "@/components/admin/analytics/participants/types";
import {
	Briefcase,
	GraduationCap,
	LayoutDashboard,
	Megaphone,
	Truck,
	Users,
	Wrench,
	type LucideIcon,
} from "lucide-react";
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { Button } from "ui/components/button";
import { cn } from "ui/lib/utils";

type ParticipantTabMeta = {
	label: string;
	icon: LucideIcon;
	description: string;
};

const participantTabMetadata: Record<
	ParticipantAnalyticsSection,
	ParticipantTabMeta
> = {
	overview: {
		label: "Overview",
		icon: LayoutDashboard,
		description: "Overall registration and engagement metrics.",
	},
	education: {
		label: "Education",
		icon: GraduationCap,
		description: "Universities, majors, and level of study.",
	},
	demographics: {
		label: "Demographics",
		icon: Users,
		description: "Population makeup and representation.",
	},
	experience: {
		label: "Experience",
		icon: Briefcase,
		description: "Hackathon and software experience patterns.",
	},
	logistics: {
		label: "Logistics",
		icon: Truck,
		description: "Operational planning needs and constraints.",
	},
	acquisition: {
		label: "Acquisition",
		icon: Megaphone,
		description: "How participants heard about HackKit.",
	},
	skills: {
		label: "Skills",
		icon: Wrench,
		description: "Top participant-reported skills.",
	},
};

export default function AnalyticsTabs() {
	const [activeSection, setActiveSection] =
		useState<ParticipantAnalyticsSection>("overview");

	const tabListRef = useRef<HTMLDivElement | null>(null);
	const tabButtonRefs = useRef<
		Partial<Record<ParticipantAnalyticsSection, HTMLButtonElement | null>>
	>({});

	const [indicator, setIndicator] = useState<{
		left: number;
		width: number;
	} | null>(null);

	const updateIndicator = useCallback(() => {
		const tabList = tabListRef.current;
		const activeButton = tabButtonRefs.current[activeSection];

		if (!tabList || !activeButton) {
			return;
		}

		setIndicator({
			left: activeButton.offsetLeft,
			width: activeButton.offsetWidth,
		});
	}, [activeSection]);

	useLayoutEffect(() => {
		updateIndicator();
	}, [updateIndicator]);

	useEffect(() => {
		const rafId = window.requestAnimationFrame(() => {
			updateIndicator();
		});
		return () => window.cancelAnimationFrame(rafId);
	}, [activeSection, updateIndicator]);

	useEffect(() => {
		window.addEventListener("resize", updateIndicator);
		return () => window.removeEventListener("resize", updateIndicator);
	}, [updateIndicator]);
	const renderedSection = (() => {
		switch (activeSection) {
			case "overview":
				return <OverviewParticipantAnalytics />;
			case "education":
				return <EducationParticipantAnalytics />;
			case "demographics":
				return <DemographicsParticipantAnalytics />;
			case "experience":
				return <ExperienceParticipantAnalytics />;
			case "logistics":
				return <LogisticsParticipantAnalytics />;
			case "acquisition":
				return <AcquisitionParticipantAnalytics />;
			case "skills":
				return <SkillsParticipantAnalytics />;
			default:
				return null;
		}
	})();

	return (
		<div className="space-y-4">
			<div className="overflow-x-auto">
				<div className="flex min-w-full justify-start">
					<div
						ref={tabListRef}
						role="tablist"
						className="relative inline-flex min-w-max gap-4 rounded-xl bg-sidebar p-2"
					>
						{indicator ? (
							<div
								aria-hidden="true"
								className="pointer-events-none absolute inset-y-1 left-0 rounded-lg bg-background shadow-sm transition-[transform,width] duration-200 ease-out"
								style={{
									transform: `translateX(${indicator.left}px)`,
									width: `${indicator.width}px`,
								}}
							/>
						) : null}
						{PARTICIPANT_ANALYTICS_SECTIONS.map((section) => {
							const tab = participantTabMetadata[section];
							const Icon = tab.icon;

							return (
								<Button
									key={section}
									type="button"
									role="tab"
									aria-selected={activeSection === section}
									ref={(element) => {
										tabButtonRefs.current[section] =
											element;
									}}
									onClick={() => setActiveSection(section)}
									variant="ghost"
									className={cn(
										"relative z-10 h-10 min-w-fit gap-2 rounded-lg px-3 text-sm transition-colors hover:bg-transparent",
										activeSection === section
											? "font-semibold text-primary"
											: "text-muted-foreground hover:text-primary",
									)}
								>
									<Icon className="h-4 w-4" />
									{tab.label}
								</Button>
							);
						})}
					</div>
				</div>
			</div>

			<div>{renderedSection}</div>
		</div>
	);
}
