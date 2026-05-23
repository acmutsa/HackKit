import {
	isDatabaseAdapterFactory,
	type DatabaseAdapterInput,
} from "./database";
import { HackKitError, parseInput } from "./errors";
import { coreModels } from "./models";
import { CorePermission, hasPermission, hasSuperAdmin } from "./permissions";
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
import {
	createCompleteUserDataSchema,
	resolveUserDataOptions,
	type UserDataOptionsInput,
} from "./user-data-options";
import {
	DEFAULT_EVENT_PASS_QR_TTL_MS,
	resolveEventTypes,
	type EventTypesInput,
} from "./event-types";

type CreateHackkitOptions<
	TPlugins extends readonly HackKitPlugin[] = readonly HackKitPlugin[],
> = {
	database: DatabaseAdapterInput;
	plugins?: TPlugins;
	clock?: () => Date;
	id?: () => string;
	userDataOptions?: UserDataOptionsInput;
	eventTypes?: EventTypesInput;
	eventPassQrTtlMs?: number;
};

type Actor = {
	user: User;
	role: Role;
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
	const eventPassQrTtlMs =
		options.eventPassQrTtlMs ?? DEFAULT_EVENT_PASS_QR_TTL_MS;
	const completeUserDataSchema =
		createCompleteUserDataSchema(userDataOptions);

	const eventsApiContext = {
		db,
		now,
		id,
		eventTypes,
		eventPassQrTtlMs,
		getUserOrThrow,
		getRoleOrThrow,
		requirePermission,
	};

	const usersApiContext = {
		db,
		now,
		eventPassQrTtlMs,
		getUserOrThrow,
		getRoleOrThrow,
		requirePermission,
		assertCanManageRole,
	};

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

	async function getActor(actorAuthId: AuthId): Promise<Actor> {
		const user = await getUserOrThrow(actorAuthId);
		if (!user.roleId)
			throw new HackKitError("FORBIDDEN", "Actor has no role.");
		return { user, role: await getRoleOrThrow(user.roleId) };
	}

	function actorCanBypassHierarchy(actor: Actor): boolean {
		return hasSuperAdmin(actor.role.permissions);
	}

	function actorOutranks(actor: Actor, role: Role): boolean {
		return (
			actorCanBypassHierarchy(actor) ||
			actor.role.position < role.position
		);
	}

	async function requirePermission(
		actorAuthId: AuthId,
		permission: PermissionKey,
	): Promise<Actor> {
		const actor = await getActor(actorAuthId);
		if (!hasPermission(actor.role.permissions, permission)) {
			throw new HackKitError(
				"FORBIDDEN",
				"Actor does not have the required permission.",
			);
		}
		return actor;
	}

	function assertCanManageRole(actor: Actor, role: Role): void {
		if (!actorOutranks(actor, role)) {
			throw new HackKitError(
				"FORBIDDEN",
				"Actor cannot manage a role at this position.",
			);
		}
	}

	function assertCanGrantPermissions(
		actor: Actor,
		permissions: PermissionKey[],
	): void {
		const includesSuperAdmin = permissions.includes(
			CorePermission.SuperAdmin,
		);
		if (includesSuperAdmin && !hasSuperAdmin(actor.role.permissions)) {
			throw new HackKitError(
				"FORBIDDEN",
				"Only a super admin can grant or remove super admin permission.",
			);
		}
	}

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
		users: createUsersApi(usersApiContext),
		events: createEventsApi(eventsApiContext),

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
				const actor = await requirePermission(
					parsed.actorAuthId,
					CorePermission.RolesCreate,
				);
				const rolePosition = {
					...actor.role,
					position: parsed.position,
				};
				assertCanManageRole(actor, rolePosition);
				assertCanGrantPermissions(
					actor,
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
				const actor = await requirePermission(
					parsed.actorAuthId,
					CorePermission.RolesUpdate,
				);
				const role = await getRoleOrThrow(parsed.roleId);
				assertCanManageRole(actor, role);
				if (parsed.position !== undefined)
					assertCanManageRole(actor, {
						...role,
						position: parsed.position,
					});
				if (parsed.permissions)
					assertCanGrantPermissions(
						actor,
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
				const actor = await requirePermission(
					parsed.actorAuthId,
					CorePermission.RolesDelete,
				);
				const role = await getRoleOrThrow(parsed.roleId);
				assertCanManageRole(actor, role);
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
				const actor = await requirePermission(
					parsed.actorAuthId,
					CorePermission.RolesAssign,
				);
				const target = await getUserOrThrow(parsed.targetAuthId);
				const nextRole = await getRoleOrThrow(parsed.roleId);
				assertCanManageRole(actor, nextRole);
				if (target.roleId)
					assertCanManageRole(
						actor,
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

		registration: {
			registerHacker,
		},
	};

	return hackkit as typeof hackkit & { plugins: PluginApiMap<TPlugins> };
}

export type HackKit = ReturnType<typeof createHackkit>;
