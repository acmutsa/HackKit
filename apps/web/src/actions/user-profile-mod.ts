"use server";

import { authenticatedAction } from "@/lib/safe-action";
import { z } from "zod";
import { db } from "db";
import { userCommonData, userHackerData } from "db/schema";
import { eq } from "db/drizzle";
import { del, put } from "@vercel/blob";
import { decodeBase64AsFile } from "@/lib/utils/shared/files";
import { revalidatePath } from "next/cache";
import { UNIQUE_KEY_CONSTRAINT_VIOLATION_CODE } from "@/lib/constants";
import c from "config";
import { DatabaseError } from "db/types";
import { registrationSettingsFormValidator, modifyAccountSettingsSchema } from "@/validators/settings";

export const modifyRegistrationData = authenticatedAction
	.schema(registrationSettingsFormValidator)
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
				uploadedFile,
			},
			ctx: { userId },
		}) => {
			await Promise.all([
				// attempts to update both tables with Promise.all
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
					.where(eq(userCommonData.clerkID, userId)),
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
						resume: uploadedFile,
					})
					.where(eq(userHackerData.clerkID, userId)),
			]).catch(async (err) => {
				console.log(
					`Error occured at modify registration data: ${err}`,
				);
				// If there's an error
				return {
					success: false,
				};
			});
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
				newUploadedFile: uploadedFile,
			};
		},
	);

export const deleteResume = authenticatedAction
	.schema(
		z.object({
			oldFileLink: z.string(),
		}),
	)
	.action(async ({ parsedInput: { oldFileLink } }) => {
		console.log("called");
		if (oldFileLink === c.noResumeProvidedURL) return null;
		await del(oldFileLink);
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
			await db
				.update(userCommonData)
				.set({ pronouns, bio, skills, discord })
				.where(eq(userCommonData.clerkID, userId));
			return {
				success: true,
				newPronouns: pronouns,
				newBio: bio,
				newSkills: skills,
				newDiscord: discord,
			};
		},
	);

export const modifyAccountSettings = authenticatedAction
	.schema(
		modifyAccountSettingsSchema,
	)
	.action(
		async ({
			parsedInput: {
				firstName,
				lastName,
				hackerTag,
				isSearchable: hasSearchableProfile,
			},
			ctx: { userId },
		}) => {
			try {
				await db
					.update(userCommonData)
					.set({
						firstName,
						lastName,
						hackerTag,
						isSearchable: hasSearchableProfile,
					})
					.where(eq(userCommonData.clerkID, userId));
			} catch (err) {
				if (
					err instanceof DatabaseError &&
					err.code === UNIQUE_KEY_CONSTRAINT_VIOLATION_CODE
				) {
					return {
						success: false,
						message: "hackertag_not_unique",
					};
				}
				throw err;
			}
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
