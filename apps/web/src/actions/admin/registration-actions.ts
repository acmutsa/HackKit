"use server";

import { z } from "zod";
import { adminAction } from "@/lib/safe-action";
import { redisSet } from "@/lib/utils/server/redis";
import { revalidatePath } from "next/cache";
import { userHasPermission } from "@/lib/utils/server/admin";
import { PermissionType } from "@/lib/constants/permission";

const defaultRegistrationToggleSchema = z.object({
	enabled: z.boolean(),
});

const defaultRSVPLimitSchema = z.object({
	rsvpLimit: z.number(),
});

export const toggleRegistrationEnabled = adminAction
	.schema(defaultRegistrationToggleSchema)
	.action(async ({ parsedInput: { enabled }, ctx: { user, userId } }) => {
		if (!userHasPermission(user, PermissionType.MANAGE_REGISTRATION)) {
			throw new Error(
				"You do not have permission to manage registration settings.",
			);
		}

		await redisSet("config:registration:registrationEnabled", enabled);
		revalidatePath("/admin/toggles/registration");
		return { success: true, statusSet: enabled };
	});

export const toggleRegistrationMessageEnabled = adminAction
	.schema(defaultRegistrationToggleSchema)
	.action(async ({ parsedInput: { enabled }, ctx: { user, userId } }) => {
		if (!userHasPermission(user, PermissionType.MANAGE_REGISTRATION)) {
			throw new Error(
				"You do not have permission to manage registration settings.",
			);
		}

		await redisSet(
			"config:registration:registrationMessageEnabled",
			enabled,
		);
		revalidatePath("/admin/toggles/registration");
		return { success: true, statusSet: enabled };
	});

export const toggleRSVPs = adminAction
	.schema(defaultRegistrationToggleSchema)
	.action(async ({ parsedInput: { enabled }, ctx: { user, userId } }) => {
		if (!userHasPermission(user, PermissionType.MANAGE_REGISTRATION)) {
			throw new Error(
				"You do not have permission to manage registration settings.",
			);
		}

		await redisSet("config:registration:allowRSVPs", enabled);
		revalidatePath("/admin/toggles/registration");
		return { success: true, statusSet: enabled };
	});

export const setRSVPLimit = adminAction
	.schema(defaultRSVPLimitSchema)
	.action(async ({ parsedInput: { rsvpLimit }, ctx: { user, userId } }) => {
		if (!userHasPermission(user, PermissionType.MANAGE_REGISTRATION)) {
			throw new Error(
				"You do not have permission to manage registration settings.",
			);
		}

		await redisSet("config:registration:maxRSVPs", rsvpLimit);
		revalidatePath("/admin/toggles/registration");
		return { success: true, statusSet: rsvpLimit };
	});
