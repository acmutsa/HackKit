"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { User } from "@hackkit/core";
import type { HackKitActionResult } from "@hackkit/ui";
import { Button } from "@hackkit/ui";
import type {
	InviteToTeamInput,
	RemoveMemberInput,
} from "../actions";
import type { TeamWithMembers } from "../api";

type TeamDashboardProps = {
	team: TeamWithMembers;
	currentUser: User;
	inviteToTeam: (
		values: InviteToTeamInput,
	) => Promise<HackKitActionResult<unknown>>;
	leaveTeam: () => Promise<HackKitActionResult<unknown>>;
	removeMember: (
		values: RemoveMemberInput,
	) => Promise<HackKitActionResult<unknown>>;
};

export function TeamDashboard({
	team,
	currentUser,
	inviteToTeam,
	leaveTeam,
	removeMember,
}: TeamDashboardProps) {
	const router = useRouter();
	const [hackTag, setHackTag] = React.useState("");
	const [pending, setPending] = React.useState<string | null>(null);
	const isOwner = team.ownerAuthId === currentUser.authId;

	async function handleInvite(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setPending("invite");
		const result = await inviteToTeam({ teamId: team.id, hackTag });
		setPending(null);
		if (!result.ok) {
			toast.error(result.message);
			return;
		}
		toast.success("Invite sent.");
		setHackTag("");
		router.refresh();
	}

	async function handleLeave() {
		setPending("leave");
		const result = await leaveTeam();
		setPending(null);
		if (!result.ok) {
			toast.error(result.message);
			return;
		}
		toast.success("You left the team.");
		router.refresh();
	}

	async function handleRemove(memberAuthId: string) {
		setPending(memberAuthId);
		const result = await removeMember({ memberAuthId });
		setPending(null);
		if (!result.ok) {
			toast.error(result.message);
			return;
		}
		toast.success("Member removed.");
		router.refresh();
	}

	return (
		<div className="space-y-6">
			<div className="rounded-lg border bg-card p-6 shadow-sm">
				<p className="text-sm font-medium text-primary">Your team</p>
				<h1 className="text-3xl font-bold tracking-tight">{team.name}</h1>
				<p className="text-muted-foreground">@{team.tag}</p>
			</div>

			<section className="rounded-lg border bg-card p-6 shadow-sm">
				<h2 className="text-lg font-semibold">Members</h2>
				<ul className="mt-4 space-y-3">
					{team.members.map((member) => (
						<li
							key={member.id}
							className="flex items-center justify-between gap-4 rounded-md border px-4 py-3"
						>
							<div>
								<p className="font-medium">
									{member.user.firstName} {member.user.lastName}
								</p>
								<p className="text-sm text-muted-foreground">
									{member.user.hackTag
										? `@${member.user.hackTag}`
										: member.user.email}
									{member.authId === team.ownerAuthId ? " · Owner" : ""}
								</p>
							</div>
							{isOwner && member.authId !== team.ownerAuthId ? (
								<Button
									variant="outline"
									size="sm"
									disabled={pending === member.authId}
									onClick={() => handleRemove(member.authId)}
								>
									Remove
								</Button>
							) : null}
						</li>
					))}
				</ul>
			</section>

			{isOwner ? (
				<form
					onSubmit={handleInvite}
					className="space-y-4 rounded-lg border bg-card p-6 shadow-sm"
				>
					<h2 className="text-lg font-semibold">Invite a Hacker</h2>
					<label className="block space-y-1 text-sm">
						<span className="font-medium">HackTag</span>
						<input
							className="flex h-10 w-full rounded-md border bg-background px-3 py-2"
							value={hackTag}
							onChange={(event) => setHackTag(event.target.value)}
							placeholder="teammate-tag"
							required
						/>
					</label>
					<Button type="submit" disabled={pending === "invite"}>
						{pending === "invite" ? "Sending..." : "Send invite"}
					</Button>
				</form>
			) : (
				<Button
					variant="outline"
					disabled={pending === "leave"}
					onClick={handleLeave}
				>
					{pending === "leave" ? "Leaving..." : "Leave team"}
				</Button>
			)}
		</div>
	);
}
