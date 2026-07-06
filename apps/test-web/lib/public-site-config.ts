import type { CSSProperties } from "react";
import type {
	PublicLandingPageProps,
	PublicShellLink,
	PublicSiteFooterGroup,
} from "@hackkit/ui";

export type PublicSiteConfig = {
	brand: {
		name: string;
		shortName: string;
		description: string;
	};
	event: {
		name: string;
		dates: string;
		location: string;
		timezone: string;
	};
	theme: {
		primary: string;
		ring: string;
	};
	nav: {
		public: PublicShellLink[];
		participant: PublicShellLink[];
	};
	landing: Omit<PublicLandingPageProps, "primaryAction" | "secondaryAction"> & {
		primaryAction: PublicShellLink;
		secondaryAction: PublicShellLink;
		signedInAction: PublicShellLink;
	};
	help: {
		title: string;
		description: string;
		contacts: PublicShellLink[];
		resources: PublicShellLink[];
	};
	dashboard: {
		primaryActions: PublicShellLink[];
		resourceLinks: PublicShellLink[];
	};
	footer: {
		linkGroups: PublicSiteFooterGroup[];
	};
};

export const publicSiteConfig = {
	brand: {
		name: "HackKit Launch",
		shortName: "HackKit",
		description:
			"A production-ready hackathon shell for registration, event operations, and participant support.",
	},
	event: {
		name: "HackKit Launch Weekend",
		dates: "March 21-23, 2027",
		location: "San Antonio, Texas",
		timezone: "America/Chicago",
	},
	theme: {
		primary: "221.2 83.2% 53.3%",
		ring: "221.2 83.2% 53.3%",
	},
	nav: {
		public: [
			{ label: "Schedule", href: "/schedule" },
			{ label: "Help", href: "/help" },
		],
		participant: [
			{ label: "Dashboard", href: "/dashboard" },
			{ label: "Event Pass", href: "/pass" },
			{ label: "Teams", href: "/teams" },
			{ label: "RSVP", href: "/rsvp" },
		],
	},
	landing: {
		eyebrow: "HackKit production shell",
		title: "Everything participants need before and during event weekend.",
		description:
			"Register, keep your profile current, follow the public schedule, manage your event pass, and get help from the organizing team in one place.",
		primaryAction: { label: "Apply now", href: "/sign-up" },
		secondaryAction: { label: "View schedule", href: "/schedule" },
		signedInAction: { label: "Open dashboard", href: "/dashboard" },
		stats: [
			{ value: "48h", label: "Build window" },
			{ value: "24/7", label: "Participant support" },
			{ value: "1", label: "Source of truth" },
			{ value: "Live", label: "Schedule updates" },
		],
		highlights: [
			{
				title: "Public schedule",
				description:
					"Browse event programming before signing in, then open details from your dashboard during the event.",
			},
			{
				title: "Participant dashboard",
				description:
					"Jump to event pass, RSVP, team tools, settings, and day-of resources after approval.",
			},
			{
				title: "Organizer-ready routing",
				description:
					"Admin, settings, profile, and RSVP routes stay connected without exposing their internals on the public site.",
			},
		],
		sections: [
			{
				title: "Before the event",
				description:
					"Create your account, finish onboarding, update registration details, and watch for approval updates.",
			},
			{
				title: "During the event",
				description:
					"Keep your event pass handy, check the latest schedule, and find support links without digging through email.",
			},
			{
				title: "After launch",
				description:
					"App-owned content and theme tokens keep this shell adaptable for each HackKit deployment.",
			},
		],
	},
	help: {
		title: "Contact and help",
		description:
			"Need support before or during the event? Use these entry points for organizer help, technical issues, and participant resources.",
		contacts: [
			{
				label: "Organizer support",
				href: "mailto:organizers@example.com",
				description: "Questions about registration, approvals, travel, or event logistics.",
			},
			{
				label: "Report a bug",
				href: "https://github.com/acmutsa/hackkit/issues/new",
				description:
					"File a HackKit issue for broken flows, confusing copy, or production shell polish.",
				external: true,
			},
			{
				label: "Discord help",
				href: "mailto:organizers@example.com?subject=Discord%20help",
				description:
					"Ask organizers for the current Discord invite or access help.",
			},
			{
				label: "Emergency contact",
				href: "mailto:organizers@example.com?subject=Urgent%20event%20support",
				description: "Use for urgent safety or day-of operations issues.",
			},
		],
		resources: [
			{ label: "Schedule", href: "/schedule" },
			{ label: "Dashboard", href: "/dashboard" },
			{ label: "Settings", href: "/settings" },
			{ label: "Registration", href: "/settings/registration" },
		],
	},
	dashboard: {
		primaryActions: [
			{ label: "Open event pass", href: "/pass" },
			{ label: "View schedule", href: "/schedule" },
			{ label: "Manage RSVP", href: "/rsvp" },
		],
		resourceLinks: [
			{
				label: "Schedule",
				href: "/schedule",
				description: "See public events and open detailed schedule pages.",
			},
			{
				label: "Event pass",
				href: "/pass",
				description: "Use your QR pass for check-in and event scans.",
			},
			{
				label: "Teams",
				href: "/teams",
				description: "Manage team participation through the existing team route.",
			},
			{
				label: "Invites",
				href: "/invites",
				description: "Review pending team or participant invitations.",
			},
			{
				label: "Settings",
				href: "/settings",
				description: "Update profile details and registration information.",
			},
			{
				label: "Survival guide",
				href: "/help",
				description: "Find help contacts, logistics links, and Discord instructions.",
			},
			{
				label: "Discord",
				href: "/help",
				description:
					"Get the current invite and access instructions from organizers.",
			},
			{
				label: "Admin console",
				href: "/admin",
				description: "Organizer tools are available to authorized users.",
			},
		],
	},
	footer: {
		linkGroups: [
			{
				title: "Event",
				links: [
					{ label: "Schedule", href: "/schedule" },
					{ label: "Help", href: "/help" },
					{ label: "Apply", href: "/sign-up" },
				],
			},
			{
				title: "Participant",
				links: [
					{ label: "Dashboard", href: "/dashboard" },
					{ label: "Event pass", href: "/pass" },
					{ label: "Settings", href: "/settings" },
				],
			},
		],
	},
} satisfies PublicSiteConfig;

export function getPublicThemeStyle(): CSSProperties {
	return {
		"--primary": publicSiteConfig.theme.primary,
		"--ring": publicSiteConfig.theme.ring,
	} as CSSProperties;
}
