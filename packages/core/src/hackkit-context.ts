import type { DatabaseAdapter } from "./database.js";
import type { EventTypes } from "./event-types.js";
import type { UserDataOptions } from "./user-data-options.js";
import type { AccessControl, AccessPrincipal } from "./access-control.js";
import type { AuthId, PermissionKey, Role, User } from "./types.js";

export type HackkitRuntimeContext = {
	db: DatabaseAdapter;
	now: () => Date;
	id: () => string;
	eventTypes: EventTypes;
	userDataOptions: UserDataOptions;
	getUserOrThrow: (authId: AuthId) => Promise<User>;
	getRoleOrThrow: (roleId: string) => Promise<Role>;
	requirePermission: (
		actorAuthId: AuthId,
		permission: PermissionKey,
	) => Promise<AccessPrincipal>;
	assertCanManageRole: (
		principal: AccessPrincipal,
		role: Role,
	) => void;
	accessControl: AccessControl;
};
