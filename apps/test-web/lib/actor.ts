import {
	CorePermission,
	hasPermission,
	type PermissionKey,
} from "@hackkit/core";
import { notFound } from "next/navigation";
import { getCurrentUser, hackkit } from "./hackkit";

export async function requireActorPermission(permission: PermissionKey) {
	const user = await getCurrentUser();
	if (!user.roleId) notFound();

	const role = await hackkit.roles.getRole(user.roleId);
	if (!role || !hasPermission(role.permissions, permission)) {
		notFound();
	}

	return user;
}

export async function getOptionalActorPermission(permission: PermissionKey) {
	const user = await getCurrentUser();
	if (!user.roleId) return null;

	const role = await hackkit.roles.getRole(user.roleId);
	if (!role || !hasPermission(role.permissions, permission)) {
		return null;
	}

	return user;
}

export { CorePermission };
