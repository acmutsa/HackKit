"use server";

import { z } from "zod";
import { adminAction } from "@/lib/safe-action";
import { redisSAdd, redisHSet, removeNavItem } from "@/lib/utils/server/redis";
import { revalidatePath } from "next/cache";
import { kv } from "@vercel/kv";

const metadataSchema = z.object({
	name: z.string().min(1),
	url: z.string().min(1),
});

const editMetadataSchema = metadataSchema.extend({
	existingName: z.string().min(1),
	enabled: z.boolean(),
});

// Maybe a better way to do this for revalidation? Who knows.
const navAdminPage = "/admin/toggles/landing";

export const setItem = adminAction
	.schema(metadataSchema)
	.action(async ({ parsedInput: { name, url }, ctx: { user, userId } }) => {
		await redisSAdd("config:navitemslist", encodeURIComponent(name));
		await redisHSet(`config:navitems:${encodeURIComponent(name)}`, {
			url,
			name,
			enabled: true,
		});
		revalidatePath(navAdminPage);
		return { success: true };
	});

export const editItem = adminAction
	.schema(editMetadataSchema)
	.action(async ({ parsedInput: { name, url, existingName } }) => {
		const pipe = kv.pipeline();

		if (existingName != name) {
			pipe.srem("config:navitemslist", encodeURIComponent(existingName));
		}

		pipe.sadd("config:navitemslist", encodeURIComponent(name));
		pipe.hset(`config:navitems:${encodeURIComponent(name)}`, {
			url,
			name,
			enabled: true,
		});

		await pipe.exec();

		revalidatePath(navAdminPage);
		return { success: true };
	});

export const removeItem = adminAction
	.schema(z.string())
	.action(async ({ parsedInput: name, ctx: { user, userId } }) => {
		await removeNavItem(name);
		// await new Promise((resolve) => setTimeout(resolve, 1500));
		revalidatePath(navAdminPage);
		return { success: true };
	});

export const toggleItem = adminAction
	.schema(z.object({ name: z.string(), statusToSet: z.boolean() }))
	.action(
		async ({
			parsedInput: { name, statusToSet },
			ctx: { user, userId },
		}) => {
			await redisHSet(`config:navitems:${encodeURIComponent(name)}`, {
				enabled: statusToSet,
			});
			revalidatePath(navAdminPage);
			return { success: true, itemStatus: statusToSet };
		},
	);
