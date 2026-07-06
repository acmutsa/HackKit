import type { PublicUserProfile } from "@hackkit/core";
import { cn } from "../lib/cn";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";

export type PublicProfileCardProps = {
	profile: PublicUserProfile;
	className?: string;
};

function formatUrlLabel(url: string) {
	return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function PublicProfileCard({ profile, className }: PublicProfileCardProps) {
	const { user, hacker, role } = profile;
	const links = [
		hacker?.githubUrl ? { label: "GitHub", href: hacker.githubUrl } : null,
		hacker?.linkedInUrl ? { label: "LinkedIn", href: hacker.linkedInUrl } : null,
		hacker?.personalWebsiteUrl
			? { label: "Website", href: hacker.personalWebsiteUrl }
			: null,
	].filter((link): link is { label: string; href: string } => Boolean(link));

	return (
		<Card className={cn("w-full max-w-4xl", className)}>
			<CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center">
				{user.profilePhotoUrl ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={user.profilePhotoUrl}
						alt=""
						className="h-24 w-24 rounded-full object-cover"
					/>
				) : (
					<div className="grid h-24 w-24 place-items-center rounded-full bg-muted text-2xl font-semibold">
						{user.firstName[0]}
						{user.lastName[0]}
					</div>
				)}
				<div>
					<CardTitle className="text-3xl">
						{user.firstName} {user.lastName}
					</CardTitle>
					<CardDescription>
						{user.hackTag ? `@${user.hackTag}` : "HackKit participant"}
						{user.pronouns ? `, ${user.pronouns}` : ""}
						{role ? `, ${role.name}` : ""}
					</CardDescription>
				</div>
			</CardHeader>
			<CardContent className="space-y-6">
				{user.bio ? (
					<section className="space-y-2">
						<h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
							About
						</h2>
						<p className="leading-7">{user.bio}</p>
					</section>
				) : null}

				{user.skills && user.skills.length > 0 ? (
					<section className="space-y-2">
						<h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
							Skills
						</h2>
						<div className="flex flex-wrap gap-2">
							{user.skills.map((skill) => (
								<span
									key={skill}
									className="rounded-full border px-3 py-1 text-sm"
								>
									{skill}
								</span>
							))}
						</div>
					</section>
				) : null}

				{hacker ? (
					<section className="grid gap-3 text-sm sm:grid-cols-3">
						<div>
							<p className="text-muted-foreground">School</p>
							<p className="font-medium">{hacker.university}</p>
						</div>
						<div>
							<p className="text-muted-foreground">Major</p>
							<p className="font-medium">{hacker.major}</p>
						</div>
						<div>
							<p className="text-muted-foreground">Level</p>
							<p className="font-medium">{hacker.levelOfStudy}</p>
						</div>
					</section>
				) : null}

				{user.discordDisplayHandle || links.length > 0 ? (
					<section className="space-y-2">
						<h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
							Links
						</h2>
						<div className="flex flex-wrap gap-3 text-sm">
							{user.discordDisplayHandle ? (
								<span className="rounded-md border px-3 py-2">
									Discord: {user.discordDisplayHandle}
								</span>
							) : null}
							{links.map((link) => (
								<a
									key={link.label}
									href={link.href}
									className="rounded-md border px-3 py-2 hover:bg-muted"
								>
									{link.label}: {formatUrlLabel(link.href)}
								</a>
							))}
						</div>
					</section>
				) : null}
			</CardContent>
		</Card>
	);
}
