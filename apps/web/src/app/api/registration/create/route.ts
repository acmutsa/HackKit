import { currentUser, clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { eq, sql } from "drizzle-orm";
import { users, registrationData, profileData } from "@/db/schema";
import { RegisterFormValidator } from "@/validators/shared/RegisterForm";
import c from "@/hackkit.config";
import { z } from "zod";
import { sendEmail } from "@/lib/utils/server/ses";

export async function POST(req: Request) {
	const rawBody = await req.json();
	const parsedBody = RegisterFormValidator.merge(z.object({ resume: z.string().url() })).safeParse(
		rawBody
	);

	if (!parsedBody.success) {
		return NextResponse.json(
			{
				success: false,
				message: "Malformed request body.",
			},
			{ status: 400 }
		);
	}

	const body = parsedBody.data;
	const user = await currentUser();

	if (!user) {
		console.log("no user");
		return NextResponse.json(
			{
				success: false,
				message: "You must be logged in to register.",
			},
			{ status: 401 }
		);
	}

	if (user.publicMetadata.registrationComplete) {
		console.log("already registered");
		return NextResponse.json(
			{
				success: false,
				message: "You are already registered.",
			},
			{ status: 400 }
		);
	}

	// TODO: Might be removable? Not sure if this is needed. In every case, the sure should have a peice of metadata that says if they are registered or not.

	const lookupByUserID = await db.query.users.findFirst({
		where: eq(users.clerkID, user.id),
	});

	if (lookupByUserID) {
		return NextResponse.json(
			{
				success: false,
				message: "You are already registered.",
			},
			{ status: 400 }
		);
	}

	const lookupByHackerTag = await db.query.users.findFirst({
		where: eq(users.hackerTag, body.hackerTag.toLowerCase()),
	});

	if (lookupByHackerTag) {
		return NextResponse.json({
			success: false,
			message: "hackertag_not_unique",
		});
	}

	const totalUserCount = await db
		.select({ count: sql<number>`count(*)`.mapWith(Number) })
		.from(users);

	if (!body.acceptsMLHCodeOfConduct || !body.shareDataWithMLH) {
		return NextResponse.json({
			success: false,
			message: "You must accept the MLH Code of Conduct and Privacy Policy.",
		});
	}

	await db.transaction(async (tx) => {
		await tx.insert(users).values({
			clerkID: user.id,
			firstName: body.firstName,
			lastName: body.lastName,
			email: body.email,
			hackerTag: body.hackerTag.toLowerCase(),
			registrationComplete: true,
			group: totalUserCount[0].count % c.groups.length,
			hasSearchableProfile: body.profileIsSearchable,
		});

		await tx.insert(registrationData).values({
			clerkID: user.id,
			acceptedMLHCodeOfConduct: body.acceptsMLHCodeOfConduct,
			accommodationNote: body.accommodationNote || null,
			age: body.age,
			dietRestrictions: body.dietaryRestrictions,
			ethnicity: body.ethnicity,
			gender: body.gender,
			hackathonsAttended: body.hackathonsAttended,
			heardFrom: body.heardAboutEvent || null,
			levelOfStudy: body.levelOfStudy,
			major: body.major,
			race: body.race,
			sharedDataWithMLH: body.shareDataWithMLH,
			shirtSize: body.shirtSize,
			shortID: body.shortID,
			softwareExperience: body.softwareBuildingExperience,
			university: body.university,
			wantsToReceiveMLHEmails: body.wantsToReceiveMLHEmails,
			GitHub: body.github,
			LinkedIn: body.linkedin,
			PersonalWebsite: body.personalWebsite,
			resume: body.resume,
		});

		await tx.insert(profileData).values({
			bio: body.bio,
			discordUsername: body.profileDiscordName,
			hackerTag: body.hackerTag.toLowerCase(),
			profilePhoto: user.imageUrl,
			pronouns: body.pronouns,
			skills: body.skills.map((v) => v.text.toLowerCase()),
		});
	});

	clerkClient.users.updateUser(user.id, {
		publicMetadata: {
			...user.publicMetadata,
			registrationComplete: true,
		},
	});

	// sendEmail({
	// 	to: body.email,
	// 	subject: `You are now registered for ${c.hackathonName} ${c.itteration}!`,
	// });

	return NextResponse.json({ success: true, message: "Successfully created registration!" });
}

export const runtime = "edge";
