import ProfileSettings from "@/components/settings/ProfileSettings";
import { db } from "db";
import { userCommonData } from "db/schema";
import { eq } from "db/drizzle";
import { auth } from "@clerk/nextjs";

export default async function Page() {
	const { userId } = auth();
	if (!userId) throw new Error("User not found");
	const user = await db.query.userCommonData.findFirst({
		where: eq(userCommonData.clerkID, userId),
		with: { hackerData: true },
	});
	if (!user) throw new Error("User not found");
	return (
		<ProfileSettings
			bio={user.bio}
			university={user.hackerData.university}
		/>
	);
}

export const runtime = "edge";
