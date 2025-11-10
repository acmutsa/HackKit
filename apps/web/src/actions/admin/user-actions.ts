"use server";

import { adminAction } from "@/lib/safe-action";
import { returnValidationErrors } from "next-safe-action";
import { z } from "zod";
import { userCommonData, bannedUsers, roles } from "db/schema";
import { db } from "db";
import { eq } from "db/drizzle";
import { revalidatePath } from "next/cache";
import {
	compareUserPosition,
	userHasPermission,
} from "@/lib/utils/server/admin";
import { PermissionType } from "@/lib/constants/permission";
import { getUser } from "db/functions";

export const updateRole = adminAction
	.schema(
		z.object({
			userIDToUpdate: z.string(),
			roleIdToSet: z.number().positive().int(),
		}),
	)
	.action(
		async ({
			parsedInput: { userIDToUpdate, roleIdToSet },
			ctx: { user, userId },
		}) => {
			const userToUpdate = await getUser(userIDToUpdate);
			const roleToSet = await db.query.roles.findFirst({
				where: eq(roles.id, roleIdToSet),
			});

			if (!roleToSet) {
				throw new Error("Role does not exist");
			}

			if (!userToUpdate) {
				throw new Error("User to update not found.");
			}

			if (!userHasPermission(user, PermissionType.CHANGE_USER_ROLES)) {
				if (
					!compareUserPosition(user, userToUpdate.role.position) ||
					!compareUserPosition(user, roleToSet.position)
				) {
					throw new Error(
						"You do not have permission to set this role.",
					);
				}
			}
			await db
				.update(userCommonData)
				.set({ role_id: roleIdToSet })
				.where(eq(userCommonData.clerkID, userIDToUpdate));
			revalidatePath(`/admin/users/${userIDToUpdate}`);
			return { success: true };
		},
	);

export const setUserApproval = adminAction
	.schema(
		z.object({
			userIDToUpdate: z.string().min(1),
			approved: z.boolean(),
		}),
	)
	.action(
		async ({
			parsedInput: { userIDToUpdate, approved },
			ctx: { user, userId },
		}) => {
			await db
				.update(userCommonData)
				.set({ isApproved: approved })
				.where(eq(userCommonData.clerkID, userIDToUpdate));
			revalidatePath(`/admin/users/${userIDToUpdate}`);
			return { success: true };
		},
	);

export const banUser = adminAction
	.schema(
		z.object({
			userIDToUpdate: z.string(),
			reason: z.string(),
		}),
	)
	.action(
		async ({
			parsedInput: { userIDToUpdate, reason },
			ctx: { user, userId },
		}) => {
			const userToBan = await getUser(userIDToUpdate);

			if (
				!userHasPermission(user, PermissionType.BAN_USERS) ||
				!compareUserPosition(user, userToBan!.role.position)
			) {
				throw new Error("You do not have permission to ban users.");
			}

			await db.insert(bannedUsers).values({
				userID: userIDToUpdate,
				reason: reason,
				bannedByID: user.clerkID,
			});
			revalidatePath(`/admin/users/${userIDToUpdate}`);
			return { success: true };
		},
	);

export const removeUserBan = adminAction
	.schema(
		z.object({
			userIDToUpdate: z.string(),
		}),
	)
	.action(async ({ parsedInput: { userIDToUpdate }, ctx: { user } }) => {
		const userToBan = await getUser(userIDToUpdate);

		if (
			!userHasPermission(user, PermissionType.BAN_USERS) ||
			!compareUserPosition(user, userToBan!.role.position)
		) {
			throw new Error("You do not have permission to ban users.");
		}

		await db
			.delete(bannedUsers)
			.where(eq(bannedUsers.userID, userIDToUpdate));
		revalidatePath(`/admin/users/${userIDToUpdate}`);
		return { success: true };
	});
