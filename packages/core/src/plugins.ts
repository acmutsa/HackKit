import type {
	DatabaseAdapter,
	PersistentModel,
	StorageRegistry,
} from "./database";
import { HackKitError } from "./errors";
import { coreModels } from "./models";
import { CorePermission } from "./permissions";
import type { PermissionKey } from "./types";

type ModelMap = Record<string, PersistentModel>;
type PermissionMap = Record<string, PermissionKey>;

export type HackKitPluginContext = {
	database: DatabaseAdapter;
	registry: HackKitRegistry;
};

export type HackKitPlugin<
	TId extends string = string,
	TApi extends object = Record<string, never>,
> = {
	id: TId;
	models?: ModelMap;
	permissions?: PermissionMap;
	setup?: (context: HackKitPluginContext) => TApi;
};

export type PluginApiMap<TPlugins extends readonly HackKitPlugin[]> = {
	[Plugin in TPlugins[number] as Plugin["id"]]: Plugin extends HackKitPlugin<
		Plugin["id"],
		infer TApi
	>
		? TApi
		: Record<string, never>;
};

export type HackKitRegistry = {
	models: Record<string, PersistentModel>;
	permissions: Record<string, PermissionKey>;
	plugins: Record<string, HackKitPlugin>;
	storage: StorageRegistry;
};

export function createPluginRegistry(
	plugins: readonly HackKitPlugin[] = [],
): HackKitRegistry {
	const registry: HackKitRegistry = {
		models: { ...coreModels },
		permissions: { ...CorePermission },
		plugins: {},
		storage: { models: { ...coreModels } },
	};

	for (const plugin of plugins) {
		if (registry.plugins[plugin.id]) {
			throw new HackKitError(
				"CONFLICT",
				`HackKit plugin '${plugin.id}' is already registered.`,
			);
		}

		registry.plugins[plugin.id] = plugin;

		for (const [name, pluginModel] of Object.entries(plugin.models ?? {})) {
			const modelKey = pluginModel.key;
			if (!modelKey.startsWith(`${plugin.id}.`)) {
				throw new HackKitError(
					"INVALID_OPERATION",
					`Plugin model '${name}' must use the '${plugin.id}.' namespace.`,
				);
			}
			if (registry.models[modelKey]) {
				throw new HackKitError(
					"CONFLICT",
					`HackKit model '${modelKey}' is already registered.`,
				);
			}
			registry.models[modelKey] = pluginModel;
			registry.storage.models[modelKey] = pluginModel;
		}

		for (const [name, permission] of Object.entries(
			plugin.permissions ?? {},
		)) {
			if (!permission.startsWith(`${plugin.id}.`)) {
				throw new HackKitError(
					"INVALID_OPERATION",
					`Plugin permission '${name}' must use the '${plugin.id}.' namespace.`,
				);
			}
			if (Object.values(registry.permissions).includes(permission)) {
				throw new HackKitError(
					"CONFLICT",
					`HackKit permission '${permission}' is already registered.`,
				);
			}
			registry.permissions[`${plugin.id}.${name}`] = permission;
		}
	}

	return registry;
}

export function setupPluginApis<TPlugins extends readonly HackKitPlugin[]>(
	plugins: TPlugins,
	context: HackKitPluginContext,
): PluginApiMap<TPlugins> {
	const apis: Record<string, object> = {};
	for (const plugin of plugins) {
		apis[plugin.id] = plugin.setup?.(context) ?? {};
	}
	return apis as PluginApiMap<TPlugins>;
}
