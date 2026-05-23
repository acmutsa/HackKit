export {
	createDrizzleDatabaseAdapter,
	syncDrizzleStorage,
	toDrizzleTableName,
} from "./adapters/db/drizzle";
export type { DrizzleLibsqlDatabase } from "./adapters/db/drizzle";
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
	DEFAULT_EVENT_PASS_QR_TTL_MS,
	defaultEventTypes,
	eventTypeValueSchema,
	resolveEventTypes,
} from "./event-types";
export {
	createEventPassQrPayload,
	parseEventPassQrPayload,
	validateEventPassQrIssuedAt,
} from "./event-pass";
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
	roleIdSchema,
	unbanUserSchema,
	updateEventSchemaFactory,
	updateRoleSchema,
} from "./schemas";
export type { CompleteUserDataInput } from "./schemas";
