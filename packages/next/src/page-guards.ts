import type {
	Hacker,
	HackKit,
	PermissionKey,
	SettingKey,
	SettingValue,
	User,
	UserBan,
	UserData,
} from "@hackkit/core";
import { CoreSetting, HackKitError } from "@hackkit/core";
import type { AccessPrincipal } from "@hackkit/core";
import { notFound, redirect } from "next/navigation";

export type PageGuardOptions = {
	onForbidden?: "notFound" | "redirect" | ((error: HackKitError) => never);
	redirectTo?: string;
	approvalRedirectTo?: string;
	onboardingRedirectTo?: string;
	registrationClosedRedirectTo?: string;
	suspendedRedirectTo?: string;
	getCurrentUser?: () => Promise<User>;
	getSettingValue?: (key: SettingKey) => Promise<SettingValue>;
};

export type CompetitorOnboardingState = {
	user: User;
	userData: UserData;
	hacker: Hacker;
};

export function createPageGuards(
	hackkit: HackKit,
	getAuthId: () => Promise<string>,
	options: PageGuardOptions = {},
) {
	const onForbidden = options.onForbidden ?? "notFound";
	const redirectTo = options.redirectTo ?? "/dashboard";
	const approvalRedirectTo = options.approvalRedirectTo ?? "/i/approval";
	const onboardingRedirectTo = options.onboardingRedirectTo ?? "/onboarding/hacktag";
	const registrationClosedRedirectTo =
		options.registrationClosedRedirectTo ?? "/registration-closed";
	const suspendedRedirectTo = options.suspendedRedirectTo ?? "/suspended";

	function handleForbidden(error: unknown): never {
		if (error instanceof HackKitError && error.code === "FORBIDDEN") {
			if (onForbidden === "notFound") notFound();
			if (onForbidden === "redirect") redirect(redirectTo);
			if (typeof onForbidden === "function") onForbidden(error);
		}
		throw error;
	}

	async function getCurrentUser(): Promise<User> {
		if (options.getCurrentUser) return options.getCurrentUser();
		const authId = await getAuthId();
		const user = await hackkit.users.getUser(authId);
		if (user) return user;
		handleForbidden(new HackKitError("FORBIDDEN", "User is required."));
	}

	async function getSettingValue(key: SettingKey): Promise<SettingValue> {
		return options.getSettingValue
			? options.getSettingValue(key)
			: hackkit.settings.getValue(key);
	}

	async function requireNotBannedForAuthId(authId: string): Promise<UserBan | null> {
		const ban = await hackkit.users.getUserBan(authId);
		if (ban) redirect(suspendedRedirectTo);
		return null;
	}

	async function requireNotBanned(): Promise<UserBan | null> {
		return requireNotBannedForAuthId(await getAuthId());
	}

	async function requireApprovedUser(): Promise<User> {
		const user = await getCurrentUser();
		await requireNotBannedForAuthId(user.authId);
		if (!user.isApproved) redirect(approvalRedirectTo);
		return user;
	}

	async function requireCompletedOnboarding(): Promise<CompetitorOnboardingState> {
		const user = await getCurrentUser();
		await requireNotBannedForAuthId(user.authId);

		if (!user.hackTag) redirect(onboardingRedirectTo);

		const [userData, hacker] = await Promise.all([
			hackkit.userData.getUserData(user.authId),
			hackkit.hackers.getHacker(user.authId),
		]);

		if (!userData) redirect("/onboarding/user-data");
		if (!hacker) {
			const registrationOpen = await getSettingValue(CoreSetting.RegistrationOpen);
			if (!registrationOpen) redirect(registrationClosedRedirectTo);
			redirect("/onboarding/hacker");
		}

		return { user, userData, hacker };
	}

	async function requireParticipantAccess(): Promise<CompetitorOnboardingState> {
		const state = await requireCompletedOnboarding();
		if (!state.user.isApproved) redirect(approvalRedirectTo);
		return state;
	}

	async function requireOnboardingAccess(): Promise<User> {
		const user = await getCurrentUser();
		await requireNotBannedForAuthId(user.authId);

		if (!user.hackTag) return user;
		const [userData, hacker] = await Promise.all([
			hackkit.userData.getUserData(user.authId),
			hackkit.hackers.getHacker(user.authId),
		]);

		if (!userData || !hacker) return user;
		if (!user.isApproved) redirect(approvalRedirectTo);
		redirect(redirectTo);
	}

	async function requireApprovalPendingAccess(): Promise<CompetitorOnboardingState> {
		const state = await requireCompletedOnboarding();
		if (state.user.isApproved) redirect(redirectTo);
		return state;
	}

	return {
		async requirePermission(
			permission: PermissionKey,
		): Promise<AccessPrincipal> {
			try {
				const authId = await getAuthId();
				await requireNotBannedForAuthId(authId);
				return await hackkit.accessControl.requirePermission(
					authId,
					permission,
				);
			} catch (error) {
				handleForbidden(error);
			}
		},

		async requireHackerRegistrationOpenForNewHacker(): Promise<void> {
			const authId = await getAuthId();
			const existing = await hackkit.hackers.getHacker(authId);
			if (existing) return;
			const registrationOpen = await getSettingValue(CoreSetting.RegistrationOpen);
			if (registrationOpen) return;
			redirect(registrationClosedRedirectTo);
		},

		requireNotBanned,

		requireApprovedUser,

		requireCompletedOnboarding,

		requireParticipantAccess,

		requireOnboardingAccess,

		requireApprovalPendingAccess,

		async getOptionalPermission(
			permission: PermissionKey,
		): Promise<AccessPrincipal | null> {
			const authId = await getAuthId();
			await requireNotBannedForAuthId(authId);
			const allowed = await hackkit.accessControl.hasPermission(
				authId,
				permission,
			);
			if (!allowed) return null;
			return hackkit.accessControl.getPrincipal(authId);
		},
	};
}

export type PageGuards = ReturnType<typeof createPageGuards>;
