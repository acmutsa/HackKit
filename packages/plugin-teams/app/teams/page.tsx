import { getHackkitRuntime } from "@hackkit/next";
import { redirect } from "next/navigation";
import type { TeamsApi } from "../../src/api";
import {
	createTeam,
	inviteToTeam,
	leaveTeam,
	removeMember,
} from "@/app/hackkit-plugin-actions";
import { TeamCreateForm } from "../../src/components/team-create-form";
import { TeamDashboard } from "../../src/components/team-dashboard";

export const dynamic = "force-dynamic";

export default async function TeamsPage() {
	const runtime = await getHackkitRuntime();
	const teams = runtime.hackkit.plugins.teams as TeamsApi;
	const currentUser = await runtime.getCurrentUser();
	const hacker = await runtime.hackkit.hackers.getHacker(currentUser.authId);

	if (!hacker) {
		redirect("/register");
	}

	const team = await teams.getTeamForAuthId(currentUser.authId);
	const teamInvites =
		team && team.ownerAuthId === currentUser.authId
			? await teams.listTeamInvites({
					actorAuthId: currentUser.authId,
					teamId: team.id,
				})
			: [];

	return (
		<main className="min-h-screen bg-muted/30 px-6 py-10">
			<div className="mx-auto flex max-w-3xl flex-col gap-6">
				<div className="space-y-2">
					<p className="text-sm font-medium text-primary">Teams</p>
					<h1 className="text-3xl font-bold tracking-tight">Your team</h1>
					<p className="text-muted-foreground">
						Create or manage your hackathon competition team.
					</p>
				</div>

				{team ? (
					<TeamDashboard
						team={team}
						currentUser={currentUser}
						teamInvites={teamInvites}
						inviteToTeam={inviteToTeam}
						leaveTeam={leaveTeam}
						removeMember={removeMember}
					/>
				) : (
					<TeamCreateForm createTeam={createTeam} />
				)}
			</div>
		</main>
	);
}
