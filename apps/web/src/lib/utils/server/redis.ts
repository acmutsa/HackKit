import { kv } from "@vercel/kv";
import type { NavItemToggleType } from "@/validators/shared/navitemtoggle";

export function includeEnvPrefix(key: string) {
	return `${process.env.HK_ENV}_${key}`;
}

export async function sadd(key: string, value: string): Promise<number> {
	return kv.sadd(includeEnvPrefix(key), value);
}

export async function hset<TData>(
	key: string,
	value: Record<string, TData>,
): Promise<number> {
	return kv.hset(includeEnvPrefix(key), value);
}

export async function set<TData>(
	key: string,
	value: TData,
): Promise<TData | "OK" | null> {
	return kv.set<TData>(includeEnvPrefix(key), value);
}

export async function get<TData>(key: string): Promise<TData | null> {
	return kv.get<TData>(includeEnvPrefix(key));
}

export async function mget<TData>(...keys: string[]): Promise<TData[]> {
	return kv.mget<TData[]>(keys.map(includeEnvPrefix));
}

export async function getAllNavItems() {
	const keys = await kv.smembers<string[]>(
		includeEnvPrefix("config:navitemslist"),
	);
	if (!keys || keys.length < 1) {
		return {
			keys: [],
			items: [],
		};
	}
	const pipe = kv.pipeline();
	for (const key of keys) {
		pipe.hgetall(includeEnvPrefix(`config:navitems:${key}`));
	}
	const items = await pipe.exec<NavItemToggleType[]>();
	return {
		keys,
		items,
	};
}

export function removeNavItem(name: string) {
	const pipe = kv.pipeline();
	pipe.srem(
		includeEnvPrefix("config:navitemslist"),
		encodeURIComponent(name),
	);
	pipe.del(includeEnvPrefix(`config:navitems:${encodeURIComponent(name)}`));
	return pipe.exec();
}

export function parseRedisBoolean(
	value: string | boolean | undefined | null,
	defaultValue?: boolean,
) {
	if (typeof value === "string") {
		if (value === "true") return true;
		if (value === "false") return false;
	}
	if (typeof value === "boolean") return value;
	return defaultValue !== undefined ? defaultValue : false;
}

export function parseRedisNumber(value: string | null, defaultValue: number) {
	if (value && !isNaN(parseInt(value))) {
		return parseInt(value);
	} else {
		return defaultValue;
	}
}
