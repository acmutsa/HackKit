"use server";

import { authenticatedAction } from "@/lib/safe-action";
import { undefined, z } from "zod";
import { db } from "db";
import { users, profileData, registrationData } from "db/schema";
import { eq } from "db/drizzle";
import { put } from "@vercel/blob";
import { decodeBase64AsFile } from "@/lib/utils/shared/files";
import { revalidatePath } from "next/cache";

// TODO: Add skill updating
export const modifyRegistrationData = authenticatedAction(
	z.object({
		age: z.number(),
		gender: z.string(),
		race: z.string(),
		ethnicity: z.string(),
	}),
	async ({ age, gender, race, ethnicity }, { userId }) => {
		const user = await db.query.users.findFirst({
			where: eq(users.clerkID, userId),
		});
		if (!user) throw new Error("User not found");
		await db
			.update(registrationData)
			.set({ age, gender, race, ethnicity })
			.where(eq(registrationData.clerkID, user.clerkID));
		return {
			success: true,
			newAge: age,
			newGender: gender,
			newRace: race,
			newEthnicity: ethnicity };
	},
);

export const modifyProfileData = authenticatedAction(
	z.object({
		bio: z.string(),
		skills: z.string().array(),
		discordUsername: z.string(),
	}),
	async ({ bio, skills, discordUsername }, { userId }) => {
		const user = await db.select().from(users).leftJoin(profileData, eq(users.hackerTag, profileData.hackerTag)).where(eq(users.clerkID, userId));
		if (!user || !user[0].profile_data) {
			throw new Error("User not found");
		}
		await db
			.update(profileData)
			.set({ bio, skills, discordUsername })
			.where(eq(profileData.hackerTag, user[0].profile_data.hackerTag))
		return {
			success: true,
			newBio: bio,
			newSkills: skills,
			newDiscord: discordUsername,
		}
	},
);

export const modifyAccountSettings = authenticatedAction(
	z.object({
		firstName: z.string().min(1).max(50),
		lastName: z.string().min(1).max(50),
		//email: z.string().min(1).max(50),
		hackerTag: z.string().min(1).max(50),
		hasSearchableProfile: z.boolean()
	}),
	async ({ firstName, lastName, hackerTag, hasSearchableProfile }, { userId }) => {
		const user = await db.query.users.findFirst({
			where: eq(users.clerkID, userId),
		});
		if (!user) throw new Error("User not found");
		let oldHackerTag = user.hackerTag; // change when hackertag is not PK on profileData table
		if (oldHackerTag != hackerTag) {
			const lookupByHackerTag = await db.query.users.findFirst({
				where: eq(users.hackerTag, hackerTag.toLowerCase()),
			}); // copied from /api/registration/create
			if (lookupByHackerTag) {
				return {
					success: false,
					message: "hackertag_not_unique",
				}
			}
		}
		await db
			.update(users)
			.set({ firstName, lastName, hackerTag, hasSearchableProfile })
			.where(eq(users.clerkID, userId));
		await db
			.update(profileData) // see above comment
			.set({ hackerTag })
			.where(eq(profileData.hackerTag, oldHackerTag))
		return {
			success: true,
			newFirstName: firstName,
			newLastName: lastName,
			//newEmail: email,
			newHackerTag: hackerTag,
			newHasSearchableProfile: hasSearchableProfile,
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
