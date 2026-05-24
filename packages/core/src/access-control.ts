import { HackKitError } from "./errors";
import { CorePermission, hasPermission, hasSuperAdmin } from "./permissions";
import type { AuthId, PermissionKey, Role, User } from "./types";

export type AccessPrincipal = {
	user: User;
	role: Role;
};

export type AccessControlDeps = {
	getUserOrThrow: (authId: AuthId) => Promise<User>;
	getRoleOrThrow: (roleId: string) => Promise<Role>;
};

export function createAccessControl(deps: AccessControlDeps) {
	const { getUserOrThrow, getRoleOrThrow } = deps;

	async function getPrincipal(authId: AuthId): Promise<AccessPrincipal> {
		const user = await getUserOrThrow(authId);
		if (!user.roleId) {
			throw new HackKitError("FORBIDDEN", "User has no role.");
		}
		return { user, role: await getRoleOrThrow(user.roleId) };
	}

	function principalCanBypassHierarchy(principal: AccessPrincipal): boolean {
		return hasSuperAdmin(principal.role.permissions);
	}

	function principalOutranks(
		principal: AccessPrincipal,
		role: Role,
	): boolean {
		return (
			principalCanBypassHierarchy(principal) ||
			principal.role.position < role.position
		);
	}

	return {
		getPrincipal,

		async requirePermission(
			authId: AuthId,
			permission: PermissionKey,
		): Promise<AccessPrincipal> {
			const principal = await getPrincipal(authId);
			if (!hasPermission(principal.role.permissions, permission)) {
				throw new HackKitError(
					"FORBIDDEN",
					"User does not have the required permission.",
				);
			}
			return principal;
		},

		async hasPermission(
			authId: AuthId,
			permission: PermissionKey,
		): Promise<boolean> {
			const user = await getUserOrThrow(authId);
			if (!user.roleId) return false;
			const role = await getRoleOrThrow(user.roleId);
			return hasPermission(role.permissions, permission);
		},

		assertCanManageRole(principal: AccessPrincipal, role: Role): void {
			if (!principalOutranks(principal, role)) {
				throw new HackKitError(
					"FORBIDDEN",
					"User cannot manage a role at this position.",
				);
			}
		},

		assertCanGrantPermissions(
			principal: AccessPrincipal,
			permissions: PermissionKey[],
		): void {
			const includesSuperAdmin = permissions.includes(
				CorePermission.SuperAdmin,
			);
			if (
				includesSuperAdmin &&
				!hasSuperAdmin(principal.role.permissions)
			) {
				throw new HackKitError(
					"FORBIDDEN",
					"Only a super admin can grant or remove super admin permission.",
				);
			}
		},
	};
}

export type AccessControl = ReturnType<typeof createAccessControl>;
