export {
	compileDrizzleStorage,
	createDrizzleDatabaseAdapter,
	createDrizzleSchemaAdapter,
	syncDrizzleStorage,
	toDrizzleTableName,
	toDrizzleTableExportName,
} from "./adapters/db/drizzle";
export type { CompiledDrizzleStorage, DrizzleLibsqlDatabase } from "./adapters/db/drizzle";
export type { AuthAdapter, AuthIdentity, AuthSession } from "./adapters/auth";
export type {
	BlobStorageAdapter,
	BlobStorageAdapterWithView,
	BlobUploadTarget,
	BlobUploadTargetInput,
	BlobViewInput,
	BlobViewResult,
} from "./adapters/blob";
export {
	createDefaultLogger,
	createLogger,
	logDomain,
	resolveDefaultLogLevel,
} from "./adapters/logger";
export type {
	DomainLogContext,
	HackKitLogger,
	HackKitLoggerOptions,
	LogLevel,
} from "./adapters/logger";
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
export {
	defaultEventTypes,
	eventTypeValueSchema,
	resolveEventTypes,
} from "./event-types";
export {
	CoreSetting,
	coreSettings,
	defineSetting,
	validateSettingValue,
} from "./settings";
export {
	createInMemoryDatabaseAdapter,
	createInMemoryDatabaseAdapterFromStorage,
} from "./adapters/db/memory";
export { createAccessControl } from "./access-control";
export type { AccessControl, AccessPrincipal } from "./access-control";
export type { HackkitRuntimeContext } from "./hackkit-context";
export type {
	EventTypeOption,
	EventTypes,
	EventTypesInput,
} from "./event-types";
export type {
	DatabaseAdapter,
	DatabaseAdapterFactory,
	DatabaseAdapterFactoryContext,
	DatabaseAdapterInput,
	DatabaseSchemaAdapter,
	FieldDefinition,
	FieldKind,
	FieldReference,
	FindManyOptions,
	GeneratedSchemaFile,
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
export type {
	BooleanSettingDefinition,
	HackathonSettingDefinition,
	NumberSettingDefinition,
	ResolvedHackathonSetting,
	SettingKey,
	SettingValue,
	SettingValueType,
} from "./settings";
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
	Event,
	EventScan,
	HackathonSetting,
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
	NewHackathonSetting,
} from "./types";
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
	storedFileReferenceSchema,
	roleIdSchema,
	unbanUserSchema,
	updateEventSchemaFactory,
	updateRoleSchema,
} from "./schemas";
export type { CompleteUserDataInput } from "./schemas";
