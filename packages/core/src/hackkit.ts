import {
	isDatabaseAdapterFactory,
	type DatabaseAdapterInput,
} from "./database";
import { createAccessControl } from "./access-control";
import { HackKitError, parseInput } from "./errors";
import type { HackkitRuntimeContext } from "./hackkit-context";
import { coreModels } from "./models";
import { CorePermission } from "./permissions";
import {
	createPluginRegistry,
	setupPluginApis,
	type HackKitPlugin,
	type PluginApiMap,
} from "./plugins";
import {
	assignRoleSchema,
	bootstrapOwnerSchema,
	createRoleSchema,
	deleteRoleSchema,
	registerHackerSchema,
	updateRoleSchema,
} from "./schemas";
import type {
	AuthId,
	Hacker,
	PermissionKey,
	Role,
	RoleId,
	User,
	UserData,
} from "./types";
import { createUsersApi } from "./functions/users";
import { createEventsApi } from "./functions/events";
import { createSettingsApi } from "./functions/settings";
import { createCompetitorRegistrationPolicy } from "./functions/registration-policy";
import {
	createCompleteUserDataSchema,
	resolveUserDataOptions,
	type UserDataOptionsInput,
} from "./user-data-options";
import {
	resolveEventTypes,
	type EventTypesInput,
} from "./event-types";
import {
	createLogger,
	type HackKitLoggerOptions,
} from "./adapters/logger";
import { withDomainLog } from "./domain-log";

type SeedRoleInput = {
	id: string;
	name: string;
	position: number;
	permissions: PermissionKey[];
	color?: string;
};

type CreateHackkitOptions<
	TPlugins extends readonly HackKitPlugin[] = readonly HackKitPlugin[],
> = {
	database: DatabaseAdapterInput;
	plugins?: TPlugins;
	clock?: () => Date;
	id?: () => string;
	userDataOptions?: UserDataOptionsInput;
	eventTypes?: EventTypesInput;
	logger?: HackKitLoggerOptions;
	defaultCompetitorRoleId?: string;
	seedRoles?: readonly SeedRoleInput[];
};

const defaultId = () =>
	globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);

export function createHackkit<
	const TPlugins extends readonly HackKitPlugin[] = [],
