import "server-only";

import { betterAuthAdapter } from "@hackkit/auth-better-auth";
import { createHackkitRuntime, setHackkitRuntime } from "@hackkit/next";
import { DEFAULT_EVENT_PASS_QR_TTL_MS } from "@hackkit/ui";
import hackkitConfig from "../hackkit.config";
import { auth } from "./auth";
import { db } from "./db";

const runtimePromise = createHackkitRuntime({
	database: db,
	auth: betterAuthAdapter({ auth }),
	plugins: hackkitConfig.plugins,
	userDataOptions: hackkitConfig.userDataOptions,
	eventTypes: hackkitConfig.eventTypes,
	eventPassQrTtlMs: DEFAULT_EVENT_PASS_QR_TTL_MS,
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
