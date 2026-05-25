"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { HackKitActionResult } from "@hackkit/ui";
import { Button } from "@hackkit/ui";
import type { PendingTeamInvite } from "../api";
import type { RespondToInviteInput } from "../actions";

type TeamInvitesProps = {
	invites: PendingTeamInvite[];
	respondToInvite: (
		values: RespondToInviteInput,
	) => Promise<HackKitActionResult<unknown>>;
};

export function TeamInvites({ invites, respondToInvite }: TeamInvitesProps) {
	const router = useRouter();
	const [pendingId, setPendingId] = React.useState<string | null>(null);

	async function handleRespond(inviteId: string, accept: boolean) {
		setPendingId(inviteId);
		const result = await respondToInvite({ inviteId, accept });
		setPendingId(null);
		if (!result.ok) {
			toast.error(result.message);
			return;
		}
		toast.success(accept ? "Invite accepted." : "Invite declined.");
		router.refresh();
	}

	if (invites.length === 0) {
		return (
			<div className="rounded-lg border bg-card p-6 shadow-sm">
				<p className="text-muted-foreground">No pending team invites.</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{invites.map((invite) => (
				<div
					key={invite.id}
					className="flex flex-col gap-4 rounded-lg border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between"
				>
					<div>
						<p className="font-medium">{invite.team.name}</p>
						<p className="text-sm text-muted-foreground">@{invite.team.tag}</p>
					</div>
					<div className="flex gap-2">
						<Button
							disabled={pendingId === invite.id}
							onClick={() => handleRespond(invite.id, true)}
						>
							Accept
						</Button>
						<Button
							variant="outline"
							disabled={pendingId === invite.id}
							onClick={() => handleRespond(invite.id, false)}
						>
							Decline
						</Button>
					</div>
				</div>
			))}
		</div>
	);
}
