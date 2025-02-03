"use server";
import { authenticatedAction } from "@/lib/safe-action";
import { db, sql } from "db";
import { del } from "@vercel/blob";
import z from "zod";
import { returnValidationErrors } from "next-safe-action";
import { hackerRegistrationFormValidator } from "@/validators/shared/registration";
import { userCommonData, userHackerData } from "db/schema";
import { currentUser } from "@clerk/nextjs/server";
import c from "config";
import { DatabaseError } from "db/types";
import {
	UNIQUE_KEY_CONSTRAINT_VIOLATION_CODE,
	UNIQUE_KEY_MAPPER_DEFAULT_KEY,
} from "@/lib/constants";

const registerUserSchema = hackerRegistrationFormValidator;

export const registerHacker = authenticatedAction
	.schema(registerUserSchema)
	.action(async ({ ctx: { userId }, parsedInput }) => {
		const {
			resume,
			hackerTag,
			email,
			university,
			major,
			schoolID,
			levelOfStudy,
			hackathonsAttended,
			softwareExperience,
			heardFrom,
			GitHub,
			LinkedIn,
			PersonalWebsite,
			hasAcceptedMLHCoC,
			hasSharedDataWithMLH,
			isEmailable,
			...userData
		} = parsedInput;

		const currUser = await currentUser();
		if (!currUser) {
			return returnValidationErrors(z.null(), {
				_errors: ["Unauthorized (No User ID)"],
			});
		}
		const totalUserCount = await db
			.select({ count: sql<number>`count(*)`.mapWith(Number) })
			.from(userCommonData);

		try {
			await db.transaction(async (tx) => {
				await tx.insert(userCommonData).values({
					clerkID: userId,
					hackerTag: hackerTag.toLocaleLowerCase(),
					email,
					...userData,
					profilePhoto: currUser.imageUrl,
					skills: userData.skills.map((v) => v.text.toLowerCase()),
					isFullyRegistered: true,
					dietRestrictions: userData.dietRestrictions,
				});

				await tx.insert(userHackerData).values({
					clerkID: userId,
					university,
					major,
					schoolID,
					levelOfStudy,
					hackathonsAttended,
					softwareExperience,
					heardFrom,
					GitHub,
					LinkedIn,
					PersonalWebsite,
					resume,
					group:
						totalUserCount[0].count % Object.keys(c.groups).length,
					hasAcceptedMLHCoC,
					hasSharedDataWithMLH,
					isEmailable,
				});
			});
		} catch (e) {
			// Catch duplicates because they will be based off of the error code 23505
			if (resume != null && resume != c.noResumeProvidedURL) {
				console.log(resume);
				console.log("deleting resume");
				await del(resume);
			}
			if (
				e instanceof DatabaseError &&
				e.code === UNIQUE_KEY_CONSTRAINT_VIOLATION_CODE
			) {
				console.error(e);
				const constraintKeyIndex =
					e.constraint as keyof typeof c.db.uniqueKeyMapper;
				return {
					success: false,
					message:
						c.db.uniqueKeyMapper[
							constraintKeyIndex ?? UNIQUE_KEY_MAPPER_DEFAULT_KEY
						] ?? e.detail,
				};
			} else {
				throw e;
			}
		}

		return {
			success: true,
			message: "Registration created successfully",
		};
	});
