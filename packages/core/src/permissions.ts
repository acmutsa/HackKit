import type { PermissionKey } from "./types";

export const CorePermission = {
	Admin: "core.admin",
	SuperAdmin: "core.super_admin",
	UsersView: "core.users.view",
	UsersApprove: "core.users.approve",
	UsersBan: "core.users.ban",
	RolesView: "core.roles.view",
	RolesCreate: "core.roles.create",
	RolesUpdate: "core.roles.update",
	RolesDelete: "core.roles.delete",
	RolesAssign: "core.roles.assign",
	HackersView: "core.hackers.view",
	HackersRegister: "core.hackers.register",
	EventsView: "core.events.view",
	EventsCreate: "core.events.create",
	EventsUpdate: "core.events.update",
	EventsDelete: "core.events.delete",
	EventsScan: "core.events.scan",
	UsersCheckIn: "core.users.checkIn",
} as const satisfies Record<string, PermissionKey>;

export type CorePermission =
	(typeof CorePermission)[keyof typeof CorePermission];

export function hasPermission(
	permissions: readonly PermissionKey[],
	permission: PermissionKey,
): boolean {
	return (
		permissions.includes(CorePermission.SuperAdmin) ||
		permissions.includes(CorePermission.Admin) ||
		permissions.includes(permission)
	);
}

export function hasSuperAdmin(permissions: readonly PermissionKey[]): boolean {
	return permissions.includes(CorePermission.SuperAdmin);
}
