import "server-only";

import { betterAuthAdapter } from "@hackkit/auth-better-auth";
import {
	createPageGuards,
	createHackkitRuntimeFromConfig,
	setHackkitRuntime,
} from "@hackkit/next";
import { auth } from "./auth";
import { db } from "./db";
import { getAppLogger } from "./logger";
import { appConfig } from "./app-config";
import { provisionOwnerFromAllowlist } from "./owner-provisioning";

const runtimePromise = createHackkitRuntimeFromConfig({
	config: appConfig,
	database: db,
	auth: betterAuthAdapter({ auth, logger: getAppLogger() }),
});

setHackkitRuntime(runtimePromise);

export async function getRuntime() {
	return runtimePromise;
}

export async function getCurrentUser() {
	const runtime = await getRuntime();
	const user = await runtime.getCurrentUser();
	await provisionOwnerFromAllowlist(runtime.hackkit, user);
	return user;
}

export async function getHackkit() {
	return (await getRuntime()).hackkit;
}

export async function getPageGuards() {
	const runtime = await getRuntime();
	return createPageGuards(runtime.hackkit, runtime.getAuthId, {
		getCurrentUser,
		getSettingValue: runtime.getSettingValue,
	});
}
