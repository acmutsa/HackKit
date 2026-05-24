import {
	createDrizzleDatabaseAdapter,
	createHackkit,
	type AuthAdapter,
	type HackKit,
	type HackKitPlugin,
	type User,
} from "@hackkit/core";
import type { EventTypesInput, UserDataOptionsInput } from "@hackkit/core";
import type { HackKitUIActions } from "@hackkit/ui";
import { redirect } from "next/navigation";
import { createHackKitMutations } from "./mutations.js";
import { createPageGuards, type PageGuards } from "./page-guards.js";

export type CreateHackkitRuntimeOptions = {
	database: unknown;
	auth: AuthAdapter;
	plugins?: readonly HackKitPlugin[];
	userDataOptions?: UserDataOptionsInput;
	eventTypes?: EventTypesInput;
	eventPassQrTtlMs: number;
};

export type HackkitRuntime = {
	hackkit: HackKit;
	mutations: HackKitUIActions;
	pageGuards: PageGuards;
	getAuthId: () => Promise<string>;
	getCurrentUser: () => Promise<User>;
};

export async function createHackkitRuntime(
	options: CreateHackkitRuntimeOptions,
): Promise<HackkitRuntime> {
	const hackkit = createHackkit({
		database: createDrizzleDatabaseAdapter(options.database as any),
		plugins: options.plugins,
		userDataOptions: options.userDataOptions,
		eventTypes: options.eventTypes,
	});

	async function requireSession() {
		const session = await options.auth.getSession();
		if (!session) redirect("/sign-in");
		return session;
	}

	async function getAuthId(): Promise<string> {
		return options.auth.toAuthId(await requireSession());
	}

	async function getCurrentUser(): Promise<User> {
		const session = await requireSession();
		const identity = options.auth.getIdentity(session);
		return hackkit.users.ensureUser({
			authId: options.auth.toAuthId(session),
			...identity,
		});
	}

	const mutations = createHackKitMutations({
		hackkit,
		getAuthId,
		eventPassQrTtlMs: options.eventPassQrTtlMs,
	});

	const pageGuards = createPageGuards(hackkit, getAuthId);

	return {
		hackkit,
		mutations,
		pageGuards,
		getAuthId,
		getCurrentUser,
	};
}

let runtimePromise: Promise<HackkitRuntime> | null = null;

export function setHackkitRuntime(promise: Promise<HackkitRuntime>): void {
	runtimePromise = promise;
}

export async function getHackkitRuntime(): Promise<HackkitRuntime> {
	if (!runtimePromise) {
		throw new Error(
			"HackKit runtime is not initialized. Call setHackkitRuntime() from your app runtime module.",
		);
	}
	return runtimePromise;
}
