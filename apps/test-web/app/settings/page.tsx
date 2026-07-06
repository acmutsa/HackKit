import Link from "next/link";
import { getCurrentUser } from "@/lib/runtime";
import { ProfileSettingsClient } from "./profile-settings-client";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
	const currentUser = await getCurrentUser();

	return (
		<main className="mx-auto max-w-5xl space-y-8 px-6 py-10">
			<div className="space-y-2">
				<h1 className="text-3xl font-bold tracking-tight">Settings</h1>
				<p className="text-muted-foreground">
					Manage your account profile and public HackKit profile.
				</p>
			</div>

			<ProfileSettingsClient currentUser={currentUser} />

			<section className="w-full max-w-3xl rounded-lg border p-6">
				<h2 className="text-xl font-semibold">Discord</h2>
				<p className="mt-2 text-sm text-muted-foreground">
					Link Discord and sync participant, organiser role, and Group roles for
					the event server.
				</p>
				<Link
					href="/discord"
					className="mt-4 inline-flex rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
				>
					Manage Discord
				</Link>
			</section>

			<section className="w-full max-w-3xl rounded-lg border p-6">
				<h2 className="text-xl font-semibold">Registration</h2>
				<p className="mt-2 text-sm text-muted-foreground">
					You can update your demographic, logistics, school, experience, and
					resume information after registration.
				</p>
				<Link
					href="/settings/registration"
					className="mt-4 inline-flex rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
				>
					Edit registration
				</Link>
			</section>
		</main>
	);
}
