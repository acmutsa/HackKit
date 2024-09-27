"use server";

import { authenticatedAction } from "@/lib/safe-action";
import { z } from "zod";
import { db } from "db";
import { userCommonData } from "db/schema";
import { eq } from "db/drizzle";
import { put } from "@vercel/blob";
import { decodeBase64AsFile } from "@/lib/utils/shared/files";
import { returnValidationErrors } from "next-safe-action";
import { revalidatePath } from "next/cache";
import { getUser } from "db/functions";

// TODO: Add skill updating
export const modifyRegistrationData = authenticatedAction
	.schema(
		z.object({
			bio: z.string().max(500),
			skills: z.string().max(100),
		}),
	)
	.action(async ({ parsedInput: { bio, skills }, ctx: { userId } }) => {
		const user = await getUser(userId);
		if (!user)
			returnValidationErrors(z.null(), { _errors: ["User not found"] });

		await db
			.update(userCommonData)
			.set({ bio })
			.where(eq(userCommonData.clerkID, user.clerkID));
		return { success: true, newbio: bio };
	});

export const modifyAccountSettings = authenticatedAction
	.schema(
		z.object({
			firstName: z.string().min(1).max(50),
			lastName: z.string().min(1).max(50),
		}),
	)
	.action(
		async ({ parsedInput: { firstName, lastName }, ctx: { userId } }) => {
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

export const updateProfileImage = authenticatedAction
	.schema(z.object({ fileBase64: z.string(), fileName: z.string() }))
	.action(
		async ({ parsedInput: { fileBase64, fileName }, ctx: { userId } }) => {
			const image = await decodeBase64AsFile(fileBase64, fileName);
			const user = await getUser(userId);
			if (!user)
				returnValidationErrors(z.null(), {
					_errors: ["User not found"],
				});

			const blobUpload = await put(image.name, image, {
				access: "public",
			});
			await db
				.update(userCommonData)
				.set({ profilePhoto: blobUpload.url })
				.where(eq(userCommonData.clerkID, user.clerkID));
			revalidatePath("/settings/profile");
			return { success: true };
		},
	);
