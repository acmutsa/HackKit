import type { HackkitRuntimeContext } from "../hackkit-context.js";
import { HackKitError, parseInput } from "../errors.js";
import { coreModels } from "../models.js";
import { CorePermission } from "../permissions.js";
import {
	approveUserSchema,
	banUserSchema,
	checkInUserSchema,
	claimHackTagSchema,
	clearCheckInUserSchema,
	ensureUserSchema,
	unbanUserSchema,
} from "../schemas.js";
import type { AuthId, User, UserBan } from "../types.js";

export type UsersApiContext = Pick<
	HackkitRuntimeContext,
	| "db"
	| "now"
	| "getUserOrThrow"
	| "getRoleOrThrow"
	| "requirePermission"
	| "assertCanManageRole"
>;

export function createUsersApi(context: UsersApiContext) {
	const {
		db,
		now,
		getUserOrThrow,
		getRoleOrThrow,
		requirePermission,
		assertCanManageRole,
	} = context;

	return {
		async ensureUser(input: unknown): Promise<User> {
			const parsed = parseInput(ensureUserSchema, input);
			const existing = await db.findOne(coreModels.user, {
				authId: parsed.authId,
			});
			const timestamp = now();

			if (!existing) {
				const user: User = {
					...parsed,
					isApproved: false,
					createdAt: timestamp,
					updatedAt: timestamp,
				};
				return db.insert(coreModels.user, user);
			}

			const [updated] = await db.update(
				coreModels.user,
				{ authId: parsed.authId },
				{
					email: parsed.email,
					firstName: parsed.firstName,
					lastName: parsed.lastName,
					profilePhotoUrl: parsed.profilePhotoUrl,
					updatedAt: timestamp,
				},
			);
			return updated ?? { ...existing, ...parsed, updatedAt: timestamp };
		},

		async getUser(authId: AuthId): Promise<User | null> {
			return db.findOne(coreModels.user, { authId });
		},

		async listUsers(input?: { actorAuthId?: AuthId }): Promise<User[]> {
			if (input?.actorAuthId)
				await requirePermission(
					input.actorAuthId,
					CorePermission.UsersView,
				);
			return db.findMany(coreModels.user, {
				orderBy: { field: "createdAt", direction: "desc" },
			});
		},

		async claimHackTag(input: unknown): Promise<User> {
			const parsed = parseInput(claimHackTagSchema, input);
			await getUserOrThrow(parsed.authId);
			const existing = await db.findOne(coreModels.user, {
				hackTag: parsed.hackTag,
			});
			if (existing && existing.authId !== parsed.authId) {
				throw new HackKitError(
					"CONFLICT",
					"HackTag is already claimed.",
				);
			}
			const [updated] = await db.update(
				coreModels.user,
				{ authId: parsed.authId },
				{
					hackTag: parsed.hackTag,
					updatedAt: now(),
				},
			);
			if (!updated)
				throw new HackKitError("NOT_FOUND", "User not found.");
			return updated;
		},

		async approveUser(input: unknown): Promise<User> {
			const parsed = parseInput(approveUserSchema, input);
			const principal = await requirePermission(
				parsed.actorAuthId,
				CorePermission.UsersApprove,
			);
			const target = await getUserOrThrow(parsed.targetAuthId);
			if (target.roleId)
				assertCanManageRole(
					principal,
					await getRoleOrThrow(target.roleId),
				);
			const [updated] = await db.update(
				coreModels.user,
				{ authId: parsed.targetAuthId },
				{
					isApproved: parsed.approved,
					updatedAt: now(),
				},
			);
			if (!updated)
				throw new HackKitError("NOT_FOUND", "User not found.");
			return updated;
		},

		async banUser(input: unknown): Promise<UserBan> {
			const parsed = parseInput(banUserSchema, input);
			const principal = await requirePermission(
				parsed.actorAuthId,
				CorePermission.UsersBan,
			);
			const target = await getUserOrThrow(parsed.targetAuthId);
			if (target.roleId)
				assertCanManageRole(
					principal,
					await getRoleOrThrow(target.roleId),
				);
			const existing = await db.findOne(coreModels.userBan, {
				authId: parsed.targetAuthId,
			});
			if (existing) return existing;
			return db.insert(coreModels.userBan, {
				authId: parsed.targetAuthId,
				reason: parsed.reason,
				bannedByAuthId: parsed.actorAuthId,
				createdAt: now(),
			});
		},

		async unbanUser(input: unknown): Promise<void> {
			const parsed = parseInput(unbanUserSchema, input);
			const principal = await requirePermission(
				parsed.actorAuthId,
				CorePermission.UsersBan,
			);
			const target = await getUserOrThrow(parsed.targetAuthId);
			if (target.roleId)
				assertCanManageRole(
					principal,
					await getRoleOrThrow(target.roleId),
				);
			await db.delete(coreModels.userBan, {
				authId: parsed.targetAuthId,
			});
		},

		async checkIn(input: unknown): Promise<User> {
			const parsed = parseInput(checkInUserSchema, input);
			await requirePermission(
				parsed.actorAuthId,
				CorePermission.UsersCheckIn,
			);
			const target = await getUserOrThrow(parsed.targetAuthId);
			if (target.checkedInAt) {
				throw new HackKitError(
					"INVALID_OPERATION",
					"User is already checked in.",
				);
			}
			const timestamp = now();
			const [updated] = await db.update(
				coreModels.user,
				{ authId: parsed.targetAuthId },
				{
					checkedInAt: timestamp,
					updatedAt: timestamp,
				},
			);
			if (!updated)
				throw new HackKitError("NOT_FOUND", "User not found.");
			return updated;
		},

		async clearCheckIn(input: unknown): Promise<User> {
			const parsed = parseInput(clearCheckInUserSchema, input);
			await requirePermission(
				parsed.actorAuthId,
				CorePermission.UsersCheckIn,
			);
			await getUserOrThrow(parsed.targetAuthId);
			const timestamp = now();
			const [updated] = await db.update(
				coreModels.user,
				{ authId: parsed.targetAuthId },
				{
					checkedInAt: null as unknown as Date,
					updatedAt: timestamp,
				},
			);
			if (!updated)
				throw new HackKitError("NOT_FOUND", "User not found.");
			return updated;
		},
	};
}
