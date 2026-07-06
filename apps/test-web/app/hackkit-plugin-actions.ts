"use server";

// @hackkit-generated — do not edit

import { getRuntime } from "@/lib/runtime";
import { createTeamsActions } from "@hackkit/plugin-teams";
import { createDiscordActions } from "@hackkit/plugin-discord";

const teamsActionsPromise = getRuntime().then((runtime) =>
	createTeamsActions(runtime),
);

export async function createTeam(...args: Parameters<Awaited<ReturnType<typeof createTeamsActions>>["createTeam"]>) {
	const actions = await teamsActionsPromise;
	return actions.createTeam(...args);
}

export async function inviteToTeam(...args: Parameters<Awaited<ReturnType<typeof createTeamsActions>>["inviteToTeam"]>) {
	const actions = await teamsActionsPromise;
	return actions.inviteToTeam(...args);
}

export async function respondToInvite(...args: Parameters<Awaited<ReturnType<typeof createTeamsActions>>["respondToInvite"]>) {
	const actions = await teamsActionsPromise;
	return actions.respondToInvite(...args);
}

export async function leaveTeam(...args: Parameters<Awaited<ReturnType<typeof createTeamsActions>>["leaveTeam"]>) {
	const actions = await teamsActionsPromise;
	return actions.leaveTeam(...args);
}

export async function removeMember(...args: Parameters<Awaited<ReturnType<typeof createTeamsActions>>["removeMember"]>) {
	const actions = await teamsActionsPromise;
	return actions.removeMember(...args);
}

const discordActionsPromise = getRuntime().then((runtime) =>
	createDiscordActions(runtime),
);

export async function confirmDiscordVerification(...args: Parameters<Awaited<ReturnType<typeof createDiscordActions>>["confirmDiscordVerification"]>) {
	const actions = await discordActionsPromise;
	return actions.confirmDiscordVerification(...args);
}

export async function syncDiscordMemberRoles(...args: Parameters<Awaited<ReturnType<typeof createDiscordActions>>["syncDiscordMemberRoles"]>) {
	const actions = await discordActionsPromise;
	return actions.syncDiscordMemberRoles(...args);
}
