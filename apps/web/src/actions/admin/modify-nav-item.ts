"use server";

import { z } from "zod";
import { adminAction } from "@/lib/safe-action";
import { kv } from "@vercel/kv";
import { revalidatePath } from "next/cache";

const metadataSchema = z.object({
	name: z.string().min(1),
	url: z.string(),
});

// Maybe a better way to do this for revalidation? Who knows.
const navAdminPage = "/admin/toggles/landing";

export const setItem = adminAction
	.schema(metadataSchema)
	.action(async ({ parsedInput: { name, url }, ctx: { user, userId } }) => {
		await kv.sadd("config:navitemslist", encodeURIComponent(name));
		await kv.hset(`config:navitems:${encodeURIComponent(name)}`, {
			url,
			name,
			enabled: true,
		});
		revalidatePath(navAdminPage);
		return { success: true };
	});

export const removeItem = adminAction
	.schema(z.string())
	.action(async ({ parsedInput: name, ctx: { user, userId } }) => {
		const pipe = kv.pipeline();
		pipe.srem("config:navitemslist", encodeURIComponent(name));
		pipe.del(`config:navitems:${encodeURIComponent(name)}`);
		await pipe.exec();
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
			await kv.hset(`config:navitems:${encodeURIComponent(name)}`, {
				enabled: statusToSet,
			});
			revalidatePath(navAdminPage);
			return { success: true, itemStatus: statusToSet };
		},
	);
