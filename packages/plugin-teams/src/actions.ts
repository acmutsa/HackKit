import type { HackkitRuntime } from "@hackkit/next";
import { actionFailure, actionSuccess } from "@hackkit/next";

export type CreateTeamInput = {
	name: string;
	tag: string;
};

export type InviteToTeamInput = {
	teamId: string;
	hackTag: string;
};

export type RespondToInviteInput = {
	inviteId: string;
	accept: boolean;
};

export type RemoveMemberInput = {
	memberAuthId: string;
};

import type { TeamsApi } from "./api";

export function createTeamsActions(runtime: HackkitRuntime) {
	const teams = runtime.hackkit.plugins.teams as unknown as TeamsApi;

	return {
		async createTeam(values: CreateTeamInput) {
			try {
				const actorAuthId = await runtime.getAuthId();
				const team = await teams.createTeam({
					actorAuthId,
					...values,
				});
				return actionSuccess(team);
			} catch (error) {
				return actionFailure(error, "Could not create team.");
			}
		},

		async inviteToTeam(values: InviteToTeamInput) {
			try {
				const actorAuthId = await runtime.getAuthId();
				const invite = await teams.inviteToTeam({
					actorAuthId,
					...values,
				});
				return actionSuccess(invite);
			} catch (error) {
				return actionFailure(error, "Could not send invite.");
			}
		},

		async respondToInvite(values: RespondToInviteInput) {
			try {
				const actorAuthId = await runtime.getAuthId();
				const result = await teams.respondToInvite({
					actorAuthId,
					...values,
				});
				return actionSuccess(result);
			} catch (error) {
				return actionFailure(error, "Could not respond to invite.");
			}
		},

		async leaveTeam() {
			try {
				const actorAuthId = await runtime.getAuthId();
				await teams.leaveTeam({ actorAuthId });
				return actionSuccess();
			} catch (error) {
				return actionFailure(error, "Could not leave team.");
			}
		},

		async removeMember(values: RemoveMemberInput) {
			try {
				const actorAuthId = await runtime.getAuthId();
				await teams.removeMember({
					actorAuthId,
					memberAuthId: values.memberAuthId,
				});
				return actionSuccess();
			} catch (error) {
				return actionFailure(error, "Could not remove team member.");
			}
		},
	};
}

export type TeamsActions = ReturnType<typeof createTeamsActions>;
