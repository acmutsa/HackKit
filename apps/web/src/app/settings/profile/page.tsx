import ProfileSettings from "@/components/settings/ProfileSettings";
import { auth } from "@clerk/nextjs";
import { getHacker } from "db/functions";

export default async function Page() {
	const { userId } = auth();
	if (!userId) throw new Error("User not found");

	const user = await getHacker(userId, false);
	if (!user) throw new Error("User not found");
	return (
		<ProfileSettings
			bio={user.bio}
			university={user.hackerData.university}
		/>
	);
}

export const runtime = "edge";
