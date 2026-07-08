import "server-only";

import { betterAuthAdapter } from "@hackkit/auth-better-auth";
import {
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
	afterCurrentUser: async (user, hackkit) => {
		await provisionOwnerFromAllowlist(hackkit, user);
	},
});

setHackkitRuntime(runtimePromise);

export async function getRuntime() {
	return runtimePromise;
}

export async function getCurrentUser() {
	return (await getRuntime()).getCurrentUser();
}

export async function getHackkit() {
	return (await getRuntime()).hackkit;
}

export async function getPageGuards() {
	return (await getRuntime()).pageGuards;
}
