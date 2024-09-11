"use server";

import { authenticatedAction } from "@/lib/safe-action";
import { z } from "zod";
import { db } from "db";
import { users, profileData, registrationData } from "db/schema";
import { eq } from "db/drizzle";
import { put } from "@vercel/blob";
import { decodeBase64AsFile } from "@/lib/utils/shared/files";
import { revalidatePath } from "next/cache";

// TODO: Add skill updating
export const modifyRegistrationData = authenticatedAction(
	z.object({
		bio: z.string().max(500),
		skills: z.string().max(100),
	}),
	async ({ bio, skills }, { userId }) => {
		const user = await db.query.users.findFirst({
			where: eq(users.clerkID, userId),
		});
		if (!user) throw new Error("User not found");
		await db
			.update(profileData)
			.set({ bio })
			.where(eq(profileData.hackerTag, user.hackerTag));
		return { success: true, newbio: bio };
	},
);

export const modifyAccountSettings = authenticatedAction(
	z.object({
		firstName: z.string().min(1).max(50),
		lastName: z.string().min(1).max(50),
	}),
	async ({ firstName, lastName }, { userId }) => {
		const user = await db.query.users.findFirst({
			where: eq(users.clerkID, userId),
		});
		if (!user) throw new Error("User not found");
		await db
			.update(users)
			.set({ firstName, lastName })
			.where(eq(users.clerkID, userId));
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
		const user = await db.query.users.findFirst({
			where: eq(users.clerkID, userId),
		});
		if (!user) throw new Error("User not found");

		const blobUpload = await put(image.name, image, { access: "public" });
		await db
			.update(profileData)
			.set({ profilePhoto: blobUpload.url })
			.where(eq(profileData.hackerTag, user.hackerTag));
		revalidatePath("/settings/profile");
		return { success: true };
	},
);