>(options: CreateHackkitOptions<TPlugins>) {
	const plugins = options.plugins ?? ([] as unknown as TPlugins);
	const registry = createPluginRegistry(plugins);
	const now = options.clock ?? (() => new Date());
	const id = options.id ?? defaultId;
	const db = isDatabaseAdapterFactory(options.database)
		? options.database.create({ storage: registry.storage, now, id })
		: options.database;
	const userDataOptions = resolveUserDataOptions(options.userDataOptions);
	const eventTypes = resolveEventTypes(options.eventTypes);
	const completeUserDataSchema =
		createCompleteUserDataSchema(userDataOptions);
	const logger = createLogger(options.logger);
	const defaultCompetitorRoleId = options.defaultCompetitorRoleId;
	const seedRoles = options.seedRoles ?? [];

	async function seedConfiguredRoles(): Promise<void> {
		const timestamp = now();
		for (const role of seedRoles) {
			const existing = await db.findOne(coreModels.role, { id: role.id });
			if (existing) continue;
			await db.insert(coreModels.role, {
				...role,
				createdAt: timestamp,
				updatedAt: timestamp,
			});
		}
	}

	async function getUserOrThrow(authId: AuthId): Promise<User> {
		const user = await db.findOne(coreModels.user, { authId });
		if (!user) throw new HackKitError("NOT_FOUND", "User not found.");
		return user;
	}

	async function getRoleOrThrow(roleId: RoleId): Promise<Role> {
		const role = await db.findOne(coreModels.role, { id: roleId });
		if (!role) throw new HackKitError("NOT_FOUND", "Role not found.");
		return role;
	}

	const accessControl = createAccessControl({ getUserOrThrow, getRoleOrThrow });
	const settingsApi = createSettingsApi({
		db,
		now,
		logger,
		settings: registry.settings,
		requirePermission: accessControl.requirePermission,
	});
	const pluginApis = setupPluginApis(plugins, {
		database: db,
		registry,
		getSettingValue: settingsApi.getValue,
	});

	const runtimeContext: HackkitRuntimeContext = {
		db,
		now,
		id,
		logger,
		defaultCompetitorRoleId,
		getSettingValue: settingsApi.getValue,
		eventTypes,
		userDataOptions,
		getUserOrThrow,
		getRoleOrThrow,
		requirePermission: accessControl.requirePermission,
		assertCanManageRole: accessControl.assertCanManageRole,
		accessControl,
	};

	const registrationPolicy = createCompetitorRegistrationPolicy(runtimeContext);

	async function registerHacker(input: unknown): Promise<Hacker> {
		const parsed = parseInput(registerHackerSchema, input);
		return withDomainLog(
			logger,
			"hackers.register",
			{ targetAuthId: parsed.authId },
			async () => {
				await getUserOrThrow(parsed.authId);
				const userData = await db.findOne(coreModels.userData, {
					authId: parsed.authId,
				});
				if (!userData)
					throw new HackKitError(
						"INVALID_OPERATION",
						"User Data must be completed before registering as a Hacker.",
					);
				const existing = await db.findOne(coreModels.hacker, {
					authId: parsed.authId,
				});
				const timestamp = now();
				const value: Hacker = {
					...parsed,
					registeredAt: existing?.registeredAt ?? timestamp,
					updatedAt: timestamp,
				};

				let hacker: Hacker;
				if (!existing) {
					const { requireApproval } =
						await registrationPolicy.assertCanRegisterNewHacker();
					hacker = await db.insert(coreModels.hacker, value);
					if (defaultCompetitorRoleId) {
						await getRoleOrThrow(defaultCompetitorRoleId);
						await db.update(
							coreModels.user,
							{ authId: parsed.authId },
							{
								roleId: defaultCompetitorRoleId,
								isApproved: !requireApproval,
								updatedAt: timestamp,
							},
						);
					} else if (!requireApproval) {
						await db.update(
							coreModels.user,
							{ authId: parsed.authId },
							{
								isApproved: true,
								updatedAt: timestamp,
							},
						);
					}
				} else {
					const [updated] = await db.update(
						coreModels.hacker,
						{ authId: parsed.authId },
						value,
					);
					hacker = updated ?? value;
				}
				return hacker;
			},
		);
	}

	const hackkit = {
		models: coreModels,
		permissions: CorePermission,
		registry,
		plugins: pluginApis,
		accessControl,
		settings: settingsApi,
		users: createUsersApi({ ...runtimeContext, registrationPolicy }),
		events: createEventsApi(runtimeContext),
		async init(): Promise<void> {
			await seedConfiguredRoles();
		},

		userData: {
			options: userDataOptions,

			async getUserData(authId: AuthId): Promise<UserData | null> {
				return db.findOne(coreModels.userData, { authId });
			},

			async completeUserData(input: unknown): Promise<UserData> {
				const parsed = parseInput(completeUserDataSchema, input);
				await getUserOrThrow(parsed.authId);
				const existing = await db.findOne(coreModels.userData, {
					authId: parsed.authId,
				});
				const timestamp = now();
				const value: UserData = {
					...parsed,
					completedAt: existing?.completedAt ?? timestamp,
					updatedAt: timestamp,
				};
				if (!existing) return db.insert(coreModels.userData, value);
				const [updated] = await db.update(
					coreModels.userData,
					{ authId: parsed.authId },
					value,
				);
				return updated ?? value;
			},
		},

		hackers: {
			registerHacker,

			async getHacker(authId: AuthId): Promise<Hacker | null> {
				return db.findOne(coreModels.hacker, { authId });
			},
		},

		roles: {
			async getRole(roleId: RoleId): Promise<Role | null> {
				return db.findOne(coreModels.role, { id: roleId });
			},

			async bootstrapOwner(input: unknown): Promise<Role> {
				const parsed = parseInput(bootstrapOwnerSchema, input);
				await getUserOrThrow(parsed.authId);
				const superRoles = (await db.findMany(coreModels.role)).filter(
					(role) =>
						role.permissions.includes(CorePermission.SuperAdmin),
				);
				if (superRoles.length > 0) {
					throw new HackKitError(
						"INVALID_OPERATION",
						"A super admin role already exists.",
					);
				}
				const timestamp = now();
				const role: Role = {
					id: "core.owner",
					name: "Owner",
					position: 0,
					permissions: [CorePermission.SuperAdmin],
					createdAt: timestamp,
					updatedAt: timestamp,
				};
				const existingOwnerRole = await db.findOne(coreModels.role, {
					id: role.id,
				});
				const ownerRole =
					existingOwnerRole ??
					(await db.insert(coreModels.role, role));
				await db.update(
					coreModels.user,
					{ authId: parsed.authId },
					{ roleId: ownerRole.id, updatedAt: timestamp },
				);
				return ownerRole;
			},

			async createRole(input: unknown): Promise<Role> {
				const parsed = parseInput(createRoleSchema, input);
				const principal = await accessControl.requirePermission(
					parsed.actorAuthId,
					CorePermission.RolesCreate,
				);
				const rolePosition = {
					...principal.role,
					position: parsed.position,
				};
				accessControl.assertCanManageRole(principal, rolePosition);
				accessControl.assertCanGrantPermissions(
					principal,
					parsed.permissions as PermissionKey[],
				);
				const existingName = await db.findOne(coreModels.role, {
					name: parsed.name,
				});
				if (existingName)
					throw new HackKitError(
						"CONFLICT",
						"Role name already exists.",
					);
				const timestamp = now();
				return db.insert(coreModels.role, {
					id: parsed.id ?? id(),
					name: parsed.name,
					position: parsed.position,
					permissions: parsed.permissions as PermissionKey[],
					color: parsed.color,
					createdAt: timestamp,
					updatedAt: timestamp,
				});
			},

			async updateRole(input: unknown): Promise<Role> {
				const parsed = parseInput(updateRoleSchema, input);
				const principal = await accessControl.requirePermission(
					parsed.actorAuthId,
					CorePermission.RolesUpdate,
				);
				const role = await getRoleOrThrow(parsed.roleId);
				accessControl.assertCanManageRole(principal, role);
				if (parsed.position !== undefined)
					accessControl.assertCanManageRole(principal, {
						...role,
						position: parsed.position,
					});
				if (parsed.permissions)
					accessControl.assertCanGrantPermissions(
						principal,
						parsed.permissions as PermissionKey[],
					);
				const [updated] = await db.update(
					coreModels.role,
					{ id: parsed.roleId },
					{
						name: parsed.name,
						position: parsed.position,
						permissions: parsed.permissions as
							| PermissionKey[]
							| undefined,
						color: parsed.color,
						updatedAt: now(),
					},
				);
				if (!updated)
					throw new HackKitError("NOT_FOUND", "Role not found.");
				return updated;
			},

			async deleteRole(input: unknown): Promise<void> {
				const parsed = parseInput(deleteRoleSchema, input);
				const principal = await accessControl.requirePermission(
					parsed.actorAuthId,
					CorePermission.RolesDelete,
				);
				const role = await getRoleOrThrow(parsed.roleId);
				accessControl.assertCanManageRole(principal, role);
				const usersWithRole = await db.findMany(coreModels.user, {
					where: { roleId: parsed.roleId },
					limit: 1,
				});
				if (usersWithRole.length > 0)
					throw new HackKitError(
						"INVALID_OPERATION",
						"Cannot delete a role assigned to users.",
					);
				await db.delete(coreModels.role, { id: parsed.roleId });
			},

			async assignRoleToUser(input: unknown): Promise<User> {
				const parsed = parseInput(assignRoleSchema, input);
				const principal = await accessControl.requirePermission(
					parsed.actorAuthId,
					CorePermission.RolesAssign,
				);
				const target = await getUserOrThrow(parsed.targetAuthId);
				const nextRole = await getRoleOrThrow(parsed.roleId);
				accessControl.assertCanManageRole(principal, nextRole);
				if (target.roleId)
					accessControl.assertCanManageRole(
						principal,
						await getRoleOrThrow(target.roleId),
					);
				const [updated] = await db.update(
					coreModels.user,
					{ authId: parsed.targetAuthId },
					{
						roleId: parsed.roleId,
						updatedAt: now(),
					},
				);
				if (!updated)
					throw new HackKitError("NOT_FOUND", "User not found.");
				return updated;
			},
		},
	};

	return hackkit as typeof hackkit & { plugins: PluginApiMap<TPlugins> };
}

export type HackKit = ReturnType<typeof createHackkit>;
