"use server";

import type { SettingKey } from "@hackkit/core";
import { createHackKitMutations } from "@hackkit/next";
import { getRuntime } from "@/lib/runtime";

export async function completeUserData(
	...args: Parameters<
		ReturnType<typeof createHackKitMutations>["completeUserData"]
	>
) {
	return createHackKitMutations(await getRuntime()).completeUserData(...args);
}

export async function claimHackTag(
	...args: Parameters<
		ReturnType<typeof createHackKitMutations>["claimHackTag"]
	>
) {
	return createHackKitMutations(await getRuntime()).claimHackTag(...args);
}

export async function updateUserProfile(
	...args: Parameters<
		ReturnType<typeof createHackKitMutations>["updateUserProfile"]
	>
) {
	return createHackKitMutations(await getRuntime()).updateUserProfile(...args);
}

export async function registerHacker(
	...args: Parameters<
		ReturnType<typeof createHackKitMutations>["registerHacker"]
	>
) {
	return createHackKitMutations(await getRuntime()).registerHacker(...args);
}

export async function createEvent(
	...args: Parameters<
		ReturnType<typeof createHackKitMutations>["createEvent"]
	>
) {
	return createHackKitMutations(await getRuntime()).createEvent(...args);
}

export async function updateEvent(
	...args: Parameters<
		ReturnType<typeof createHackKitMutations>["updateEvent"]
	>
) {
	return createHackKitMutations(await getRuntime()).updateEvent(...args);
}

export async function deleteEvent(
	...args: Parameters<
		ReturnType<typeof createHackKitMutations>["deleteEvent"]
	>
) {
	return createHackKitMutations(await getRuntime()).deleteEvent(...args);
}

export async function previewEventPassQr(
	...args: Parameters<
		ReturnType<typeof createHackKitMutations>["previewEventPassQr"]
	>
) {
	return createHackKitMutations(await getRuntime()).previewEventPassQr(
		...args,
	);
}

export async function recordEventScan(
	...args: Parameters<
		ReturnType<typeof createHackKitMutations>["recordEventScan"]
	>
) {
	return createHackKitMutations(await getRuntime()).recordEventScan(...args);
}

export async function checkInUser(
	...args: Parameters<
		ReturnType<typeof createHackKitMutations>["checkInUser"]
	>
) {
	return createHackKitMutations(await getRuntime()).checkInUser(...args);
}

export async function clearCheckIn(
	...args: Parameters<
		ReturnType<typeof createHackKitMutations>["clearCheckIn"]
	>
) {
	return createHackKitMutations(await getRuntime()).clearCheckIn(...args);
}

export async function confirmRsvp(
	...args: Parameters<ReturnType<typeof createHackKitMutations>["confirmRsvp"]>
) {
	return createHackKitMutations(await getRuntime()).confirmRsvp(...args);
}

export async function cancelRsvp(
	...args: Parameters<ReturnType<typeof createHackKitMutations>["cancelRsvp"]>
) {
	return createHackKitMutations(await getRuntime()).cancelRsvp(...args);
}

export async function setRsvpStatus(
	...args: Parameters<
		ReturnType<typeof createHackKitMutations>["setRsvpStatus"]
	>
) {
	return createHackKitMutations(await getRuntime()).setRsvpStatus(...args);
}

export async function promoteRsvp(
	...args: Parameters<ReturnType<typeof createHackKitMutations>["promoteRsvp"]>
) {
	return createHackKitMutations(await getRuntime()).promoteRsvp(...args);
}

export async function approveUser(
	...args: Parameters<
		ReturnType<typeof createHackKitMutations>["approveUser"]
	>
) {
	return createHackKitMutations(await getRuntime()).approveUser(...args);
}

export async function banUser(
	...args: Parameters<ReturnType<typeof createHackKitMutations>["banUser"]>
) {
	return createHackKitMutations(await getRuntime()).banUser(...args);
}

export async function unbanUser(
	...args: Parameters<ReturnType<typeof createHackKitMutations>["unbanUser"]>
) {
	return createHackKitMutations(await getRuntime()).unbanUser(...args);
}

export async function assignRoleToUser(
	...args: Parameters<
		ReturnType<typeof createHackKitMutations>["assignRoleToUser"]
	>
) {
	return createHackKitMutations(await getRuntime()).assignRoleToUser(...args);
}

export async function createRole(
	...args: Parameters<ReturnType<typeof createHackKitMutations>["createRole"]>
) {
	return createHackKitMutations(await getRuntime()).createRole(...args);
}

export async function updateRole(
	...args: Parameters<ReturnType<typeof createHackKitMutations>["updateRole"]>
) {
	return createHackKitMutations(await getRuntime()).updateRole(...args);
}

export async function deleteRole(
	...args: Parameters<ReturnType<typeof createHackKitMutations>["deleteRole"]>
) {
	return createHackKitMutations(await getRuntime()).deleteRole(...args);
}

export async function listSettings() {
	return createHackKitMutations(await getRuntime()).listSettings();
}

export async function setSettings(
	...args: Parameters<
		ReturnType<typeof createHackKitMutations>["setSettings"]
	>
) {
	return createHackKitMutations(await getRuntime()).setSettings(...args);
}

export async function resetSetting(key: SettingKey) {
	return createHackKitMutations(await getRuntime()).resetSetting(key);
}
