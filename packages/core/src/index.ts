export { createHackkit } from "./hackkit";
export type { HackKit } from "./hackkit";
export {
	defineModel,
	field,
	isDatabaseAdapterFactory,
	model,
} from "./database";
export {
	createCompleteUserDataSchema,
	defaultUserDataOptions,
	resolveUserDataOptions,
} from "./user-data-options";
export type {
	DatabaseAdapter,
	DatabaseAdapterFactory,
	DatabaseAdapterFactoryContext,
	DatabaseAdapterInput,
	FieldDefinition,
	FieldKind,
	FieldReference,
	FindManyOptions,
	InferInsert,
	InferSelect,
	Model,
	ModelDefinition,
	ModelKey,
	OrderBy,
	PersistentModel,
	ReferenceAction,
	StorageDefault,
	StorageRegistry,
	Where,
} from "./database";
export type {
	UserDataOption,
	UserDataOptions,
	UserDataOptionsInput,
} from "./user-data-options";
export { HackKitError, hackKitErrorCodes } from "./errors";
export type { HackKitErrorCode } from "./errors";
export { coreModels } from "./models";
export { CorePermission, hasPermission, hasSuperAdmin } from "./permissions";
export { createPluginRegistry, setupPluginApis } from "./plugins";
export type {
	HackKitPlugin,
	HackKitPluginContext,
	HackKitRegistry,
	PluginApiMap,
} from "./plugins";
export type {
	AuthId,
	Hacker,
	PermissionKey,
	Role,
	RoleId,
	User,
	UserBan,
	UserData,
	UserId,
	NewHacker,
	NewRole,
	NewUser,
	NewUserBan,
	NewUserData,
} from "./types";
export {
	assignRoleSchema,
	approveUserSchema,
	banUserSchema,
	bootstrapOwnerSchema,
	claimHackTagSchema,
	completeUserDataSchema,
	createRoleSchema,
	deleteRoleSchema,
	ensureUserSchema,
	hackTagSchema,
	permissionKeySchema,
	registerHackerSchema,
	roleIdSchema,
	unbanUserSchema,
	updateRoleSchema,
} from "./schemas";
export type { CompleteUserDataInput } from "./schemas";
