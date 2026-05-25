import { getHackkitRuntime } from "@hackkit/next";
import { redirect } from "next/navigation";
import type { TeamsApi } from "../../src/api";
import { respondToInvite } from "@/app/hackkit-plugin-actions";
import { TeamInvites } from "../../src/components/team-invites";

export const dynamic = "force-dynamic";

export default async function InvitesPage() {
	const runtime = await getHackkitRuntime();
	const teams = runtime.hackkit.plugins.teams as TeamsApi;
	const currentUser = await runtime.getCurrentUser();
	const hacker = await runtime.hackkit.hackers.getHacker(currentUser.authId);

	if (!hacker) {
		redirect("/register");
	}

	const invites = await teams.listPendingInvites(currentUser.authId);

	return (
		<main className="min-h-screen bg-muted/30 px-6 py-10">
			<div className="mx-auto flex max-w-3xl flex-col gap-6">
				<div className="space-y-2">
					<p className="text-sm font-medium text-primary">Teams</p>
					<h1 className="text-3xl font-bold tracking-tight">Team invites</h1>
					<p className="text-muted-foreground">
						Review and respond to pending team invitations.
					</p>
				</div>

				<TeamInvites invites={invites} respondToInvite={respondToInvite} />
			</div>
		</main>
	);
}
