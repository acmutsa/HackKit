"use server";

import type { SettingKey } from "@hackkit/core";
import { createHackKitMutations } from "@hackkit/next";
import { actionFailure, actionSuccess } from "@hackkit/ui/actions";
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

export async function registerHacker(
	...args: Parameters<
		ReturnType<typeof createHackKitMutations>["registerHacker"]
	>
) {
	return createHackKitMutations(await getRuntime()).registerHacker(...args);
}

export async function createEvent(
	...args: Parameters<ReturnType<typeof createHackKitMutations>["createEvent"]>
) {
	return createHackKitMutations(await getRuntime()).createEvent(...args);
}

export async function updateEvent(
	...args: Parameters<ReturnType<typeof createHackKitMutations>["updateEvent"]>
) {
	return createHackKitMutations(await getRuntime()).updateEvent(...args);
}

export async function deleteEvent(
	...args: Parameters<ReturnType<typeof createHackKitMutations>["deleteEvent"]>
) {
	return createHackKitMutations(await getRuntime()).deleteEvent(...args);
}

export async function previewEventPassQr(
	...args: Parameters<
		ReturnType<typeof createHackKitMutations>["previewEventPassQr"]
	>
) {
	return createHackKitMutations(await getRuntime()).previewEventPassQr(...args);
}

export async function recordEventScan(
	...args: Parameters<
		ReturnType<typeof createHackKitMutations>["recordEventScan"]
	>
) {
	return createHackKitMutations(await getRuntime()).recordEventScan(...args);
}

export async function checkInUser(
	...args: Parameters<ReturnType<typeof createHackKitMutations>["checkInUser"]>
) {
	return createHackKitMutations(await getRuntime()).checkInUser(...args);
}

export async function clearCheckIn(
	...args: Parameters<ReturnType<typeof createHackKitMutations>["clearCheckIn"]>
) {
	return createHackKitMutations(await getRuntime()).clearCheckIn(...args);
}

export async function listSettings() {
	return createHackKitMutations(await getRuntime()).listSettings();
}

export async function setSettings(
	...args: Parameters<ReturnType<typeof createHackKitMutations>["setSettings"]>
) {
	return createHackKitMutations(await getRuntime()).setSettings(...args);
}

export async function resetSetting(key: SettingKey) {
	return createHackKitMutations(await getRuntime()).resetSetting(key);
}

export async function bootstrapOwner() {
	try {
		const { hackkit, getAuthId } = await getRuntime();
		const authId = await getAuthId();
		await hackkit.roles.bootstrapOwner({ authId });
		return actionSuccess();
	} catch (error) {
		return actionFailure(error, "Could not bootstrap owner role.");
	}
}
