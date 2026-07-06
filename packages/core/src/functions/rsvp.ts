import type { HackkitRuntimeContext } from "../hackkit-context";
import { CoreNotificationKind } from "../notifications";
import { HackKitError, parseInput } from "../errors";
import { withDomainLog } from "../domain-log";
import { coreModels } from "../models";
import { CorePermission } from "../permissions";
import {
	adminCancelRsvpSchema,
	adminPromoteRsvpSchema,
	adminSetRsvpStatusSchema,
	confirmRsvpSchema,
} from "../schemas";
import { CoreSetting } from "../settings";
import type { AuthId, Rsvp } from "../types";

export type RsvpSummary = {
	isOpen: boolean;
	limit: number;
	waitlistEnabled: boolean;
	confirmedCount: number;
	waitlistedCount: number;
	availableSpots: number | null;
};

export type RsvpApiContext = Pick<
	HackkitRuntimeContext,
	| "db"
	| "now"
	| "logger"
	| "getUserOrThrow"
	| "getSettingValue"
	| "requirePermission"
	| "notifications"
>;

function activeRsvps(rsvps: readonly Rsvp[]): Rsvp[] {
	return rsvps.filter((rsvp) => rsvp.status !== "cancelled");
}

function confirmedRsvps(rsvps: readonly Rsvp[]): Rsvp[] {
	return rsvps.filter((rsvp) => rsvp.status === "confirmed");
}

function waitlistedRsvps(rsvps: readonly Rsvp[]): Rsvp[] {
	return rsvps.filter((rsvp) => rsvp.status === "waitlisted");
}

function sortWaitlist(rsvps: readonly Rsvp[]): Rsvp[] {
	return [...waitlistedRsvps(rsvps)].sort((left, right) => {
		const leftPosition = left.waitlistPosition ?? Number.MAX_SAFE_INTEGER;
		const rightPosition = right.waitlistPosition ?? Number.MAX_SAFE_INTEGER;
		if (leftPosition !== rightPosition) return leftPosition - rightPosition;
		return left.createdAt.getTime() - right.createdAt.getTime();
	});
}

const clearNumber = null as unknown as number;
const clearString = null as unknown as string;
const clearDate = null as unknown as Date;

