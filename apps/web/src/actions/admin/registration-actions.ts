"use server";

import { z } from "zod";
import { adminAction } from "@/lib/safe-action";
import { kv } from "@vercel/kv";
import { revalidatePath } from "next/cache";

const defaultRegistrationToggleSchema = z.object({
	enabled: z.boolean(),
});

const defaultRSVPLimitSchema = z.object({
	rsvpLimit: z.number()
});

export const toggleRegistrationEnabled = adminAction(
	defaultRegistrationToggleSchema,
	async ({ enabled }, { user, userId }) => {
		await kv.set("config:registration:registrationEnabled", enabled);
		revalidatePath("/admin/toggles/registration");
		return { success: true, statusSet: enabled };
	},
);

export const toggleRegistrationMessageEnabled = adminAction(
	defaultRegistrationToggleSchema,
	async ({ enabled }, { user, userId }) => {
		await kv.set("config:registration:registrationMessageEnabled", enabled);
		revalidatePath("/admin/toggles/registration");
		return { success: true, statusSet: enabled };
	},
);

export const toggleSecretRegistrationEnabled = adminAction(
	defaultRegistrationToggleSchema,
	async ({ enabled }, { user, userId }) => {
		await kv.set("config:registration:secretRegistrationEnabled", enabled);
		revalidatePath("/admin/toggles/registration");
		return { success: true, statusSet: enabled };
	},
);

export const toggleRSVPs = adminAction(
	defaultRegistrationToggleSchema,
	async ({ enabled }, { user, userId }) => {
		await kv.set("config:registration:allowRSVPs", enabled);
		revalidatePath("/admin/toggles/registration");
		return { success: true, statusSet: enabled };
	},
);

export const setRSVPLimit = adminAction(
	defaultRSVPLimitSchema,
	async ({ rsvpLimit }) => {
		await kv.set("config:registration:maxRSVPs", rsvpLimit);
		revalidatePath("/admin/toggles/registration");
		return { success: true, statusSet: rsvpLimit };
	}
);
