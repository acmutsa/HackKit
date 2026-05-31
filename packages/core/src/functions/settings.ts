import type { HackKitLogger } from "../adapters/logger";
import type { DatabaseAdapter } from "../database";
import { HackKitError } from "../errors";
import { coreModels } from "../models";
import { CorePermission } from "../permissions";
import type {
	CoreSettingValueMap,
	HackathonSettingDefinition,
	ResolvedHackathonSetting,
	SettingKey,
	SettingValue,
} from "../settings";
import { validateSettingValue } from "../settings";
import type { AuthId, PermissionKey } from "../types";

type SettingsApiContext = {
	db: DatabaseAdapter;
	now: () => Date;
	logger: HackKitLogger;
	settings: readonly HackathonSettingDefinition[];
	requirePermission: (
		actorAuthId: AuthId,
		permission: PermissionKey,
	) => Promise<unknown>;
};

type SettingRow = typeof coreModels.setting extends infer TModel
	? TModel extends import("../database").Model
		? import("../database").InferSelect<TModel>
		: never
	: never;

export type SetHackathonSettingInput = {
	actorAuthId: AuthId;
	key: SettingKey;
	value: unknown;
};

export type SetManyHackathonSettingsInput = {
	actorAuthId: AuthId;
	values: readonly { key: SettingKey; value: unknown }[];
};

export type ResetHackathonSettingInput = {
	actorAuthId: AuthId;
	key: SettingKey;
};

export type ResetManyHackathonSettingsInput = {
	actorAuthId: AuthId;
	keys: readonly SettingKey[];
};

function createDefinitionMap(definitions: readonly HackathonSettingDefinition[]) {
	return new Map(definitions.map((definition) => [definition.key, definition]));
}

function getDefinition(
	definitions: Map<SettingKey, HackathonSettingDefinition>,
	key: SettingKey,
): HackathonSettingDefinition {
	const definition = definitions.get(key);
	if (!definition) {
		throw new HackKitError("NOT_FOUND", `Hackathon setting '${key}' is not registered.`);
	}
	return definition;
}

function resolveSetting(
	definition: HackathonSettingDefinition,
	row: SettingRow | null,
): ResolvedHackathonSetting {
	if (!row) {
		return {
			...definition,
			value: definition.defaultValue,
			isDefault: true,
		} as ResolvedHackathonSetting;
	}
	return {
		...definition,
		value: validateSettingValue(definition, row.value),
		isDefault: false,
		createdAt: row.createdAt,
		createdByAuthId: row.createdByAuthId,
		updatedAt: row.updatedAt,
		updatedByAuthId: row.updatedByAuthId,
	} as ResolvedHackathonSetting;
}

export function createSettingsApi(context: SettingsApiContext) {
	const definitions = createDefinitionMap(context.settings);

	async function requireManage(actorAuthId: AuthId) {
		await context.requirePermission(actorAuthId, CorePermission.SettingsManage);
	}

	async function getRow(key: SettingKey): Promise<SettingRow | null> {
		return context.db.findOne(coreModels.setting, { key });
	}

	async function getValue(key: SettingKey): Promise<SettingValue> {
		const definition = getDefinition(definitions, key);
		return resolveSetting(definition, await getRow(key)).value;
	}

	async function writeSetting(
		actorAuthId: AuthId,
		key: SettingKey,
		value: SettingValue,
	): Promise<void> {
		const timestamp = context.now();
		const existing = await getRow(key);
		if (existing) {
			await context.db.update(
				coreModels.setting,
				{ key },
				{ value, updatedAt: timestamp, updatedByAuthId: actorAuthId },
			);
		} else {
			await context.db.insert(coreModels.setting, {
				key,
				value,
				createdAt: timestamp,
				createdByAuthId: actorAuthId,
				updatedAt: timestamp,
				updatedByAuthId: actorAuthId,
			});
		}
		context.logger.log("info", "hackathon setting changed", {
			action: "settings.set",
			actorAuthId,
			settingKey: key,
			outcome: "success",
		});
	}

	async function resetSetting(actorAuthId: AuthId, key: SettingKey): Promise<void> {
		await context.db.delete(coreModels.setting, { key });
		context.logger.log("info", "hackathon setting reset", {
			action: "settings.reset",
			actorAuthId,
			settingKey: key,
			outcome: "success",
		});
	}

	return {
		getValue: getValue as {
			<TKey extends keyof CoreSettingValueMap>(key: TKey): Promise<CoreSettingValueMap[TKey]>;
			(key: SettingKey): Promise<SettingValue>;
		},

		async get(input: { actorAuthId: AuthId; key: SettingKey }): Promise<ResolvedHackathonSetting> {
			await requireManage(input.actorAuthId);
			const definition = getDefinition(definitions, input.key);
			return resolveSetting(definition, await getRow(input.key));
		},

		async list(input: { actorAuthId: AuthId }): Promise<ResolvedHackathonSetting[]> {
			await requireManage(input.actorAuthId);
			const rows = new Map(
				(await context.db.findMany(coreModels.setting)).map((row) => [row.key, row]),
			);
			return context.settings.map((definition) =>
				resolveSetting(definition, rows.get(definition.key) ?? null),
			);
		},

		async set(input: SetHackathonSettingInput): Promise<ResolvedHackathonSetting> {
			const [setting] = await this.setMany({
				actorAuthId: input.actorAuthId,
				values: [{ key: input.key, value: input.value }],
			});
			return setting;
		},

		async setMany(input: SetManyHackathonSettingsInput): Promise<ResolvedHackathonSetting[]> {
			await requireManage(input.actorAuthId);
			const parsed = input.values.map(({ key, value }) => {
				const definition = getDefinition(definitions, key);
				return { key, definition, value: validateSettingValue(definition, value) };
			});
			for (const update of parsed) {
				await writeSetting(input.actorAuthId, update.key, update.value);
			}
			return Promise.all(
				parsed.map(async ({ key, definition }) =>
					resolveSetting(definition, await getRow(key)),
				),
			);
		},

		async reset(input: ResetHackathonSettingInput): Promise<ResolvedHackathonSetting> {
			const [setting] = await this.resetMany({
				actorAuthId: input.actorAuthId,
				keys: [input.key],
			});
			return setting;
		},

		async resetMany(input: ResetManyHackathonSettingsInput): Promise<ResolvedHackathonSetting[]> {
			await requireManage(input.actorAuthId);
			const definitionsToReset = input.keys.map((key) => getDefinition(definitions, key));
			for (const definition of definitionsToReset) {
				await resetSetting(input.actorAuthId, definition.key);
			}
			return definitionsToReset.map((definition) => resolveSetting(definition, null));
		},
	};
}
