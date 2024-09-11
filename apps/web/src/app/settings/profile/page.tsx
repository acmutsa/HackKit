import ProfileSettings from "@/components/settings/ProfileSettings";
import { db } from "db";
import { users } from "db/schema";
import { eq } from "db/drizzle";
import { auth } from "@clerk/nextjs";

export default async function Page() {
	const { userId } = auth();
	if (!userId) throw new Error("User not found");
	const user = await db.query.users.findFirst({
		where: eq(users.clerkID, userId),
		with: {
			profileData: true,
			registrationData: true,
		},
	});
	if (!user) throw new Error("User not found");
	return (
		<ProfileSettings
			bio={user.profileData.bio}
			university={user.registrationData.university}
		/>
	);
}

export const runtime = "edge";
