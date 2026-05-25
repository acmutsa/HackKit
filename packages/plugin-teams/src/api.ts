import { coreModels, HackKitError } from "@hackkit/core";
import type { AuthId, User } from "@hackkit/core";
import type { HackKitPluginContext } from "@hackkit/core";
import { teamsModels, type Team, type TeamInvite, type TeamMember } from "./models";

export type TeamWithMembers = Team & {
	members: (TeamMember & { user: User })[];
};

export type PendingTeamInvite = TeamInvite & { team: Team };
export type TeamInviteWithInvitee = TeamInvite & { invitee: User };

async function requireHacker(
	context: HackKitPluginContext,
	authId: AuthId,
	message = "Only Hackers can participate in teams.",
): Promise<void> {
	const hacker = await context.database.findOne(coreModels.hacker, { authId });
	if (!hacker) {
		throw new HackKitError("INVALID_OPERATION", message);
	}
}

async function getMemberForAuthId(
	context: HackKitPluginContext,
	authId: AuthId,
): Promise<TeamMember | null> {
	return context.database.findOne(teamsModels.member, { authId });
}

async function getTeamOrThrow(
	context: HackKitPluginContext,
	teamId: string,
): Promise<Team> {
	const team = await context.database.findOne(teamsModels.team, { id: teamId });
	if (!team) {
		throw new HackKitError("NOT_FOUND", "Team not found.");
	}
	return team;
}

async function assertNotOnTeam(
	context: HackKitPluginContext,
	authId: AuthId,
): Promise<void> {
	const member = await getMemberForAuthId(context, authId);
	if (member) {
		throw new HackKitError(
			"CONFLICT",
			"User is already on a team.",
		);
	}
}

async function resolveInviteeAuthId(
	context: HackKitPluginContext,
	target: { inviteeAuthId?: AuthId; hackTag?: string },
): Promise<AuthId> {
	if (target.inviteeAuthId) return target.inviteeAuthId;
	if (!target.hackTag?.trim()) {
		throw new HackKitError("INVALID_OPERATION", "Invitee is required.");
	}
	const user = await context.database.findOne(coreModels.user, {
		hackTag: target.hackTag.trim().toLowerCase(),
	});
	if (!user) {
		throw new HackKitError("NOT_FOUND", "User with that HackTag was not found.");
	}
	return user.authId;
}

async function hydrateTeam(
	context: HackKitPluginContext,
	team: Team,
): Promise<TeamWithMembers> {
	const members = await context.database.findMany(teamsModels.member, {
		where: { teamId: team.id },
		orderBy: { field: "joinedAt", direction: "asc" },
	});
	const users = await Promise.all(
		members.map(async (member) => {
			const user = await context.database.findOne(coreModels.user, {
				authId: member.authId,
			});
			if (!user) {
				throw new HackKitError("NOT_FOUND", "Team member user not found.");
			}
			return { ...member, user };
		}),
	);
	return { ...team, members: users };
}

