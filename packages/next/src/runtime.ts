import {
	createDrizzleDatabaseAdapter,
	createHackkit,
	type AuthAdapter,
	type HackKit,
	type HackKitPlugin,
	type SettingKey,
	type SettingValue,
	type User,
} from "@hackkit/core";
import { resolveHackkitConfig, type HackkitConfig } from "@hackkit/config";
import type { EventTypesInput, UserDataOptionsInput } from "@hackkit/core";
import type { GroupsInput } from "@hackkit/core";
import type { HackKitLoggerOptions, PermissionKey } from "@hackkit/core";
import type { HackKitUIActions } from "@hackkit/ui";
import { redirect } from "next/navigation";
import { createHackkitApi, type CreateHackkitApiOptions } from "./api";
import { createHackKitMutations } from "./mutations";
import { createPageGuards, type PageGuards } from "./page-guards";

export type CreateHackkitRuntimeOptions = {
	database: unknown;
	auth: AuthAdapter;
	plugins?: readonly HackKitPlugin[];
	userDataOptions?: UserDataOptionsInput;
	eventTypes?: EventTypesInput;
	groups?: GroupsInput;
	logger?: HackKitLoggerOptions;
	defaultCompetitorRoleId?: string;
	seedRoles?: readonly {
		id: string;
		name: string;
		position: number;
		permissions: PermissionKey[];
		color?: string;
	}[];
	/**
	 * App-specific work after the runtime resolves the current user.
	 * Runs for both `runtime.getCurrentUser` and the runtime-owned page guards.
	 */
	afterCurrentUser?: (user: User, hackkit: HackKit) => Promise<void>;
	/**
	 * Resolves a cookie-authenticated Better Auth session from the headers of
	 * the API request. This is deliberately separate from the ambient
	 * `AuthAdapter.getSession()` used by Server Components and page guards.
	 */
	resolveSession: CreateHackkitApiOptions["resolveSession"];
	allowedApiOrigins?: readonly string[];
};

export type CreateHackkitRuntimeFromConfigOptions = {
	config: HackkitConfig;
	database: unknown;
	auth: AuthAdapter;
	afterCurrentUser?: CreateHackkitRuntimeOptions["afterCurrentUser"];
	resolveSession: CreateHackkitRuntimeOptions["resolveSession"];
	allowedApiOrigins?: readonly string[];
};

export type HackkitRuntime = {
	hackkit: HackKit;
	mutations: HackKitUIActions;
	api: ReturnType<typeof createHackkitApi>;
	pageGuards: PageGuards;
	getAuthId: () => Promise<string>;
	getCurrentUser: () => Promise<User>;
	getSettingValue: (key: SettingKey) => Promise<SettingValue>;
	invalidateSettingsCache: () => void;
};

export async function createHackkitRuntime(
	options: CreateHackkitRuntimeOptions,
): Promise<HackkitRuntime> {
	const hackkit = createHackkit({
		database: createDrizzleDatabaseAdapter(options.database as any),
		plugins: options.plugins,
		userDataOptions: options.userDataOptions,
		eventTypes: options.eventTypes,
		groups: options.groups,
		logger: options.logger,
		defaultCompetitorRoleId: options.defaultCompetitorRoleId,
		seedRoles: options.seedRoles,
	});
	await hackkit.init();

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
		const user = await hackkit.users.ensureUser({
			authId: options.auth.toAuthId(session),
			...identity,
		});
		if (options.afterCurrentUser) {
			await options.afterCurrentUser(user, hackkit);
		}
		return user;
	}

	const settingsCache = new Map<SettingKey, Promise<SettingValue>>();
	function invalidateSettingsCache() {
		settingsCache.clear();
	}
	function getSettingValue(key: SettingKey): Promise<SettingValue> {
		const cached = settingsCache.get(key);
		if (cached) return cached;
		const value = hackkit.settings.getValue(key);
		settingsCache.set(key, value);
		return value;
	}

	const mutations = createHackKitMutations({
		hackkit,
		getAuthId,
		getSettingValue,
		invalidateSettingsCache,
	});

	const pageGuards = createPageGuards(hackkit, getAuthId, {
		getCurrentUser,
		getSettingValue,
	});
	const api = createHackkitApi({
		hackkit,
		auth: options.auth,
		resolveSession: options.resolveSession,
		getSettingValue,
		invalidateSettingsCache,
		afterCurrentUser: options.afterCurrentUser,
		allowedOrigins: options.allowedApiOrigins,
	});

	return {
		hackkit,
		mutations,
		api,
		pageGuards,
		getAuthId,
		getCurrentUser,
		getSettingValue,
		invalidateSettingsCache,
	};
}

export function createHackkitRuntimeFromConfig(
	options: CreateHackkitRuntimeFromConfigOptions,
): Promise<HackkitRuntime> {
	const config = resolveHackkitConfig(options.config);
	return createHackkitRuntime({
		database: options.database,
		auth: options.auth,
		plugins: config.plugins,
		userDataOptions: config.userDataOptions,
		eventTypes: config.eventTypes,
		groups: config.groups,
		logger: config.logger,
		defaultCompetitorRoleId: config.defaultCompetitorRoleId,
		seedRoles: config.seedRoles,
		afterCurrentUser: options.afterCurrentUser,
		resolveSession: options.resolveSession,
		allowedApiOrigins: options.allowedApiOrigins,
	});
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
