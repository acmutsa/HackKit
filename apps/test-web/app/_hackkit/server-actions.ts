"use server";

import type { HackKitUIActions } from "@hackkit/ui";
import { getRuntime } from "@/lib/runtime";

/**
 * App-owned Server Action boundary.
 *
 * A Server Action request can execute without evaluating a page or layout
 * module first, so each action resolves the app runtime explicitly before
 * delegating to the canonical mutations from @hackkit/next.
 */
async function callMutation<K extends keyof HackKitUIActions>(
	name: K,
	...args: Parameters<HackKitUIActions[K]>
): Promise<Awaited<ReturnType<HackKitUIActions[K]>>> {
	const mutations = (await getRuntime()).mutations;
	return (
		mutations[name] as (
			...actionArgs: typeof args
		) => ReturnType<HackKitUIActions[K]>
	)(...args) as Awaited<ReturnType<HackKitUIActions[K]>>;
}

export async function completeUserData(
	...args: Parameters<HackKitUIActions["completeUserData"]>
) {
	return callMutation("completeUserData", ...args);
}

export async function claimHackTag(
	...args: Parameters<HackKitUIActions["claimHackTag"]>
) {
	return callMutation("claimHackTag", ...args);
}

export async function updateUserProfile(
	...args: Parameters<HackKitUIActions["updateUserProfile"]>
) {
	return callMutation("updateUserProfile", ...args);
}

export async function registerHacker(
	...args: Parameters<HackKitUIActions["registerHacker"]>
) {
	return callMutation("registerHacker", ...args);
}

export async function createEvent(
	...args: Parameters<HackKitUIActions["createEvent"]>
) {
	return callMutation("createEvent", ...args);
}

export async function updateEvent(
	...args: Parameters<HackKitUIActions["updateEvent"]>
) {
	return callMutation("updateEvent", ...args);
}

export async function deleteEvent(
	...args: Parameters<HackKitUIActions["deleteEvent"]>
) {
	return callMutation("deleteEvent", ...args);
}

export async function previewEventPassQr(
	...args: Parameters<HackKitUIActions["previewEventPassQr"]>
) {
	return callMutation("previewEventPassQr", ...args);
}

export async function recordEventScan(
	...args: Parameters<HackKitUIActions["recordEventScan"]>
) {
	return callMutation("recordEventScan", ...args);
}

export async function checkInUser(
	...args: Parameters<HackKitUIActions["checkInUser"]>
) {
	return callMutation("checkInUser", ...args);
}

export async function clearCheckIn(
	...args: Parameters<HackKitUIActions["clearCheckIn"]>
) {
	return callMutation("clearCheckIn", ...args);
}

export async function confirmRsvp(
	...args: Parameters<HackKitUIActions["confirmRsvp"]>
) {
	return callMutation("confirmRsvp", ...args);
}

export async function cancelRsvp(
	...args: Parameters<HackKitUIActions["cancelRsvp"]>
) {
	return callMutation("cancelRsvp", ...args);
}

export async function setRsvpStatus(
	...args: Parameters<HackKitUIActions["setRsvpStatus"]>
) {
	return callMutation("setRsvpStatus", ...args);
}

export async function promoteRsvp(
	...args: Parameters<HackKitUIActions["promoteRsvp"]>
) {
	return callMutation("promoteRsvp", ...args);
}

export async function approveUser(
	...args: Parameters<HackKitUIActions["approveUser"]>
) {
	return callMutation("approveUser", ...args);
}

export async function banUser(
	...args: Parameters<HackKitUIActions["banUser"]>
) {
	return callMutation("banUser", ...args);
}

export async function unbanUser(
	...args: Parameters<HackKitUIActions["unbanUser"]>
) {
	return callMutation("unbanUser", ...args);
}

export async function assignRoleToUser(
	...args: Parameters<HackKitUIActions["assignRoleToUser"]>
) {
	return callMutation("assignRoleToUser", ...args);
}

export async function createRole(
	...args: Parameters<HackKitUIActions["createRole"]>
) {
	return callMutation("createRole", ...args);
}

export async function updateRole(
	...args: Parameters<HackKitUIActions["updateRole"]>
) {
	return callMutation("updateRole", ...args);
}

export async function deleteRole(
	...args: Parameters<HackKitUIActions["deleteRole"]>
) {
	return callMutation("deleteRole", ...args);
}

export async function listSettings(
	...args: Parameters<HackKitUIActions["listSettings"]>
) {
	return callMutation("listSettings", ...args);
}

export async function setSettings(
	...args: Parameters<HackKitUIActions["setSettings"]>
) {
	return callMutation("setSettings", ...args);
}

export async function resetSetting(
	...args: Parameters<HackKitUIActions["resetSetting"]>
) {
	return callMutation("resetSetting", ...args);
}