export function createRsvpApi(context: RsvpApiContext) {
	const { db, now, logger, getUserOrThrow, getSettingValue, requirePermission } =
		context;

	async function getSettings() {
		const [isOpen, limit, waitlistEnabled] = await Promise.all([
			getSettingValue(CoreSetting.RsvpOpen),
			getSettingValue(CoreSetting.RsvpLimit),
			getSettingValue(CoreSetting.RsvpWaitlistEnabled),
		]);
		return {
			isOpen: Boolean(isOpen),
			limit: Number(limit),
			waitlistEnabled: Boolean(waitlistEnabled),
		};
	}

	async function listAll(): Promise<Rsvp[]> {
		return db.findMany(coreModels.rsvp, {
			orderBy: { field: "createdAt", direction: "asc" },
		});
	}

	async function nextWaitlistPosition(): Promise<number> {
		const waitlist = sortWaitlist(await listAll());
		return Math.max(0, ...waitlist.map((rsvp) => rsvp.waitlistPosition ?? 0)) + 1;
	}

	async function assertApprovedHacker(authId: AuthId): Promise<void> {
		const user = await getUserOrThrow(authId);
		if (!user.isApproved) {
			throw new HackKitError(
				"INVALID_OPERATION",
				"Only approved hackers can RSVP.",
			);
		}
		const hacker = await db.findOne(coreModels.hacker, { authId });
		if (!hacker) {
			throw new HackKitError(
				"INVALID_OPERATION",
				"Only registered hackers can RSVP.",
			);
		}
	}

	async function queueRsvpIntent(rsvp: Rsvp, promotedByAuthId?: AuthId) {
		if (rsvp.status === "confirmed") {
			const wasPromoted = Boolean(promotedByAuthId);
			await context.notifications.queueIntent({
				kind: wasPromoted
					? CoreNotificationKind.RsvpPromoted
					: CoreNotificationKind.RsvpConfirmed,
				recipientAuthId: rsvp.authId,
				payload: { authId: rsvp.authId },
				idempotencyKey: wasPromoted
					? `rsvp:promoted:${rsvp.authId}:${rsvp.promotedAt?.toISOString() ?? ""}`
					: `rsvp:confirmed:${rsvp.authId}`,
			});
		}
		if (rsvp.status === "waitlisted") {
			await context.notifications.queueIntent({
				kind: CoreNotificationKind.RsvpWaitlisted,
				recipientAuthId: rsvp.authId,
				payload: {
					authId: rsvp.authId,
					position: rsvp.waitlistPosition,
				},
				idempotencyKey: `rsvp:waitlisted:${rsvp.authId}`,
			});
		}
	}

	async function renumberWaitlist(): Promise<void> {
		const waitlist = sortWaitlist(await listAll());
		for (const [index, rsvp] of waitlist.entries()) {
			const position = index + 1;
			if (rsvp.waitlistPosition === position) continue;
			await db.update(
				coreModels.rsvp,
				{ authId: rsvp.authId },
				{ waitlistPosition: position, updatedAt: now() },
			);
		}
	}

	async function writeRsvp(
		authId: AuthId,
		patch: Partial<Rsvp>,
	): Promise<Rsvp> {
		const existing = await db.findOne(coreModels.rsvp, { authId });
		const timestamp = now();
		const value = {
			...patch,
			authId,
			updatedAt: timestamp,
		};
		if (!existing) {
			return db.insert(coreModels.rsvp, {
				status: "confirmed",
				createdAt: timestamp,
				...value,
			});
		}
		const [updated] = await db.update(coreModels.rsvp, { authId }, value);
		if (!updated) throw new HackKitError("NOT_FOUND", "RSVP not found.");
		return updated;
	}

	async function getSummary(): Promise<RsvpSummary> {
		const [{ isOpen, limit, waitlistEnabled }, rsvps] = await Promise.all([
			getSettings(),
			listAll(),
		]);
		const confirmedCount = confirmedRsvps(rsvps).length;
		const waitlistedCount = waitlistedRsvps(rsvps).length;
		return {
			isOpen,
			limit,
			waitlistEnabled,
			confirmedCount,
			waitlistedCount,
			availableSpots: limit === 0 ? null : Math.max(0, limit - confirmedCount),
		};
	}

	return {
		getSummary,

		async getRsvp(authId: AuthId): Promise<Rsvp | null> {
			return db.findOne(coreModels.rsvp, { authId });
		},

		async listRsvps(input?: { actorAuthId?: AuthId }): Promise<Rsvp[]> {
			if (input?.actorAuthId) {
				await requirePermission(input.actorAuthId, CorePermission.UsersView);
			}
			return listAll();
		},

		async confirm(input: unknown): Promise<Rsvp> {
			const parsed = parseInput(confirmRsvpSchema, input);
			return withDomainLog(
				logger,
				"rsvp.confirm",
				{ targetAuthId: parsed.authId },
				async () => {
					await assertApprovedHacker(parsed.authId);
					const settings = await getSettings();
					if (!settings.isOpen) {
						throw new HackKitError("INVALID_OPERATION", "RSVPs are closed.");
					}
					const existing = await db.findOne(coreModels.rsvp, {
						authId: parsed.authId,
					});
					if (existing && existing.status !== "cancelled") return existing;

					const active = activeRsvps(await listAll());
					const confirmedCount = confirmedRsvps(active).length;
					const timestamp = now();
					const hasCapacity =
						settings.limit === 0 || confirmedCount < settings.limit;

					let rsvp: Rsvp;
					if (hasCapacity) {
						rsvp = await writeRsvp(parsed.authId, {
							status: "confirmed",
							waitlistPosition: clearNumber,
							confirmedAt: timestamp,
							waitlistedAt: clearDate,
							cancelledAt: clearDate,
							cancelledByAuthId: clearString,
						});
					} else if (settings.waitlistEnabled) {
						rsvp = await writeRsvp(parsed.authId, {
							status: "waitlisted",
							waitlistPosition: await nextWaitlistPosition(),
							waitlistedAt: timestamp,
							confirmedAt: clearDate,
							cancelledAt: clearDate,
							cancelledByAuthId: clearString,
						});
					} else {
						throw new HackKitError(
							"INVALID_OPERATION",
							"RSVP capacity has been reached.",
						);
					}

					await queueRsvpIntent(rsvp);
					return rsvp;
				},
			);
		},

		async cancel(input: unknown): Promise<Rsvp> {
			const parsed = parseInput(adminCancelRsvpSchema, input);
			return withDomainLog(
				logger,
				"rsvp.cancel",
				{
					actorAuthId: parsed.actorAuthId,
					targetAuthId: parsed.targetAuthId,
				},
				async () => {
					await requirePermission(parsed.actorAuthId, CorePermission.UsersApprove);
					await getUserOrThrow(parsed.targetAuthId);
					const timestamp = now();
					const rsvp = await writeRsvp(parsed.targetAuthId, {
						status: "cancelled",
						waitlistPosition: clearNumber,
						cancelledAt: timestamp,
						cancelledByAuthId: parsed.actorAuthId,
					});
					await renumberWaitlist();
					return rsvp;
				},
			);
		},

		async setStatus(input: unknown): Promise<Rsvp> {
			const parsed = parseInput(adminSetRsvpStatusSchema, input);
			return withDomainLog(
				logger,
				"rsvp.setStatus",
				{
					actorAuthId: parsed.actorAuthId,
					targetAuthId: parsed.targetAuthId,
				},
				async () => {
					await requirePermission(parsed.actorAuthId, CorePermission.UsersApprove);
					await assertApprovedHacker(parsed.targetAuthId);
					const timestamp = now();
					const patch: Partial<Rsvp> =
						parsed.status === "confirmed"
							? {
									status: "confirmed",
									waitlistPosition: clearNumber,
									confirmedAt: timestamp,
									cancelledAt: clearDate,
									cancelledByAuthId: clearString,
								}
							: parsed.status === "waitlisted"
								? {
										status: "waitlisted",
										waitlistPosition: await nextWaitlistPosition(),
										waitlistedAt: timestamp,
										cancelledAt: clearDate,
										cancelledByAuthId: clearString,
									}
								: {
										status: "cancelled",
										waitlistPosition: clearNumber,
										cancelledAt: timestamp,
										cancelledByAuthId: parsed.actorAuthId,
									};
					const rsvp = await writeRsvp(parsed.targetAuthId, patch);
					await renumberWaitlist();
					await queueRsvpIntent(rsvp);
					return rsvp;
				},
			);
		},

		async promote(input: unknown): Promise<Rsvp> {
			const parsed = parseInput(adminPromoteRsvpSchema, input);
			return withDomainLog(
				logger,
				"rsvp.promote",
				{ actorAuthId: parsed.actorAuthId, targetAuthId: parsed.targetAuthId },
				async () => {
					await requirePermission(parsed.actorAuthId, CorePermission.UsersApprove);
					const summary = await getSummary();
					if (summary.limit !== 0 && summary.confirmedCount >= summary.limit) {
						throw new HackKitError(
							"INVALID_OPERATION",
							"RSVP capacity has been reached.",
						);
					}
					const target = parsed.targetAuthId
						? await db.findOne(coreModels.rsvp, {
								authId: parsed.targetAuthId,
								status: "waitlisted",
							})
						: sortWaitlist(await listAll())[0];
					if (!target) {
						throw new HackKitError("NOT_FOUND", "Waitlisted RSVP not found.");
					}
					await assertApprovedHacker(target.authId);
					const timestamp = now();
					const rsvp = await writeRsvp(target.authId, {
						status: "confirmed",
						waitlistPosition: clearNumber,
						confirmedAt: timestamp,
						promotedAt: timestamp,
						promotedByAuthId: parsed.actorAuthId,
					});
					await renumberWaitlist();
					await queueRsvpIntent(rsvp, parsed.actorAuthId);
					return rsvp;
				},
			);
		},
	};
}

export type RsvpApi = ReturnType<typeof createRsvpApi>;
