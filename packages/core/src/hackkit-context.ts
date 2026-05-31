import type { HackKitLogger } from "./adapters/logger";
import type { DatabaseAdapter } from "./database";
import type { EventTypes } from "./event-types";
import type { SettingKey, SettingValue } from "./settings";
import type { UserDataOptions } from "./user-data-options";
import type { AccessControl, AccessPrincipal } from "./access-control";
import type { AuthId, PermissionKey, Role, User } from "./types";

export type HackkitRuntimeContext = {
	db: DatabaseAdapter;
	now: () => Date;
	id: () => string;
	logger: HackKitLogger;
	defaultCompetitorRoleId?: string;
	getSettingValue: (key: SettingKey) => Promise<SettingValue>;
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
