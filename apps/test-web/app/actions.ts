"use server";

import { actionFailure, actionSuccess } from "@hackkit/ui";
import { getRuntime } from "@/lib/runtime";

export async function completeUserData(
	...args: Parameters<
		Awaited<ReturnType<typeof getRuntime>>["mutations"]["completeUserData"]
	>
) {
	const { mutations } = await getRuntime();
	return mutations.completeUserData(...args);
}

export async function createEvent(
	...args: Parameters<
		Awaited<ReturnType<typeof getRuntime>>["mutations"]["createEvent"]
	>
) {
	const { mutations } = await getRuntime();
	return mutations.createEvent(...args);
}

export async function updateEvent(
	...args: Parameters<
		Awaited<ReturnType<typeof getRuntime>>["mutations"]["updateEvent"]
	>
) {
	const { mutations } = await getRuntime();
	return mutations.updateEvent(...args);
}

export async function deleteEvent(
	...args: Parameters<
		Awaited<ReturnType<typeof getRuntime>>["mutations"]["deleteEvent"]
	>
) {
	const { mutations } = await getRuntime();
	return mutations.deleteEvent(...args);
}

export async function previewEventPassQr(
	...args: Parameters<
		Awaited<
			ReturnType<typeof getRuntime>
		>["mutations"]["previewEventPassQr"]
	>
) {
	const { mutations } = await getRuntime();
	return mutations.previewEventPassQr(...args);
}

export async function recordEventScan(
	...args: Parameters<
		Awaited<ReturnType<typeof getRuntime>>["mutations"]["recordEventScan"]
	>
) {
	const { mutations } = await getRuntime();
	return mutations.recordEventScan(...args);
}

export async function checkInUser(
	...args: Parameters<
		Awaited<ReturnType<typeof getRuntime>>["mutations"]["checkInUser"]
	>
) {
	const { mutations } = await getRuntime();
	return mutations.checkInUser(...args);
}

export async function clearCheckIn(
	...args: Parameters<
		Awaited<ReturnType<typeof getRuntime>>["mutations"]["clearCheckIn"]
	>
) {
	const { mutations } = await getRuntime();
	return mutations.clearCheckIn(...args);
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
