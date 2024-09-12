"use server";

import { adminAction } from "@/lib/safe-action";
import { z } from "zod";
import { perms } from "config";
import { userCommonData } from "db/schema";
import { db } from "db";
import { eq } from "db/drizzle";
import { revalidatePath } from "next/cache";

export const updateRole = adminAction(
	z.object({
		userIDToUpdate: z.string(),
		roleToSet: z.enum(perms),
	}),
	async ({ userIDToUpdate, roleToSet }, { user, userId }) => {
		if (
			user.role !== "super_admin" &&
			(roleToSet === "super_admin" || roleToSet === "admin")
		) {
			throw new Error("You are not allowed to do this");
		}
		await db
			.update(userCommonData)
			.set({ role: roleToSet })
			.where(eq(userCommonData.clerkID, userIDToUpdate));
		revalidatePath(`/admin/users/${userIDToUpdate}`);
		return { success: true };
	},
);

export const setUserApproval = adminAction(
	z.object({
		userIDToUpdate: z.string().min(1),
		approved: z.boolean(),
	}),

	async ({ userIDToUpdate, approved }, { user, userId }) => {
		await db
			.update(userCommonData)
			.set({ isApproved: approved })
			.where(eq(userCommonData.clerkID, userIDToUpdate));
		revalidatePath(`/admin/users/${userIDToUpdate}`);
		return { success: true };
	},
);
