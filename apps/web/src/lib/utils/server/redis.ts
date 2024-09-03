import { kv } from "@vercel/kv";
import type { NavItemToggleType } from "@/validators/shared/navitemtoggle";

export async function getAllNavItems() {
	const keys = await kv.smembers<string[]>("config:navitemslist");
	if (!keys || keys.length < 1) {
		return {
			keys: [],
			items: [],
		};
	}
	const pipe = kv.pipeline();
	for (const key of keys) {
		pipe.hgetall(`config:navitems:${key}`);
	}
	const items = await pipe.exec<NavItemToggleType[]>();
	return {
		keys,
		items,
	};
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
