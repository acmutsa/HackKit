import type { HackKit, PermissionKey, SettingKey, SettingValue } from "@hackkit/core";
import { CoreSetting, HackKitError } from "@hackkit/core";
import type { AccessPrincipal } from "@hackkit/core";
import { notFound, redirect } from "next/navigation";

export type PageGuardOptions = {
	onForbidden?: "notFound" | "redirect" | ((error: HackKitError) => never);
	redirectTo?: string;
	getSettingValue?: (key: SettingKey) => Promise<SettingValue>;
};

export function createPageGuards(
	hackkit: HackKit,
	getAuthId: () => Promise<string>,
	options: PageGuardOptions = {},
) {
	const onForbidden = options.onForbidden ?? "notFound";
	const redirectTo = options.redirectTo ?? "/dashboard";

	function handleForbidden(error: unknown): never {
		if (error instanceof HackKitError && error.code === "FORBIDDEN") {
			if (onForbidden === "notFound") notFound();
			if (onForbidden === "redirect") redirect(redirectTo);
			if (typeof onForbidden === "function") onForbidden(error);
		}
		throw error;
	}

	return {
		async requirePermission(
			permission: PermissionKey,
		): Promise<AccessPrincipal> {
			try {
				const authId = await getAuthId();
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
			const registrationOpen = options.getSettingValue
				? await options.getSettingValue(CoreSetting.RegistrationOpen)
				: await hackkit.settings.getValue(CoreSetting.RegistrationOpen);
			if (registrationOpen) return;
			handleForbidden(new HackKitError("FORBIDDEN", "Hacker registration is closed."));
		},

		async getOptionalPermission(
			permission: PermissionKey,
		): Promise<AccessPrincipal | null> {
			const authId = await getAuthId();
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
