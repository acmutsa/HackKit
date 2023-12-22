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
