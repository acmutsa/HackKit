import { defineSetting } from "@hackkit/core";
import type { HackKitPlugin } from "@hackkit/core";
import { createTeamsApi } from "./api";
import { teamsModels } from "./models";
import { TeamsPermission } from "./permissions";
import { TeamsSetting } from "./settings";

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
		settings: [
			defineSetting({
				key: TeamsSetting.MaximumTeamSize,
				type: "number",
				defaultValue: 4,
				integer: true,
				min: 0,
				unit: "members",
				label: "Maximum team size",
				description: "Maximum number of members allowed on one team. 0 means unlimited.",
				category: "Teams",
			}),
		],
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
export { TeamsSetting } from "./settings";
export type { Team, TeamInvite, TeamMember } from "./models";
export type {
	TeamsApi,
	TeamWithMembers,
	PendingTeamInvite,
	TeamInviteWithInvitee,
} from "./api";
export type { TeamsActions } from "./actions";
