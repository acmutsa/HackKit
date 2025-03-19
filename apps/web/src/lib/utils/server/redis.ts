import type { NavItemToggleType } from "@/validators/shared/navitemtoggle";
import c from "config";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export function includeEnvPrefix(key: string) {
	return `${c.hackathonName}_${c.itteration}_${process.env.HK_ENV}_${key}`;
}

export async function redisSAdd(key: string, value: string): Promise<number> {
	return redis.sadd(includeEnvPrefix(key), value);
}

export async function redisHSet<TData>(
	key: string,
	value: Record<string, TData>,
): Promise<number> {
	return redis.hset(includeEnvPrefix(key), value);
}

export async function redisSet<TData>(
	key: string,
	value: TData,
): Promise<TData | "OK" | null> {
	return redis.set<TData>(includeEnvPrefix(key), value);
}

export async function redisGet<TData>(key: string): Promise<TData | null> {
	return redis.get<TData>(includeEnvPrefix(key));
}

export async function redisMGet<TData>(...keys: string[]): Promise<TData[]> {
	return redis.mget<TData[]>(keys.map(includeEnvPrefix));
}

export async function getAllNavItems() {
	const keys = await redis.smembers<string[]>(
		includeEnvPrefix("config:navitemslist"),
	);
	if (!keys || keys.length < 1) {
		return {
			keys: [],
			items: [],
		};
	}
	const pipe = redis.pipeline();
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
	console.log("Removing: ", includeEnvPrefix("config:navitemslist"));
	const pipe = redis.pipeline();
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
