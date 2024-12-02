"use server";

import { authenticatedAction } from "@/lib/safe-action";
import { z } from "zod";
import { db } from "db";
import { userCommonData, userHackerData } from "db/schema";
import { eq } from "db/drizzle";
import { del, put } from "@vercel/blob";
import { decodeBase64AsFile } from "@/lib/utils/shared/files";
import { revalidatePath } from "next/cache";
import { getUser, getUserByTag } from "db/functions";
import { RegistrationSettingsFormValidator } from "@/validators/shared/RegistrationSettingsForm";
import c from "config";

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
				uploadedFile,
			},
			ctx: { userId },
		}) => {
			const user = await getUser(userId);
			if (!user) throw new Error("User not found");
			await db.transaction(async (tx) => {
				// Nested update into a db transaction
				await Promise.all([
					// attempts to update both tables with Promise.all
					tx
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
					tx
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
						.where(eq(userHackerData.clerkID, user.clerkID)),
				]).catch(async (err) => {
					// If there's an error, it rollbacks and removes the resume from blob
					console.log(
						"There was an error. Attempting to undo " + err.message,
					);
					tx.rollback();
					return {
						success: false,
					};
				});
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
		console.log(oldFileLink);
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