export function createTeamsApi(context: HackKitPluginContext) {
	const { database, registry } = context;

	return {
		async createTeam(input: {
			actorAuthId: AuthId;
			name: string;
			tag: string;
		}): Promise<TeamWithMembers> {
			await requireHacker(context, input.actorAuthId);
			await assertNotOnTeam(context, input.actorAuthId);

			const normalizedTag = input.tag.trim().toLowerCase();
			if (!normalizedTag) {
				throw new HackKitError("INVALID_OPERATION", "Team tag is required.");
			}

			const existingTag = await database.findOne(teamsModels.team, {
				tag: normalizedTag,
			});
			if (existingTag) {
				throw new HackKitError("CONFLICT", "Team tag is already taken.");
			}

			const team = await database.insert(teamsModels.team, {
				name: input.name.trim(),
				tag: normalizedTag,
				ownerAuthId: input.actorAuthId,
			});
			await database.insert(teamsModels.member, {
				teamId: team.id,
				authId: input.actorAuthId,
			});
			return hydrateTeam(context, team);
		},

		async inviteToTeam(input: {
			actorAuthId: AuthId;
			teamId: string;
			inviteeAuthId?: AuthId;
			hackTag?: string;
		}): Promise<TeamInvite> {
			const team = await getTeamOrThrow(context, input.teamId);
			if (team.ownerAuthId !== input.actorAuthId) {
				throw new HackKitError(
					"FORBIDDEN",
					"Only the team owner can send invites.",
				);
			}

			const inviteeAuthId = await resolveInviteeAuthId(context, input);
			if (inviteeAuthId === input.actorAuthId) {
				throw new HackKitError(
					"INVALID_OPERATION",
					"You cannot invite yourself.",
				);
			}

			await assertNotOnTeam(context, inviteeAuthId);

			const existingInvite = await database.findOne(teamsModels.invite, {
				teamId: input.teamId,
				inviteeAuthId,
				status: "pending",
			});
			if (existingInvite) {
				throw new HackKitError(
					"CONFLICT",
					"An invite is already pending for this user.",
				);
			}

			return database.insert(teamsModels.invite, {
				teamId: input.teamId,
				inviteeAuthId,
				status: "pending",
			});
		},

		async respondToInvite(input: {
			actorAuthId: AuthId;
			inviteId: string;
			accept: boolean;
		}): Promise<TeamInvite | TeamWithMembers> {
			const invite = await database.findOne(teamsModels.invite, {
				id: input.inviteId,
			});
			if (!invite) {
				throw new HackKitError("NOT_FOUND", "Invite not found.");
			}
			if (invite.inviteeAuthId !== input.actorAuthId) {
				throw new HackKitError(
					"FORBIDDEN",
					"You can only respond to your own invites.",
				);
			}
			if (invite.status !== "pending") {
				throw new HackKitError(
					"INVALID_OPERATION",
					"Invite has already been responded to.",
				);
			}

			if (!input.accept) {
				const [updated] = await database.update(
					teamsModels.invite,
					{ id: invite.id },
					{ status: "declined" },
				);
				return updated ?? { ...invite, status: "declined" };
			}

			await requireHacker(
				context,
				input.actorAuthId,
				"Complete hacker registration before accepting a team invite.",
			);
			await assertNotOnTeam(context, input.actorAuthId);

			await database.insert(teamsModels.member, {
				teamId: invite.teamId,
				authId: input.actorAuthId,
			});
			await database.update(
				teamsModels.invite,
				{ id: invite.id },
				{ status: "accepted" },
			);
			const team = await getTeamOrThrow(context, invite.teamId);
			return hydrateTeam(context, team);
		},

		async leaveTeam(input: { actorAuthId: AuthId }): Promise<void> {
			const member = await getMemberForAuthId(context, input.actorAuthId);
			if (!member) {
				throw new HackKitError("NOT_FOUND", "You are not on a team.");
			}
			const team = await getTeamOrThrow(context, member.teamId);
			if (team.ownerAuthId === input.actorAuthId) {
				throw new HackKitError(
					"INVALID_OPERATION",
					"Team owners cannot leave their team.",
				);
			}
			await database.delete(teamsModels.member, { id: member.id });
		},

		async removeMember(input: {
			actorAuthId: AuthId;
			memberAuthId: AuthId;
		}): Promise<void> {
			const member = await getMemberForAuthId(context, input.memberAuthId);
			if (!member) {
				throw new HackKitError("NOT_FOUND", "Team member not found.");
			}
			const team = await getTeamOrThrow(context, member.teamId);
			if (team.ownerAuthId !== input.actorAuthId) {
				throw new HackKitError(
					"FORBIDDEN",
					"Only the team owner can remove members.",
				);
			}
			if (member.authId === team.ownerAuthId) {
				throw new HackKitError(
					"INVALID_OPERATION",
					"The team owner cannot be removed.",
				);
			}
			await database.delete(teamsModels.member, { id: member.id });
		},

		async getTeamForAuthId(authId: AuthId): Promise<TeamWithMembers | null> {
			const member = await getMemberForAuthId(context, authId);
			if (!member) return null;
			const team = await getTeamOrThrow(context, member.teamId);
			return hydrateTeam(context, team);
		},

		async listTeamMembers(teamId: string): Promise<(TeamMember & { user: User })[]> {
			const team = await getTeamOrThrow(context, teamId);
			return (await hydrateTeam(context, team)).members;
		},

		async listPendingInvites(authId: AuthId): Promise<PendingTeamInvite[]> {
			const invites = await database.findMany(teamsModels.invite, {
				where: { inviteeAuthId: authId, status: "pending" },
				orderBy: { field: "createdAt", direction: "desc" },
			});
			return Promise.all(
				invites.map(async (invite) => ({
					...invite,
					team: await getTeamOrThrow(context, invite.teamId),
				})),
			);
		},

		async listTeamInvites(input: {
			actorAuthId: AuthId;
			teamId: string;
		}): Promise<TeamInviteWithInvitee[]> {
			const team = await getTeamOrThrow(context, input.teamId);
			if (team.ownerAuthId !== input.actorAuthId) {
				throw new HackKitError(
					"FORBIDDEN",
					"Only the team owner can view team invites.",
				);
			}
			const invites = await database.findMany(teamsModels.invite, {
				where: { teamId: input.teamId },
				orderBy: { field: "createdAt", direction: "desc" },
			});
			return Promise.all(
				invites.map(async (invite) => {
					const invitee = await database.findOne(coreModels.user, {
						authId: invite.inviteeAuthId,
					});
					if (!invitee) {
						throw new HackKitError(
							"NOT_FOUND",
							"Invited user not found.",
						);
					}
					return { ...invite, invitee };
				}),
			);
		},

		models: teamsModels,
		permissions: registry.permissions,
	};
}

export type TeamsApi = ReturnType<typeof createTeamsApi>;
