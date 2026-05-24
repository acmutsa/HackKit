export {
	createDrizzleDatabaseAdapter,
	syncDrizzleStorage,
	toDrizzleTableName,
} from "./adapters/db/drizzle.js";
export type { DrizzleLibsqlDatabase } from "./adapters/db/drizzle.js";
export type { AuthAdapter, AuthIdentity, AuthSession } from "./adapters/auth.js";
export { createHackkit } from "./hackkit.js";
export type { HackKit } from "./hackkit.js";
export {
	defineModel,
	field,
	isDatabaseAdapterFactory,
	model,
} from "./database.js";
export {
	createCompleteUserDataSchema,
	defaultUserDataOptions,
	resolveUserDataOptions,
} from "./user-data-options.js";
export {
	defaultEventTypes,
	eventTypeValueSchema,
	resolveEventTypes,
} from "./event-types.js";
export {
	createInMemoryDatabaseAdapter,
	createInMemoryDatabaseAdapterFromStorage,
} from "./adapters/db/memory.js";
export { createAccessControl } from "./access-control.js";
export type { AccessControl, AccessPrincipal } from "./access-control.js";
export type { HackkitRuntimeContext } from "./hackkit-context.js";
export type {
	EventTypeOption,
	EventTypes,
	EventTypesInput,
} from "./event-types.js";
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
} from "./database.js";
export type {
	UserDataOption,
	UserDataOptions,
	UserDataOptionsInput,
} from "./user-data-options.js";
export { HackKitError, hackKitErrorCodes } from "./errors.js";
export type { HackKitErrorCode } from "./errors.js";
export { coreModels } from "./models.js";
export { CorePermission, hasPermission, hasSuperAdmin } from "./permissions.js";
export { createPluginRegistry, setupPluginApis } from "./plugins.js";
export type {
	HackKitPlugin,
	HackKitPluginContext,
	HackKitRegistry,
	PluginApiMap,
} from "./plugins.js";
export type {
	AuthId,
	Event,
	EventScan,
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
	NewEvent,
	NewEventScan,
} from "./types.js";
export {
	assignRoleSchema,
	approveUserSchema,
	banUserSchema,
	bootstrapOwnerSchema,
	checkInUserSchema,
	claimHackTagSchema,
	clearCheckInUserSchema,
	completeUserDataSchema,
	createEventSchemaFactory,
	createRoleSchema,
	deleteEventSchema,
	deleteRoleSchema,
	ensureUserSchema,
	getEventSchema,
	hackTagSchema,
	listEventScansSchema,
	permissionKeySchema,
	recordEventScanSchema,
	registerHackerSchema,
	roleIdSchema,
	unbanUserSchema,
	updateEventSchemaFactory,
	updateRoleSchema,
} from "./schemas.js";
export type { CompleteUserDataInput } from "./schemas.js";
