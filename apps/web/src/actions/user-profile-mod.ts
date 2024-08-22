"use server";

import { authenticatedAction } from "@/lib/safe-action";
import { z } from "zod";
import { db } from "db";
import { userCommonData } from "db/schema";
import { eq } from "db/drizzle";
import { put } from "@vercel/blob";
import { decodeBase64AsFile } from "@/lib/utils/shared/files";
import { revalidatePath } from "next/cache";
import { getUser } from "db/functions";

// TODO: Add skill updating
export const modifyRegistrationData = authenticatedAction(
	z.object({
		bio: z.string().max(500),
		skills: z.string().max(100),
	}),
	async ({ bio, skills }, { userId }) => {
		const user = await getUser(userId);
		if (!user) throw new Error("User not found");

		await db
			.update(userCommonData)
			.set({ bio })
			.where(eq(userCommonData.clerkID, user.clerkID));
		return { success: true, newbio: bio };
	},
);

export const modifyAccountSettings = authenticatedAction(
	z.object({
		firstName: z.string().min(1).max(50),
		lastName: z.string().min(1).max(50),
	}),
	async ({ firstName, lastName }, { userId }) => {
		const user = await getUser(userId);
		if (!user) throw new Error("User not found");

		await db
			.update(userCommonData)
			.set({ firstName, lastName })
			.where(eq(userCommonData.clerkID, userId));
		return {
			success: true,
			newFirstName: firstName,
			newLastName: lastName,
		};
	},
);

export const updateProfileImage = authenticatedAction(
	z.object({ fileBase64: z.string(), fileName: z.string() }),
	async ({ fileBase64, fileName }, { userId }) => {
		const image = await decodeBase64AsFile(fileBase64, fileName);
		const user = await getUser(userId);
		if (!user) throw new Error("User not found");

		const blobUpload = await put(image.name, image, { access: "public" });
		await db
			.update(userCommonData)
			.set({ profilePhoto: blobUpload.url })
			.where(eq(userCommonData.clerkID, user.clerkID));
		revalidatePath("/settings/profile");
		return { success: true };
	},
);
