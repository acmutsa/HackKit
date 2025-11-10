"use server";

import { z } from "zod";
import { adminAction } from "@/lib/safe-action";
import { db } from "db";
import { roles, userCommonData } from "db/schema";
import { eq } from "db/drizzle";
import { revalidatePath } from "next/cache";
import { PermissionType } from "@/lib/constants/permission";
import {
	userHasPermission,
	compareUserPosition,
} from "@/lib/utils/server/admin";

const createRoleSchema = z.object({
	name: z.string().min(1).max(50),
	position: z.number().int().nonnegative(),
	permissions: z.number().nonnegative(),
	color: z.string().optional(),
});

const editRoleSchema = z.object({
	roleId: z.number().int().positive(),
	name: z.string().min(1).max(50).optional(),
	position: z.number().int().nonnegative().optional(),
	permissions: z.number().optional(),
	color: z.string().optional(),
});

const deleteRoleSchema = z.object({
	roleId: z.number().int().positive(),
});

export const createRole = adminAction
	.schema(createRoleSchema)
	.action(
		async ({
			parsedInput: { name, position, permissions, color },
			ctx: { user },
		}) => {
			if (!userHasPermission(user, PermissionType.CREATE_ROLES)) {
				if (!compareUserPosition(user, position)) {
					/* This prevents creation of roles higher-or-equal to the current user's position */

					throw new Error(
						"You do not have permission to create a role at this position.",
					);
				}
			}

			const existing = await db.query.roles.findFirst({
				where: eq(roles.name, name),
			});
			if (existing)
				throw new Error("Role with that name already exists.");

			await db
				.insert(roles)
				.values({ name, position, permissions, color });
			revalidatePath("/admin/roles");
			return { success: true };
		},
	);

export const editRole = adminAction
	.schema(editRoleSchema)
	.action(
		async ({
			parsedInput: { roleId, name, position, permissions, color },
			ctx: { user },
		}) => {
			const role = await db.query.roles.findFirst({
				where: eq(roles.id, roleId),
			});
			console.log(user);
			if (!role) throw new Error("Role not found");

			if (
				!userHasPermission(user, PermissionType.EDIT_ROLES) ||
				!compareUserPosition(user, role.position)
			) {
				throw new Error(
					"You do not have permission to edit this role.",
				);
			}
			if (
				position !== undefined &&
				!compareUserPosition(user, position)
			) {
				throw new Error(
					"You do not have permission to move a role to that position.",
				);
			}

			await db
				.update(roles)
				.set({
					name: name ?? role.name,
					position: position ?? role.position,
					permissions: permissions ?? role.permissions,
					color: color ?? role.color,
				})
				.where(eq(roles.id, roleId));

			revalidatePath("/admin/roles");
			return { success: true };
		},
	);

export const deleteRole = adminAction
	.schema(deleteRoleSchema)
	.action(async ({ parsedInput: { roleId }, ctx: { user } }) => {
		const role = await db.query.roles.findFirst({
			where: eq(roles.id, roleId),
		});
		if (!role) throw new Error("Role not found");

		const userCount = await db.query.userCommonData.findMany({
			where: eq(userCommonData.role_id, roleId),
		});

		if (userCount.length > 0) {
			throw new Error("Cannot delete a role that is assigned to users.");
		}

		if (!userHasPermission(user, PermissionType.DELETE_ROLES)) {
			if (!compareUserPosition(user, role.position)) {
				/* This prevents deletion of roles higher-or-equal to the current user's position */

				throw new Error(
					"You do not have permission to delete this role.",
				);
			}
		}

		await db.delete(roles).where(eq(roles.id, roleId));
		revalidatePath("/admin/roles");
		return { success: true };
	});
