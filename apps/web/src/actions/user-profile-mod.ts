"use server";

import { authenticatedAction } from "@/lib/safe-action";
import { z } from "zod";
import { db } from "db";
import { userCommonData, userHackerData } from "db/schema";
import { eq } from "db/drizzle";
import { put } from "@vercel/blob";
import { decodeBase64AsFile } from "@/lib/utils/shared/files";
import { returnValidationErrors } from "next-safe-action";
import { revalidatePath } from "next/cache";
import { getUser, getUserByTag } from "db/functions";
import { RegistrationSettingsFormValidator } from "@/validators/shared/RegistrationSettingsForm";

export const modifyRegistrationData = authenticatedAction
	.schema(RegistrationSettingsFormValidator)
	.action(
		async ({
			parsedInput: {
				age,
				gender,
				race,
				ethnicity,
				isEmailable,
				university,
				major,
				levelOfStudy,
				schoolID,
				hackathonsAttended,
				softwareBuildingExperience,
				heardAboutEvent,
				shirtSize,
				dietaryRestrictions,
				accommodationNote,
				github,
				linkedin,
				personalWebsite,
				phoneNumber,
				countryOfResidence,
			},
			ctx: { userId },
		}) => {
			const user = await getUser(userId);
			if (!user) throw new Error("User not found");
			await Promise.all([
				db
					.update(userCommonData)
					.set({
						age,
						gender,
						race,
						ethnicity,
						shirtSize,
						dietRestrictions: dietaryRestrictions,
						accommodationNote,
						phoneNumber,
						countryOfResidence,
					})
					.where(eq(userCommonData.clerkID, user.clerkID)),
				db
					.update(userHackerData)
					.set({
						isEmailable,
						university,
						major,
						levelOfStudy,
						schoolID,
						hackathonsAttended,
						softwareExperience: softwareBuildingExperience,
						heardFrom: heardAboutEvent,
						GitHub: github,
						LinkedIn: linkedin,
						PersonalWebsite: personalWebsite,
					})
					.where(eq(userHackerData.clerkID, user.clerkID)),
			]);
			return {
				success: true,
				newAge: age,
				newGender: gender,
				newRace: race,
				newEthnicity: ethnicity,
				newWantsToReceiveMLHEmails: isEmailable,
				newUniversity: university,
				newMajor: major,
				newLevelOfStudy: levelOfStudy,
				newSchoolID: schoolID,
				newHackathonsAttended: hackathonsAttended,
				newSoftwareExperience: softwareBuildingExperience,
				newHeardFrom: heardAboutEvent,
				newShirtSize: shirtSize,
				newDietaryRestrictions: dietaryRestrictions,
				newAccommodationNote: accommodationNote,
				newGitHub: github,
				newLinkedIn: linkedin,
				newPersonalWebsite: personalWebsite,
				newPhoneNumber: phoneNumber,
				newCountryOfResidence: countryOfResidence,
			};
		},
	);

export const modifyResume = authenticatedAction
	.schema(
		z.object({
			resume: z.string(),
		}),
	)
	.action(async ({ parsedInput: { resume }, ctx: { userId } }) => {
		await db
			.update(userHackerData)
			.set({ resume })
			.where(eq(userHackerData.clerkID, userId));
		return {
			success: true,
			newResume: resume,
		};
	});

export const modifyProfileData = authenticatedAction
	.schema(
		z.object({
			pronouns: z.string(),
			bio: z.string(),
			skills: z.string().array(),
			discord: z.string(),
		}),
	)
	.action(
		async ({
			parsedInput: { bio, discord, pronouns, skills },
			ctx: { userId },
		}) => {
			const user = await getUser(userId);
			if (!user) {
				throw new Error("User not found");
			}
			await db
				.update(userCommonData)
				.set({ pronouns, bio, skills, discord })
				.where(eq(userCommonData.clerkID, user.clerkID));
			return {
				success: true,
				newPronouns: pronouns,
				newBio: bio,
				newSkills: skills,
				newDiscord: discord,
			};
		},
	);

// TODO: Fix after registration enhancements to allow for failure on conflict and return appropriate error message
export const modifyAccountSettings = authenticatedAction
	.schema(
		z.object({
			firstName: z.string().min(1).max(50),
			lastName: z.string().min(1).max(50),
			hackerTag: z.string().min(1).max(50),
			hasSearchableProfile: z.boolean(),
		}),
	)
	.action(
		async ({
			parsedInput: {
				firstName,
				lastName,
				hackerTag,
				hasSearchableProfile,
			},
			ctx: { userId },
		}) => {
			const user = await getUser(userId);
			if (!user) throw new Error("User not found");
			let oldHackerTag = user.hackerTag; // change when hackertag is not PK on profileData table
			if (oldHackerTag != hackerTag)
				if (await getUserByTag(hackerTag))
					//if hackertag changed
					// copied from /api/registration/create
					return {
						success: false,
						message: "hackertag_not_unique",
					};
			await db
				.update(userCommonData)
				.set({
					firstName,
					lastName,
					hackerTag,
					isSearchable: hasSearchableProfile,
				})
				.where(eq(userCommonData.clerkID, userId));
			return {
				success: true,
				newFirstName: firstName,
				newLastName: lastName,
				newHackerTag: hackerTag,
				newHasSearchableProfile: hasSearchableProfile,
			};
		},
	);

export const updateProfileImage = authenticatedAction
	.schema(z.object({ fileBase64: z.string(), fileName: z.string() }))
	.action(
		async ({ parsedInput: { fileBase64, fileName }, ctx: { userId } }) => {
			const image = await decodeBase64AsFile(fileBase64, fileName);
			const user = await db.query.userCommonData.findFirst({
				where: eq(userCommonData.clerkID, userId),
			});
			if (!user) throw new Error("User not found");

			const blobUpload = await put(image.name, image, {
				access: "public",
			});
			await db
				.update(userCommonData)
				.set({ profilePhoto: blobUpload.url })
				.where(eq(userCommonData.clerkID, user.clerkID));
			revalidatePath("/settings#profile");
			return { success: true };
		},
	);
