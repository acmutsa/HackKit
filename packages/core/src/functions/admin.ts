import type { HackkitRuntimeContext } from "../hackkit-context";
import { coreModels } from "../models";
import { CorePermission } from "../permissions";
import type {
	AdminOverview,
	AdminUserExportRow,
	AdminUserRecord,
	AuthId,
	Role,
} from "../types";

export type AdminApiContext = Pick<
	HackkitRuntimeContext,
	"db" | "requirePermission" | "getUserOrThrow"
>;

function toDateKey(date: Date): string {
	return date.toISOString().slice(0, 10);
}

function toIsoString(date?: Date): string {
	return date ? date.toISOString() : "";
}

export function createAdminApi(context: AdminApiContext) {
	const { db, requirePermission, getUserOrThrow } = context;

	async function listRolesForAdmin(actorAuthId: AuthId): Promise<Role[]> {
		await requirePermission(actorAuthId, CorePermission.RolesView);
		return db.findMany(coreModels.role, {
			orderBy: { field: "position", direction: "asc" },
		});
	}

	async function hydrateUser(user: AdminUserRecord["user"]): Promise<AdminUserRecord> {
		const [userData, hacker, rsvp, role, ban] = await Promise.all([
			db.findOne(coreModels.userData, { authId: user.authId }),
			db.findOne(coreModels.hacker, { authId: user.authId }),
			db.findOne(coreModels.rsvp, { authId: user.authId }),
			user.roleId ? db.findOne(coreModels.role, { id: user.roleId }) : null,
			db.findOne(coreModels.userBan, { authId: user.authId }),
		]);

		return { user, userData, hacker, rsvp, role, ban };
	}

	async function listUsers(input: { actorAuthId: AuthId }): Promise<AdminUserRecord[]> {
		await requirePermission(input.actorAuthId, CorePermission.UsersView);
		const users = await db.findMany(coreModels.user, {
			orderBy: { field: "createdAt", direction: "desc" },
		});
		return Promise.all(users.map(hydrateUser));
	}

	async function getUser(input: {
		actorAuthId: AuthId;
		targetAuthId: AuthId;
	}): Promise<AdminUserRecord | null> {
		await requirePermission(input.actorAuthId, CorePermission.UsersView);
		const user = await db.findOne(coreModels.user, { authId: input.targetAuthId });
		return user ? hydrateUser(user) : null;
	}

	async function getUserByHackTag(input: {
		actorAuthId: AuthId;
		hackTag: string;
	}): Promise<AdminUserRecord | null> {
		await requirePermission(input.actorAuthId, CorePermission.UsersView);
		const user = await db.findOne(coreModels.user, {
			hackTag: input.hackTag.toLowerCase(),
		});
		return user ? hydrateUser(user) : null;
	}

	async function getOverview(input: { actorAuthId: AuthId }): Promise<AdminOverview> {
		await requirePermission(input.actorAuthId, CorePermission.Admin);
		const records = await listUsers({ actorAuthId: input.actorAuthId });
		const today = new Date();
		const recentSignups = Array.from({ length: 7 }, (_, index) => {
			const date = new Date(today);
			date.setUTCDate(today.getUTCDate() - index);
			return { date: toDateKey(date), count: 0 };
		}).reverse();
		const recentCounts = new Map(
			recentSignups.map((item) => [item.date, item]),
		);

		for (const record of records) {
			const bucket = recentCounts.get(toDateKey(record.user.createdAt));
			if (bucket) bucket.count += 1;
		}

		return {
			totalUsers: records.length,
			totalHackers: records.filter((record) => record.hacker).length,
			approvedUsers: records.filter((record) => record.user.isApproved).length,
			pendingApprovalUsers: records.filter(
				(record) => !record.user.isApproved && !record.ban,
			).length,
			bannedUsers: records.filter((record) => record.ban).length,
			checkedInUsers: records.filter((record) => record.user.checkedInAt).length,
			confirmedRsvps: records.filter(
				(record) => record.rsvp?.status === "confirmed",
			).length,
			waitlistedRsvps: records.filter(
				(record) => record.rsvp?.status === "waitlisted",
			).length,
			recentSignups,
			recentUsers: records.slice(0, 10),
		};
	}

	async function exportUsers(input: {
		actorAuthId: AuthId;
	}): Promise<AdminUserExportRow[]> {
		const records = await listUsers({ actorAuthId: input.actorAuthId });
		return records.map(({ user, userData, hacker, rsvp, role, ban }) => ({
			authId: user.authId,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			hackTag: user.hackTag ?? "",
			role: role?.name ?? "",
			isApproved: user.isApproved,
			isBanned: Boolean(ban),
			rsvpStatus: rsvp?.status ?? "",
			rsvpWaitlistPosition: rsvp?.waitlistPosition ?? "",
			banReason: ban?.reason ?? "",
			checkedInAt: toIsoString(user.checkedInAt),
			createdAt: user.createdAt.toISOString(),
			age: userData?.age ?? "",
			gender: userData?.gender ?? "",
			race: userData?.race ?? "",
			ethnicity: userData?.ethnicity ?? "",
			shirtSize: userData?.shirtSize ?? "",
			dietaryRestrictions: userData?.dietaryRestrictions.join("; ") ?? "",
			accommodationNote: userData?.accommodationNote ?? "",
			phoneNumber: userData?.phoneNumber ?? "",
			countryOfResidence: userData?.countryOfResidence ?? "",
			hasAcceptedMLHCodeOfConduct:
				userData?.hasAcceptedMLHCodeOfConduct ?? "",
			hasSharedDataWithMLH: userData?.hasSharedDataWithMLH ?? "",
			isEmailable: userData?.isEmailable ?? "",
			university: hacker?.university ?? "",
			major: hacker?.major ?? "",
			schoolId: hacker?.schoolId ?? "",
			levelOfStudy: hacker?.levelOfStudy ?? "",
			hackathonsAttended: hacker?.hackathonsAttended ?? "",
			softwareExperience: hacker?.softwareExperience ?? "",
			heardFrom: hacker?.heardFrom ?? "",
			githubUrl: hacker?.githubUrl ?? "",
			linkedInUrl: hacker?.linkedInUrl ?? "",
			personalWebsiteUrl: hacker?.personalWebsiteUrl ?? "",
			resumeUrl: hacker?.resumeUrl ?? "",
			group: hacker?.group ?? "",
			registeredAt: toIsoString(hacker?.registeredAt),
		}));
	}

	return {
		getOverview,
		getUser,
		getUserByHackTag,
		listRoles: listRolesForAdmin,
		listUsers,
		exportUsers,
	};
}
