"use server";

import { authenticatedAction } from "@/lib/safe-action";
import { z } from "zod";
import { db } from "db";
import { userCommonData, userHackerData } from "db/schema";
import { eq } from "db/drizzle";
import { del } from "@/lib/utils/server/file-upload";
import { decodeBase64AsFile } from "@/lib/utils/shared/files";
import { revalidatePath } from "next/cache";
import { UNIQUE_KEY_CONSTRAINT_VIOLATION_CODE } from "@/lib/constants";
import c from "config";
import { DatabaseError } from "db/types";
import {
	registrationSettingsFormValidator,
	modifyAccountSettingsSchema,
	profileSettingsSchema,
} from "@/validators/settings";
import { clerkClient, type User as ClerkUser } from "@clerk/nextjs/server";
import { PAYLOAD_TOO_LARGE_CODE } from "@/lib/constants";

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
		if (oldFileLink === c.noResumeProvidedURL) return null;
		await del(oldFileLink);
	});

export const modifyProfileData = authenticatedAction
	.schema(profileSettingsSchema)
	.action(async ({ parsedInput, ctx: { userId } }) => {
		await db
			.update(userCommonData)
			.set({
				...parsedInput,
				skills: parsedInput.skills.map((v) => v.toLowerCase()),
			})
			.where(eq(userCommonData.clerkID, userId));
		return {
			success: true,
		};
	});

export const modifyAccountSettings = authenticatedAction
	.schema(modifyAccountSettingsSchema)
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
				console.log("modifyAccountSettings error is", err);
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

// come back and fix this tmr
export const updateProfileImage = authenticatedAction
	.schema(z.object({ fileBase64: z.string(), fileName: z.string() }))
	.action(
		async ({ parsedInput: { fileBase64, fileName }, ctx: { userId } }) => {
			const file = await decodeBase64AsFile(fileBase64, fileName);
			let clerkUser: ClerkUser;
			try {
				clerkUser = await (
					await clerkClient()
				).users.updateUserProfileImage(userId, {
					file,
				});
			} catch (err) {
				console.log(`Error updating Clerk profile image: ${err}`);
				if (
					typeof err === "object" &&
					err != null &&
					"status" in err &&
					err.status === PAYLOAD_TOO_LARGE_CODE
				) {
					return {
						success: false,
						message: "file_too_large",
					};
				}
				console.log(
					`Unknown Error updating Clerk profile image: ${err}`,
				);
				throw err;
			}

			await db
				.update(userCommonData)
				.set({ profilePhoto: clerkUser.imageUrl })
				.where(eq(userCommonData.clerkID, userId));
			revalidatePath("/settings#profile");
			return { success: true };
		},
	);
