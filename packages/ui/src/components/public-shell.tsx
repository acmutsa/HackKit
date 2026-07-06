import type * as React from "react";
import type { Event } from "@hackkit/core";
import { cn } from "../lib/cn";

export type PublicShellLink = {
	label: string;
	href: string;
	description?: string;
	external?: boolean;
};

export type PublicShellFeature = {
	title: string;
	description: string;
};

export type PublicShellStat = {
	label: string;
	value: string;
};

export type PublicSiteFooterGroup = {
	title: string;
	links: PublicShellLink[];
};

export type PublicLandingPageProps = {
	eyebrow: string;
	title: string;
	description: string;
	primaryAction: PublicShellLink;
	secondaryAction?: PublicShellLink;
	stats?: PublicShellStat[];
	highlights?: PublicShellFeature[];
	sections?: PublicShellFeature[];
	className?: string;
};

export type PublicSiteFooterProps = {
	brandName: string;
	description: string;
	linkGroups: PublicSiteFooterGroup[];
	copyright?: string;
	className?: string;
};

export type PublicHelpPageProps = {
	title: string;
	description: string;
	contacts: PublicShellLink[];
	resources?: PublicShellLink[];
	className?: string;
};

export type DashboardStatusItem = {
	label: string;
	value: string;
};

export type ParticipantDashboardProps = {
	participantName: string;
	eventName: string;
	roleName?: string;
	checkedIn: boolean;
	requireApproval?: boolean;
	approved?: boolean;
	onboarding?: {
		nextHref: string;
		progress: React.ReactNode;
	};
	primaryActions: PublicShellLink[];
	resourceLinks: PublicShellLink[];
	statusItems?: DashboardStatusItem[];
	className?: string;
};

export type ScheduleDetailProps = {
	event: Event;
	typeLabel: string;
	typeColor: string;
	backHref: string;
	actions?: PublicShellLink[];
	className?: string;
};

function formatEventDateTime(value: Date): string {
	return new Intl.DateTimeFormat(undefined, {
		weekday: "long",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
	}).format(value);
}

function renderLink(link: PublicShellLink, className: string) {
	return (
		<a
			key={`${link.href}-${link.label}`}
			href={link.href}
			className={className}
			target={link.external ? "_blank" : undefined}
			rel={link.external ? "noreferrer" : undefined}
		>
			{link.label}
		</a>
	);
}

