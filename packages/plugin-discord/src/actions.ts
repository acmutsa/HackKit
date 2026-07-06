import type { HackkitRuntime } from "@hackkit/next";
import { actionFailure, actionSuccess } from "@hackkit/next";
import type { DiscordApi } from "./api";

export type ConfirmDiscordVerificationInput = {
	code: string;
};

export function createDiscordActions(runtime: HackkitRuntime) {
	const discord = runtime.hackkit.plugins.discord as unknown as DiscordApi;

	return {
		async confirmDiscordVerification(values: ConfirmDiscordVerificationInput) {
			try {
				const authId = await runtime.getAuthId();
				const member = await discord.confirmVerification({
					authId,
					code: values.code,
				});
				return actionSuccess(member);
			} catch (error) {
				return actionFailure(error, "Could not link Discord account.");
			}
		},

		async syncDiscordMemberRoles() {
			try {
				const authId = await runtime.getAuthId();
				const attempt = await discord.syncMemberRoles({ authId });
				return actionSuccess(attempt);
			} catch (error) {
				return actionFailure(error, "Could not sync Discord roles.");
			}
		},
	};
}

export type DiscordActions = ReturnType<typeof createDiscordActions>;
