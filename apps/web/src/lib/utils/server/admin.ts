import { PermissionMask } from "@/lib/utils/shared/permission";
import { PermissionType } from "@/lib/constants/permission";
import { UserWithRole } from "db/types";

export function userHasPermission(
	user: UserWithRole,
	permissions: PermissionType | [PermissionType],
): boolean {
	const userPermissionMask = new PermissionMask(user.role?.permissions || 0);

	if (Array.isArray(permissions)) {
		return permissions.every((permission) =>
			userPermissionMask.has(permission),
		);
	}

	return userPermissionMask.has(permissions);
}

export function isUserAdmin(user: UserWithRole): boolean {
	return userHasPermission(user, PermissionType.ADMIN);
}

export function compareUserPosition(
	user: UserWithRole,
	targetRolePosition: number,
): 1 | -1 | 0 {
	const userRolePosition = user.role?.position ?? Number.MAX_SAFE_INTEGER;
	if (userRolePosition < targetRolePosition) {
		return 1;
	} else if (userRolePosition == targetRolePosition) {
		return 0;
	}
	return -1;
}