export function PublicLandingPage({
	eyebrow,
	title,
	description,
	primaryAction,
	secondaryAction,
	stats = [],
	highlights = [],
	sections = [],
	className,
}: PublicLandingPageProps) {
	return (
		<main className={cn("min-h-screen", className)}>
			<section className="relative overflow-hidden border-b bg-muted/30 px-6 py-24">
				<div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/10 to-transparent" />
				<div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
					<div className="space-y-8">
						<div className="space-y-4">
							<p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
								{eyebrow}
							</p>
							<h1 className="max-w-4xl text-5xl font-black tracking-tight text-foreground sm:text-6xl lg:text-7xl">
								{title}
							</h1>
							<p className="max-w-2xl text-lg leading-8 text-muted-foreground">
								{description}
							</p>
						</div>
						<div className="flex flex-wrap gap-3">
							{renderLink(
								primaryAction,
								"inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90",
							)}
							{secondaryAction
								? renderLink(
										secondaryAction,
										"inline-flex h-11 items-center justify-center rounded-md border bg-background px-6 text-sm font-semibold shadow-sm transition hover:bg-accent",
									)
								: null}
						</div>
					</div>

					<div className="rounded-3xl border bg-card p-6 shadow-sm">
						<div className="grid gap-4 sm:grid-cols-2">
							{stats.map((stat) => (
								<div key={stat.label} className="rounded-2xl bg-muted/50 p-4">
									<p className="text-3xl font-black">{stat.value}</p>
									<p className="text-sm text-muted-foreground">{stat.label}</p>
								</div>
							))}
						</div>
						<div className="mt-6 space-y-3">
							{highlights.map((item) => (
								<div key={item.title} className="rounded-2xl border bg-background p-4">
									<h2 className="font-semibold">{item.title}</h2>
									<p className="mt-1 text-sm text-muted-foreground">
										{item.description}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{sections.length > 0 ? (
				<section className="mx-auto grid max-w-6xl gap-4 px-6 py-16 md:grid-cols-3">
					{sections.map((section) => (
						<article key={section.title} className="rounded-2xl border bg-card p-6">
							<h2 className="text-xl font-semibold">{section.title}</h2>
							<p className="mt-3 text-sm leading-6 text-muted-foreground">
								{section.description}
							</p>
						</article>
					))}
				</section>
			) : null}
		</main>
	);
}

export function PublicSiteFooter({
	brandName,
	description,
	linkGroups,
	copyright,
	className,
}: PublicSiteFooterProps) {
	return (
		<footer className={cn("border-t bg-muted/30 px-6 py-10", className)}>
			<div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.2fr_1fr]">
				<div className="space-y-3">
					<p className="text-lg font-bold">{brandName}</p>
					<p className="max-w-md text-sm leading-6 text-muted-foreground">
						{description}
					</p>
					{copyright ? (
						<p className="text-xs text-muted-foreground">{copyright}</p>
					) : null}
				</div>
				<div className="grid gap-6 sm:grid-cols-2">
					{linkGroups.map((group) => (
						<div key={group.title} className="space-y-3">
							<p className="text-sm font-semibold">{group.title}</p>
							<div className="grid gap-2 text-sm">
								{group.links.map((link) =>
									renderLink(
										link,
										"text-muted-foreground transition hover:text-foreground",
									),
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</footer>
	);
}

export function PublicHelpPage({
	title,
	description,
	contacts,
	resources = [],
	className,
}: PublicHelpPageProps) {
	return (
		<main className={cn("min-h-screen px-6 py-16", className)}>
			<div className="mx-auto max-w-5xl space-y-10">
				<div className="max-w-3xl space-y-3">
					<h1 className="text-4xl font-black tracking-tight">{title}</h1>
					<p className="text-lg leading-8 text-muted-foreground">
						{description}
					</p>
				</div>
				<section className="grid gap-4 md:grid-cols-2">
					{contacts.map((contact) => (
						<a
							key={contact.href}
							href={contact.href}
							target={contact.external ? "_blank" : undefined}
							rel={contact.external ? "noreferrer" : undefined}
							className="rounded-2xl border bg-card p-6 shadow-sm transition hover:border-primary/50"
						>
							<h2 className="text-xl font-semibold">{contact.label}</h2>
							{contact.description ? (
								<p className="mt-2 text-sm leading-6 text-muted-foreground">
									{contact.description}
								</p>
							) : null}
						</a>
					))}
				</section>
				{resources.length > 0 ? (
					<section className="rounded-2xl border bg-muted/30 p-6">
						<h2 className="text-xl font-semibold">Helpful links</h2>
						<div className="mt-4 flex flex-wrap gap-3">
							{resources.map((resource) =>
								renderLink(
									resource,
									"rounded-md bg-background px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-accent",
								),
							)}
						</div>
					</section>
				) : null}
			</div>
		</main>
	);
}

export function ParticipantDashboard({
	participantName,
	eventName,
	roleName,
	checkedIn,
	requireApproval,
	approved,
	onboarding,
	primaryActions,
	resourceLinks,
	statusItems = [],
	className,
}: ParticipantDashboardProps) {
	const resolvedStatusItems = [
		{ label: "Role", value: roleName ?? "Participant" },
		{ label: "Check-in", value: checkedIn ? "Complete" : "Not checked in" },
		...(requireApproval
			? [{ label: "Approval", value: approved ? "Approved" : "Pending" }]
			: []),
		...statusItems,
	];

	return (
		<main className={cn("min-h-screen px-6 py-10", className)}>
			<div className="mx-auto max-w-6xl space-y-8">
				<section className="rounded-3xl border bg-card p-6 shadow-sm md:p-8">
					<p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
						{eventName}
					</p>
					<h1 className="mt-3 text-4xl font-black tracking-tight">
						Welcome, {participantName}
					</h1>
					<p className="mt-3 max-w-2xl text-muted-foreground">
						Use this dashboard for your event pass, schedule, RSVP, team links,
						settings, and day-of help.
					</p>
					<div className="mt-6 flex flex-wrap gap-3">
						{primaryActions.map((action) =>
							renderLink(
								action,
								"inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90",
							),
						)}
					</div>
				</section>

				{onboarding ? (
					<section className="rounded-2xl border bg-muted/30 p-5">
						<div className="space-y-1">
							<h2 className="text-xl font-semibold">Continue onboarding</h2>
							<p className="text-sm text-muted-foreground">
								Finish registration to unlock the full participant experience.
							</p>
						</div>
						<div className="mt-4">{onboarding.progress}</div>
						{renderLink(
							{ href: onboarding.nextHref, label: "Continue registration" },
							"mt-4 inline-flex text-sm font-medium text-primary hover:underline",
						)}
					</section>
				) : null}

				<div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
					<section className="rounded-2xl border bg-card p-5">
						<h2 className="text-xl font-semibold">Status</h2>
						<dl className="mt-4 grid gap-3">
							{resolvedStatusItems.map((item) => (
								<div
									key={item.label}
									className="flex items-center justify-between gap-4 rounded-xl bg-muted/40 px-4 py-3"
								>
									<dt className="text-sm text-muted-foreground">{item.label}</dt>
									<dd className="text-sm font-medium">{item.value}</dd>
								</div>
							))}
						</dl>
					</section>
					<section className="rounded-2xl border bg-card p-5">
						<h2 className="text-xl font-semibold">Resources</h2>
						<div className="mt-4 grid gap-3 sm:grid-cols-2">
							{resourceLinks.map((resource) => (
								<a
									key={resource.href}
									href={resource.href}
									target={resource.external ? "_blank" : undefined}
									rel={resource.external ? "noreferrer" : undefined}
									className="rounded-xl border bg-background p-4 transition hover:border-primary/50"
								>
									<p className="font-medium">{resource.label}</p>
									{resource.description ? (
										<p className="mt-1 text-sm text-muted-foreground">
											{resource.description}
										</p>
									) : null}
								</a>
							))}
						</div>
					</section>
				</div>
			</div>
		</main>
	);
}

export function ScheduleDetail({
	event,
	typeLabel,
	typeColor,
	backHref,
	actions = [],
	className,
}: ScheduleDetailProps) {
	return (
		<main className={cn("min-h-screen px-6 py-10", className)}>
			<article className="mx-auto max-w-3xl space-y-6 rounded-3xl border bg-card p-6 shadow-sm md:p-8">
				<a href={backHref} className="text-sm font-medium text-primary hover:underline">
					Back to schedule
				</a>
				<div className="space-y-4">
					<span
						className="inline-flex rounded-full px-3 py-1 text-xs font-semibold text-white"
						style={{ backgroundColor: typeColor }}
					>
						{typeLabel}
					</span>
					<div>
						<h1 className="text-4xl font-black tracking-tight">{event.title}</h1>
						<p className="mt-3 text-muted-foreground">
							{formatEventDateTime(event.startTime)} to{" "}
							{formatEventDateTime(event.endTime)}
						</p>
					</div>
				</div>
				<div className="grid gap-4 rounded-2xl bg-muted/40 p-4 sm:grid-cols-2">
					<div>
						<p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
							Location
						</p>
						<p className="mt-1 font-medium">{event.location}</p>
					</div>
					{event.host ? (
						<div>
							<p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Host
							</p>
							<p className="mt-1 font-medium">{event.host}</p>
						</div>
					) : null}
				</div>
				<p className="leading-7 text-muted-foreground">{event.description}</p>
				{actions.length > 0 ? (
					<div className="flex flex-wrap gap-3">
						{actions.map((action) =>
							renderLink(
								action,
								"rounded-md border bg-background px-4 py-2 text-sm font-medium transition hover:bg-accent",
							),
						)}
					</div>
				) : null}
			</article>
		</main>
	);
}
