import { currentUser, clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "db";
import { eq, sql } from "db/drizzle";
import { userCommonData, userHackerData } from "db/schema";
import { RegisterFormValidator } from "@/validators/shared/RegisterForm";
import c from "config";
import { z } from "zod";

export async function POST(req: Request) {
	const rawBody = await req.json();
	const parsedBody = RegisterFormValidator.merge(
		z.object({ resume: z.string().url() }),
	).safeParse(rawBody);

	if (!parsedBody.success) {
		return NextResponse.json(
			{
				success: false,
				message: "Malformed request body.",
			},
			{ status: 400 },
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
			{ status: 401 },
		);
	}

	if (user.publicMetadata.registrationComplete) {
		console.log("already registered");
		return NextResponse.json(
			{
				success: false,
				message: "You are already registered.",
			},
			{ status: 400 },
		);
	}

	// TODO: Might be removable? Not sure if this is needed. In every case, the sure should have a peice of metadata that says if they are registered or not.

	const lookupByUserID = await db.query.userCommonData.findFirst({
		where: eq(userCommonData.clerkID, user.id),
	});

	if (lookupByUserID) {
		return NextResponse.json(
			{
				success: false,
				message: "You are already registered.",
			},
			{ status: 400 },
		);
	}

	const lookupByHackerTag = await db.query.userCommonData.findFirst({
		where: eq(userCommonData.hackerTag, body.hackerTag.toLowerCase()),
	});

	if (lookupByHackerTag) {
		return NextResponse.json({
			success: false,
			message: "hackertag_not_unique",
		});
	}

	const totalUserCount = await db
		.select({ count: sql<number>`count(*)`.mapWith(Number) })
		.from(userCommonData);

	if (!body.hasAcceptedMLHCoC || !body.hasSharedDataWithMLH) {
		return NextResponse.json({
			success: false,
			message:
				"You must accept the MLH Code of Conduct and Privacy Policy.",
		});
	}

	await db.transaction(async (tx) => {
		await tx.insert(userCommonData).values({
			clerkID: user.id,
			firstName: body.firstName,
			lastName: body.lastName,
			email: body.email,
			hackerTag: body.hackerTag.toLowerCase(),
            age: body.age,
            gender: body.gender,
            race: body.race,
            ethnicity: body.ethnicity,
            shirtSize: body.shirtSize,
            dietRestrictions: body.dietaryRestrictions,
            accommodationNote: body.accommodationNote || null,
			discord: body.profileDiscordName,
			pronouns: body.pronouns,
			bio: body.bio,
			skills: body.skills.map((v) => v.text.toLowerCase()),
			profilePhoto: user.imageUrl,
			isFullyRegistered: true,
			isSearchable: body.profileIsSearchable,
		});
        
		await tx.insert(userHackerData).values({
            clerkID: user.id,
			university: body.university,
			major: body.major,
			schoolID: body.schoolID,
			levelOfStudy: body.levelOfStudy,
			hackathonsAttended: body.hackathonsAttended,
			softwareExperience: body.softwareBuildingExperience,
			heardFrom: body.heardAboutEvent || null,
			GitHub: body.github,
			LinkedIn: body.linkedin,
			PersonalWebsite: body.personalWebsite,
			resume: body.resume,
            group: totalUserCount[0].count % Object.keys(c.groups).length,
			hasAcceptedMLHCoC: body.hasAcceptedMLHCoC,
			hasSharedDataWithMLH: body.hasSharedDataWithMLH,
			isEmailable: body.isEmailable,
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

	return NextResponse.json({
		success: true,
		message: "Successfully created registration!",
	});
}

export const runtime = "edge";
