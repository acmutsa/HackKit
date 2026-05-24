import {
	isDatabaseAdapterFactory,
	type DatabaseAdapterInput,
} from "./database.js";
import { createAccessControl } from "./access-control.js";
import { HackKitError, parseInput } from "./errors.js";
import type { HackkitRuntimeContext } from "./hackkit-context.js";
import { coreModels } from "./models.js";
import { CorePermission } from "./permissions.js";
import {
	createPluginRegistry,
	setupPluginApis,
	type HackKitPlugin,
	type PluginApiMap,
} from "./plugins.js";
import {
	assignRoleSchema,
	bootstrapOwnerSchema,
	createRoleSchema,
	deleteRoleSchema,
	registerHackerSchema,
	updateRoleSchema,
} from "./schemas.js";
import type {
	AuthId,
	Hacker,
	PermissionKey,
	Role,
	RoleId,
	User,
	UserData,
} from "./types.js";
import { createUsersApi } from "./functions/users.js";
import { createEventsApi } from "./functions/events.js";
import {
	createCompleteUserDataSchema,
	resolveUserDataOptions,
	type UserDataOptionsInput,
} from "./user-data-options.js";
import {
	resolveEventTypes,
	type EventTypesInput,
} from "./event-types.js";

type CreateHackkitOptions<
	TPlugins extends readonly HackKitPlugin[] = readonly HackKitPlugin[],
> = {
	database: DatabaseAdapterInput;
	plugins?: TPlugins;
	clock?: () => Date;
	id?: () => string;
	userDataOptions?: UserDataOptionsInput;
	eventTypes?: EventTypesInput;
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
	const pluginApis = setupPluginApis(plugins, { database: db, registry });
	const userDataOptions = resolveUserDataOptions(options.userDataOptions);
	const eventTypes = resolveEventTypes(options.eventTypes);
	const completeUserDataSchema =
		createCompleteUserDataSchema(userDataOptions);

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

	const runtimeContext: HackkitRuntimeContext = {
		db,
		now,
		id,
		eventTypes,
		userDataOptions,
		getUserOrThrow,
		getRoleOrThrow,
		requirePermission: accessControl.requirePermission,
		assertCanManageRole: accessControl.assertCanManageRole,
		accessControl,
	};

	async function registerHacker(input: unknown): Promise<Hacker> {
		const parsed = parseInput(registerHackerSchema, input);
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
		if (!existing) return db.insert(coreModels.hacker, value);
		const [updated] = await db.update(
			coreModels.hacker,
			{ authId: parsed.authId },
			value,
		);
		return updated ?? value;
	}

	const hackkit = {
		models: coreModels,
		permissions: CorePermission,
		registry,
		plugins: pluginApis,
		accessControl,
		users: createUsersApi(runtimeContext),
		events: createEventsApi(runtimeContext),

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
