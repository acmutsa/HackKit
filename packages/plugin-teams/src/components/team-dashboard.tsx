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
import type { TeamInviteWithInvitee, TeamWithMembers } from "../api";

const INVITE_STATUS_LABEL: Record<
	TeamInviteWithInvitee["status"],
	string
> = {
	pending: "Pending",
	accepted: "Accepted",
	declined: "Declined",
};

function formatInviteSentAt(createdAt: Date | string): string {
	const date = createdAt instanceof Date ? createdAt : new Date(createdAt);
	if (Number.isNaN(date.getTime())) return "";
	return date.toLocaleString(undefined, {
		dateStyle: "medium",
		timeStyle: "short",
	});
}

type TeamDashboardProps = {
	team: TeamWithMembers;
	currentUser: User;
	teamInvites: TeamInviteWithInvitee[];
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
	teamInvites,
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
				<>
					<section className="rounded-lg border bg-card p-6 shadow-sm">
						<h2 className="text-lg font-semibold">Invites</h2>
						<p className="mt-1 text-sm text-muted-foreground">
							Outgoing invitations and their status.
						</p>
						{teamInvites.length === 0 ? (
							<p className="mt-4 text-sm text-muted-foreground">
								No invites sent yet.
							</p>
						) : (
							<ul className="mt-4 space-y-3">
								{teamInvites.map((invite) => (
									<li
										key={invite.id}
										className="flex flex-col gap-2 rounded-md border px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
									>
										<div>
											<p className="font-medium">
												{invite.invitee.firstName}{" "}
												{invite.invitee.lastName}
											</p>
											<p className="text-sm text-muted-foreground">
												{invite.invitee.hackTag
													? `@${invite.invitee.hackTag}`
													: invite.invitee.email}
											</p>
											<p className="text-xs text-muted-foreground">
												Sent {formatInviteSentAt(invite.createdAt)}
											</p>
										</div>
										<span
											className={
												invite.status === "pending"
													? "inline-flex w-fit rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400"
													: invite.status === "accepted"
														? "inline-flex w-fit rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400"
														: "inline-flex w-fit rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
											}
										>
											{INVITE_STATUS_LABEL[invite.status]}
										</span>
									</li>
								))}
							</ul>
						)}
					</section>

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
				</>
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
