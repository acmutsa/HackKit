import { currentUser, clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "db";
import { sql } from "db/drizzle";
import { userCommonData, userHackerData } from "db/schema";
import { hackerRegistrationFormValidator } from "@/validators/shared/registration";
import c from "config";
import { z } from "zod";
import { getUser, getUserByTag } from "db/functions";
import { del } from "@vercel/blob";


export async function POST(req: Request) {
	let resume:string | undefined;
	try{
	const rawBody = await req.json();
	const parsedBody = hackerRegistrationFormValidator.merge(
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
	resume = body.resume;
	const user = await currentUser();

	if (!user) {
		if (resume !== c.noResumeProvidedURL){
			await del(body.resume);
		}
		console.log("no user");
		return NextResponse.json(
			{
				success: false,
				message: "You must be logged in to register.",
			},
			{ status: 401 },
		);
	}

	const lookupByUserID = await getUser(user.id);

	if (lookupByUserID) {
		if (resume !== c.noResumeProvidedURL) {
			await del(body.resume);
		}
		return NextResponse.json(
			{
				success: false,
				message: "You are already registered.",
			},
			{ status: 400 },
		);
	}

	const lookupByHackerTag = await getUserByTag(body.hackerTag.toLowerCase());

	if (lookupByHackerTag) {
		if (body.resume !== c.noResumeProvidedURL) {
			await del(body.resume);
		}
		return NextResponse.json({
			success: false,
			message: "hackertag_not_unique",
		});
	}

	if (!body.hasAcceptedMLHCoC || !body.hasSharedDataWithMLH) {
		if (body.resume !== c.noResumeProvidedURL) {
			await del(body.resume);
		}
		return NextResponse.json({
			success: false,
			message:
				"You must accept the MLH Code of Conduct and Privacy Policy.",
		});
	}

	const totalUserCount = await db
		.select({ count: sql<number>`count(*)`.mapWith(Number) })
		.from(userCommonData);

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
			dietRestrictions: body.dietRestrictions,
			accommodationNote: body.accommodationNote || null,
			discord: body.discord,
			pronouns: body.pronouns,
			bio: body.bio,
			skills: body.skills.map((v) => v.text.toLowerCase()),
			profilePhoto: user.imageUrl,
			isFullyRegistered: true,
			phoneNumber: body.phoneNumber,
			isSearchable: body.isSearchable,
			countryOfResidence: body.countryOfResidence,
		});

		await tx.insert(userHackerData).values({
			clerkID: user.id,
			university: body.university,
			major: body.major,
			schoolID: body.schoolID,
			levelOfStudy: body.levelOfStudy,
			hackathonsAttended: body.hackathonsAttended,
			softwareExperience: body.softwareExperience,
			heardFrom: body.heardFrom || null,
			GitHub: body.GitHub,
			LinkedIn: body.LinkedIn,
			PersonalWebsite: body.PersonalWebsite,
			resume: body.resume,
			group: totalUserCount[0].count % Object.keys(c.groups).length,
			hasAcceptedMLHCoC: body.hasAcceptedMLHCoC,
			hasSharedDataWithMLH: body.hasSharedDataWithMLH,
			isEmailable: body.isEmailable,
		});
	});

	// sendEmail({
	// 	to: body.email,
	// 	subject: `You are now registered for ${c.hackathonName} ${c.itteration}!`,
	// });

	return NextResponse.json({
		success: true,
		message: "Successfully created registration!",
	});
	}catch(e){
		console.error(`A fatal error occured: `,e);
		if (resume){
			await del(resume);
		}
		return NextResponse.json(
			{
				success: false,
				message: "A fatal error occured.",
			},
			{ status: 500 },
		);
	}
}

export const runtime = "edge";
