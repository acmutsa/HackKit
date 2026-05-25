import type { HackKitPlugin } from "@hackkit/core";
import { createTeamsApi } from "./api";
import { teamsModels } from "./models";
import { TeamsPermission } from "./permissions";

export function teamsPlugin(): HackKitPlugin<"teams", ReturnType<typeof createTeamsApi>> {
	return {
		id: "teams",
		packageName: "@hackkit/plugin-teams",
		actionFactory: "createTeamsActions",
		actionNames: [
			"createTeam",
			"inviteToTeam",
			"respondToInvite",
			"leaveTeam",
			"removeMember",
		],
		models: teamsModels,
		permissions: {
			TeamCreate: TeamsPermission.TeamCreate,
			InviteSend: TeamsPermission.InviteSend,
			InviteRespond: TeamsPermission.InviteRespond,
			TeamManage: TeamsPermission.TeamManage,
		},
		setup: createTeamsApi,
	};
}

export { createTeamsActions } from "./actions";
export { createTeamsApi } from "./api";
export { teamsModels } from "./models";
export { TeamsPermission } from "./permissions";
export type { Team, TeamInvite, TeamMember } from "./models";
export type { TeamsApi, TeamWithMembers, PendingTeamInvite } from "./api";
export type { TeamsActions } from "./actions";
